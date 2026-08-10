import { complete } from "./llm";
import { cached } from "./cache";
import type { DashboardData } from "./dashboard";

export interface AiPlan {
  /** One concrete, executable action. */
  action: string;
  /** Why — must cite a real number from the dashboard snapshot. */
  why: string;
  impact: "high" | "medium" | "low";
}

export interface AiPlans {
  website: AiPlan[];
  sales: AiPlan[];
}

const SYSTEM_PROMPT = `You are the growth strategist at First Page Digital, a Hong Kong performance marketing agency, advising on firstpage.hk (the agency's own site). Given the real dashboard snapshot, produce concrete actionable next-step plans.

Output STRICT JSON only, no prose around it, in exactly this shape:
{"website":[{"action":string,"why":string,"impact":"high"|"medium"|"low"}],"sales":[{"action":string,"why":string,"impact":"high"|"medium"|"low"}]}

Rules:
- 3-5 plans per section.
- Every "why" must cite a real number from the snapshot provided. Never fabricate metrics.
- Actions must be concrete and executable within a week by the team — not generic advice.
- "impact" is the expected business impact of doing it.`;

const pct = (n: number | null): string => (n === null ? "n/a" : `${n > 0 ? "+" : ""}${n.toFixed(0)}%`);

/** Compact, LLM-friendly snapshot of the dashboard metrics (real numbers only). */
export function buildDashboardSummary(d: DashboardData): string {
  const lines: string[] = [`Dashboard snapshot — last ${d.rangeDays} days (vs previous ${d.rangeDays} days)`];

  lines.push("\nWEBSITE");
  lines.push(`- GA4 active users: ${d.ga4.totals?.activeUsers ?? "n/a"} (delta ${pct(d.deltas.ga4Users)}), sessions: ${d.ga4.totals?.sessions ?? "n/a"} (delta ${pct(d.deltas.ga4Sessions)})`);
  lines.push(`- GSC: ${d.gsc.totals?.impressions ?? "n/a"} impressions (delta ${pct(d.deltas.gscImpressions)}), ${d.gsc.totals?.clicks ?? "n/a"} clicks (delta ${pct(d.deltas.gscClicks)}), CTR ${d.gsc.totals ? (d.gsc.totals.ctr * 100).toFixed(1) + "%" : "n/a"}, avg position ${d.gsc.totals?.position.toFixed(1) ?? "n/a"}`);
  if (d.gsc.queries.length) {
    lines.push(`- Top queries: ${d.gsc.queries.slice(0, 5).map((q) => `"${q.query}" (${q.clicks} clicks, pos ${q.position.toFixed(0)})`).join("; ")}`);
  }
  if (d.psi.result) {
    lines.push(`- PageSpeed mobile: ${d.psi.result.performanceScore ?? "n/a"}/100, LCP ${d.psi.result.lcpMs !== null ? (d.psi.result.lcpMs / 1000).toFixed(1) + "s" : "n/a"}, CLS ${d.psi.result.cls ?? "n/a"}`);
  }
  if (d.ahrefs.result?.keywords.length) {
    lines.push(`- Ahrefs top keywords: ${d.ahrefs.result.keywords.slice(0, 5).map((k) => `"${k.keyword}" (vol ${k.volume})`).join("; ")}`);
  }

  lines.push("\nSALES");
  lines.push(`- Leads: ${d.hubspot.leads.length} (delta ${pct(d.deltas.leads)}), spam rate ${d.hubspot.spam?.spamRatePct ?? "n/a"}% (delta ${d.deltas.spamRate !== null ? `${d.deltas.spamRate > 0 ? "+" : ""}${d.deltas.spamRate.toFixed(1)}pp` : "n/a"})`);
  if (d.hubspot.spam?.topSources.length) {
    lines.push(`- Top spam sources: ${d.hubspot.spam.topSources.slice(0, 3).map((s) => `${s.domain} (${s.count})`).join("; ")}`);
  }
  const deals = d.deals.aggregate;
  lines.push(`- Deals created: ${deals?.newCount ?? "n/a"}, new pipeline ${deals ? "$" + deals.pipelineValue.toLocaleString() : "n/a"} (delta ${pct(d.deltas.pipelineValue)}), avg deal size ${deals?.avgAmount ? "$" + deals.avgAmount.toLocaleString() : "n/a"}`);
  lines.push(`- Closed-won: ${deals?.closedWon.count ?? "n/a"} deals, ${deals ? "$" + deals.closedWon.revenue.toLocaleString() : "n/a"} (delta ${pct(d.deltas.closedWonRevenue)})`);
  if (deals?.perOwner.length) {
    lines.push(`- Leaderboard: ${deals.perOwner.map((o) => `${o.ownerName} $${o.wonRevenue.toLocaleString()}`).join("; ")}`);
  }
  lines.push(`- Tool usage: ${d.usage.totalRuns} runs, $${d.usage.totalCostUsd.toFixed(2)} LLM cost; top tools: ${d.usage.perTool.slice(0, 3).map((t) => `${t.tool_slug} (${t.runs})`).join("; ") || "none yet"}`);

  return lines.join("\n");
}

function isImpact(v: unknown): v is AiPlan["impact"] {
  return v === "high" || v === "medium" || v === "low";
}

function isPlan(v: unknown): v is AiPlan {
  if (typeof v !== "object" || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.action === "string" && p.action.length > 0 &&
    typeof p.why === "string" && p.why.length > 0 &&
    isImpact(p.impact)
  );
}

function parsePlans(raw: string): AiPlans | null {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const o = parsed as Record<string, unknown>;
  const website = Array.isArray(o.website) ? o.website.filter(isPlan) : [];
  const sales = Array.isArray(o.sales) ? o.sales.filter(isPlan) : [];
  if (website.length === 0 && sales.length === 0) return null;
  return { website, sales };
}

/**
 * AI-suggested actionable plans for the dashboard. Memoized 1h (same TTL as the
 * underlying dashboard data). Returns null when OPENROUTER_API is unset, the
 * LLM call fails, or the output fails validation — the page then falls back to
 * the rule-driven insights only.
 */
export async function buildAiPlans(d: DashboardData): Promise<AiPlans | null> {
  if (!process.env.OPENROUTER_API && !process.env.OPENROUTER_API_KEY) return null;
  try {
    return await cached(`ai-plans:${d.rangeDays}`, async () => {
      const result = await complete({
        system: SYSTEM_PROMPT,
        user: buildDashboardSummary(d),
      });
      return parsePlans(result.text);
    });
  } catch (err) {
    console.error("buildAiPlans failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
