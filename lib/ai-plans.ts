import { complete } from "./llm";
import { cached } from "./cache";
import type { WebsiteData, SalesData } from "./dashboard";

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
export function buildDashboardSummary(web: WebsiteData, sales: SalesData): string {
  const lines: string[] = [`Dashboard snapshot — last ${web.rangeDays} days (vs previous ${web.rangeDays} days)`];

  lines.push("\nWEBSITE");
  lines.push(`- GA4 active users: ${web.ga4.totals?.activeUsers ?? "n/a"} (delta ${pct(web.deltas.ga4Users)}), sessions: ${web.ga4.totals?.sessions ?? "n/a"} (delta ${pct(web.deltas.ga4Sessions)})`);
  lines.push(`- GSC: ${web.gsc.totals?.impressions ?? "n/a"} impressions (delta ${pct(web.deltas.gscImpressions)}), ${web.gsc.totals?.clicks ?? "n/a"} clicks (delta ${pct(web.deltas.gscClicks)}), CTR ${web.gsc.totals ? (web.gsc.totals.ctr * 100).toFixed(1) + "%" : "n/a"}, avg position ${web.gsc.totals?.position.toFixed(1) ?? "n/a"}`);
  if (web.gsc.queries.length) {
    lines.push(`- Top queries: ${web.gsc.queries.slice(0, 5).map((q) => `"${q.query}" (${q.clicks} clicks, pos ${q.position.toFixed(0)})`).join("; ")}`);
  }
  if (web.psi.result) {
    lines.push(`- PageSpeed mobile: ${web.psi.result.performanceScore ?? "n/a"}/100, LCP ${web.psi.result.lcpMs !== null ? (web.psi.result.lcpMs / 1000).toFixed(1) + "s" : "n/a"}, CLS ${web.psi.result.cls ?? "n/a"}`);
  }
  if (web.ahrefs.result?.keywords.length) {
    lines.push(`- Ahrefs top keywords: ${web.ahrefs.result.keywords.slice(0, 5).map((k) => `"${k.keyword}" (vol ${k.volume})`).join("; ")}`);
  }

  lines.push("\nSALES");
  lines.push(`- Leads: ${sales.hubspot.leads.length} (delta ${pct(sales.deltas.leads)}), spam rate ${sales.hubspot.spam?.spamRatePct ?? "n/a"}% (delta ${sales.deltas.spamRate !== null ? `${sales.deltas.spamRate > 0 ? "+" : ""}${sales.deltas.spamRate.toFixed(1)}pp` : "n/a"})`);
  if (sales.hubspot.spam?.topSources.length) {
    lines.push(`- Top spam sources: ${sales.hubspot.spam.topSources.slice(0, 3).map((s) => `${s.domain} (${s.count})`).join("; ")}`);
  }
  const deals = sales.deals.aggregate;
  lines.push(`- Deals created: ${deals?.newCount ?? "n/a"}, new pipeline ${deals ? "$" + deals.pipelineValue.toLocaleString() : "n/a"} (delta ${pct(sales.deltas.pipelineValue)}), avg deal size ${deals?.avgAmount ? "$" + deals.avgAmount.toLocaleString() : "n/a"}`);
  lines.push(`- Closed-won: ${deals?.closedWon.count ?? "n/a"} deals, ${deals ? "$" + deals.closedWon.revenue.toLocaleString() : "n/a"} (delta ${pct(sales.deltas.closedWonRevenue)})`);
  if (deals?.perOwner.length) {
    lines.push(`- Leaderboard: ${deals.perOwner.map((o) => `${o.ownerName} $${o.wonRevenue.toLocaleString()}`).join("; ")}`);
  }
  lines.push(`- Tool usage: ${sales.usage.totalRuns} runs, $${sales.usage.totalCostUsd.toFixed(2)} LLM cost; top tools: ${sales.usage.perTool.slice(0, 3).map((t) => `${t.tool_slug} (${t.runs})`).join("; ") || "none yet"}`);

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
 * AI-suggested actionable plans for the dashboard. ONE shared LLM call for
 * both zones (memoized 1h, same TTL as the underlying dashboard data) — the
 * page feeds both sections from the same promise so the call never doubles.
 * Returns null when OPENROUTER_API is unset, the LLM call fails, or the output
 * fails validation — the page then falls back to the rule-driven insights only.
 */
export async function buildAiPlans(web: WebsiteData, sales: SalesData): Promise<AiPlans | null> {
  if (!process.env.OPENROUTER_API && !process.env.OPENROUTER_API_KEY) return null;
  try {
    return await cached(`ai-plans:${web.rangeDays}`, async () => {
      const result = await complete({
        system: SYSTEM_PROMPT,
        user: buildDashboardSummary(web, sales),
      });
      return parsePlans(result.text);
    });
  } catch (err) {
    console.error("buildAiPlans failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
