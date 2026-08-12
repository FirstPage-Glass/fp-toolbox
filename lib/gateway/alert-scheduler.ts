/**
 * Gateway alert scheduler — polls OpenRouter key usage every GATEWAY_POLL_MINUTES
 * (default 60), snapshots each team's BYOK spend, and pushes 80%/100% alerts:
 *  - in-app: rows in deepseek_alerts_log (rendered by /gateway)
 *  - webhook: SLACK_WEBHOOK_URL (fire-and-forget, never crashes the loop)
 * Deduped per (team, level, calendar month) by the DB unique constraint.
 *
 * Started from root instrumentation.ts (same pattern as lib/uptime-scheduler.ts).
 */
import { listTeams, recordAlert, recordUsageSnapshot } from "./db";
import { listKeys } from "./openrouter";

const globalKey = "__firstpageGatewayAlertSchedulerStarted";
const DEFAULT_POLL_MINUTES = 60;

type GlobalWithGateway = typeof globalThis & { [globalKey]?: boolean };

/** Start the hourly usage poller. Safe to call multiple times (HMR guard). */
export function startGatewayAlertScheduler(): void {
  const g = globalThis as GlobalWithGateway;
  if (g[globalKey]) return;
  g[globalKey] = true;

  const minutes = Math.max(10, Number(process.env.GATEWAY_POLL_MINUTES) || DEFAULT_POLL_MINUTES);
  const run = (): void => {
    runGatewayAlertCheck().catch((err) => {
      console.error("[gateway] alert check failed:", err);
    });
  };
  run(); // poll once at boot, then every N minutes
  setInterval(run, minutes * 60 * 1000);
  console.log(`[gateway] alert checker started (every ${minutes} min)`);
}

/** One poll pass: snapshot usage + emit new 80%/100% alerts. Exported for manual runs. */
export async function runGatewayAlertCheck(): Promise<void> {
  if (!process.env.OPENROUTER_MANAGEMENT_KEY) {
    console.warn("[gateway] OPENROUTER_MANAGEMENT_KEY unset — skipping alert check");
    return;
  }

  const teams = await listTeams();
  if (teams.length === 0) return;

  const keys = await listKeys();
  const byHash = new Map(keys.map((k) => [k.hash, k]));
  const webhook = process.env.SLACK_WEBHOOK_URL;

  for (const team of teams) {
    if (!team.keyHash) continue;
    const key = byHash.get(team.keyHash);
    if (!key) continue; // externally revoked / hash mismatch — nothing to track

    const usage = key.byokUsageMonthly;
    const limit = team.limitUsd;
    await recordUsageSnapshot(team.id, usage, limit);

    const pct = (usage / limit) * 100;
    if (pct >= 100) {
      const fresh = await recordAlert(team.id, "100", usage);
      if (fresh) {
        await pushWebhook(
          webhook,
          `🚨 *${team.name}* hit its $${limit}/month DeepSeek limit ($${usage.toFixed(2)} spent). OpenRouter is now blocking requests — champion: ${team.champion}.`
        );
      }
    } else if (pct >= 80) {
      const fresh = await recordAlert(team.id, "80", usage);
      if (fresh) {
        await pushWebhook(
          webhook,
          `⚠️ *${team.name}* is at ${Math.round(pct)}% of its $${limit}/month DeepSeek pool ($${usage.toFixed(2)} spent). ~$${Math.max(0, limit - usage).toFixed(2)} left — champion: ${team.champion}.`
        );
      }
    }
  }
}

async function pushWebhook(url: string | undefined, text: string): Promise<void> {
  if (!url) return; // in-app alert still recorded; webhook is optional
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("[gateway] webhook push failed:", err);
  }
}
