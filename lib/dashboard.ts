import { cached } from "./cache";
import { getRecentLeads, getSpamReport, fetchRecentLeads } from "./hubspot";
import type { HubSpotLead, SpamReport } from "./hubspot";
import { getCompetitorKeywords, getAiVisibility } from "./ahrefs";
import type { CompetitorResult, AiVisibilityResult } from "./ahrefs";
import { getMcpPsi, getMcpGsc, getMcpGa4, getMcpInventory } from "./mcp";
import type { McpPsiResult, GscRow, Ga4Report, McpInventory } from "./mcp";
import { getDealsReport, aggregateDeals } from "./hubspot-deals";
import type { DealsAggregate } from "./hubspot-deals";
import { getEngagementReport } from "./hubspot-engagement";
import type { EngagementReport } from "./hubspot-engagement";
import { getUsageStats } from "./usage";
import type { UsageStats } from "./usage";

// ponytail: dashboard targets are env-configurable, defaulting to FirstPage HK.
const TARGET_URL = process.env.DASHBOARD_TARGET_URL || "https://firstpage.hk";
const TARGET_DOMAIN = process.env.DASHBOARD_TARGET_DOMAIN || "firstpage.hk";
const GSC_SITE = process.env.DASHBOARD_GSC_SITE || "https://www.firstpage.hk/";
const GA4_PROPERTY = process.env.DASHBOARD_GA4_PROPERTY || "374723776"; // firstpage.hk

// GSC only accepts YYYY-MM-DD; the sandbox clock runs ~1y ahead of Google's
// data window, so allow an explicit end date override (production: unset).
function dataEndDate(): string {
  return (
    process.env.DASHBOARD_DATA_END_DATE ||
    new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
}
function dataStartDate(days = 29): string {
  const end = new Date(`${dataEndDate()}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() - days);
  return end.toISOString().slice(0, 10);
}

export interface LeadTrendPoint {
  /** YYYY-MM-DD (UTC) */
  date: string;
  leads: number;
}

export interface GscTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** One day of GSC totals (group_by=date) — feeds the Organic clicks KPI sparkline. */
export interface GscDailyPoint {
  /** YYYY-MM-DD */
  date: string;
  clicks: number;
}

export interface Ga4TrendPoint {
  date: string;
  activeUsers: number;
  sessions: number;
}

/**
 * Percentage deltas vs the previous window of the same length.
 * Ratio metrics use percentage points (spamRate); position is omitted (not a
 * sum — can't derive the previous window by subtraction).
 */
export interface Deltas {
  leads: number | null;
  spamRate: number | null;
  ga4Users: number | null;
  ga4Sessions: number | null;
  gscClicks: number | null;
  gscImpressions: number | null;
  closedWonRevenue: number | null;
  pipelineValue: number | null;
  usageRuns: number | null;
  usageCost: number | null;
}

export interface DashboardData {
  hubspot: {
    configured: boolean;
    leads: HubSpotLead[];
    trend: LeadTrendPoint[];
    spam: SpamReport | null;
    error: string | null;
  };
  psi: {
    result: McpPsiResult | null;
    error: string | null;
  };
  ahrefs: {
    configured: boolean;
    result: CompetitorResult | null;
    error: string | null;
  };
  aiVisibility: {
    result: AiVisibilityResult | null;
    error: string | null;
  };
  gsc: {
    siteUrl: string;
    totals: GscTotals | null;
    queries: GscQueryRow[];
    daily: GscDailyPoint[];
    error: string | null;
  };
  ga4: {
    propertyId: string;
    totals: { activeUsers: number; sessions: number } | null;
    trend: Ga4TrendPoint[];
    error: string | null;
  };
  deals: {
    aggregate: DealsAggregate | null;
    error: string | null;
  };
  engagement: {
    report: EngagementReport | null;
    error: string | null;
  };
  usage: UsageStats;
  clients: {
    configured: boolean;
    inventory: McpInventory | null;
    error: string | null;
  };
  targets: { url: string; domain: string };
  rangeDays: number;
  deltas: Deltas;
}

/** Percent change, null when the previous baseline is zero. */
function pctChange(cur: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}

/** Bucket leads into a zero-filled daily timeline (UTC) so the chart is continuous. */
function buildTrend(leads: HubSpotLead[], days = 30): LeadTrendPoint[] {
  const byDay = new Map<string, number>();
  for (const l of leads) {
    if (l.createdAt) {
      const day = l.createdAt.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
  }
  const points: LeadTrendPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setUTCDate(now.getUTCDate() - i);
    const key = day.toISOString().slice(0, 10);
    points.push({ date: key, leads: byDay.get(key) ?? 0 });
  }
  return points;
}

function sumGsc(rows: GscRow[]): GscTotals {
  const clicks = rows.reduce((s, r) => s + (r.clicks ?? 0), 0);
  const impressions = rows.reduce((s, r) => s + (r.impressions ?? 0), 0);
  const avgPos = rows.length
    ? rows.reduce((s, r) => s + (r.position ?? 0), 0) / rows.length
    : 0;
  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position: avgPos,
  };
}

function parseGa4(report: Ga4Report): {
  totals: { activeUsers: number; sessions: number } | null;
  trend: Ga4TrendPoint[];
} {
  const uIdx = report.metricHeaders.findIndex((h) => h.name === "activeUsers");
  const sIdx = report.metricHeaders.findIndex((h) => h.name === "sessions");
  const trend: Ga4TrendPoint[] = [];
  let users = 0;
  let sessions = 0;
  for (const row of report.rows) {
    const u = Number(row.metricValues[uIdx]?.value ?? 0);
    const s = Number(row.metricValues[sIdx]?.value ?? 0);
    users += u;
    sessions += s;
    if (row.dimensionValues?.[0]?.value) {
      trend.push({ date: row.dimensionValues[0].value, activeUsers: u, sessions: s });
    }
  }
  trend.sort((a, b) => a.date.localeCompare(b.date));
  return {
    totals: report.rows.length ? { activeUsers: users, sessions } : null,
    trend,
  };
}

// PSI (keyless free tier) rate-limits with 429s on the shared quota; MCP uses
// firstpage's own key. Either way, memoize failures for a minute so quota'd
// renders don't hammer the provider on every page load.
let psiFailureAt = 0;
let psiFailureMsg: string | null = null;

async function fetchPsiSafely(): Promise<{
  result: McpPsiResult | null;
  error: string | null;
}> {
  if (psiFailureAt && Date.now() - psiFailureAt < 60_000) {
    return { result: null, error: psiFailureMsg };
  }
  try {
    const result = await cached("mcp-psi", () => getMcpPsi(TARGET_URL));
    psiFailureAt = 0;
    psiFailureMsg = null;
    return { result, error: null };
  } catch (err) {
    psiFailureAt = Date.now();
    psiFailureMsg = err instanceof Error ? err.message : String(err);
    return { result: null, error: psiFailureMsg };
  }
}

/**
 * Aggregate dashboard data for the / page.
 * Every section degrades gracefully: missing keys and API failures surface as
 * `configured: false` / `error` instead of throwing, so the page always renders.
 * `days` is the dashboard range window; deltas compare against the previous
 * window of the same length (2d window − d window, valid because every metric
 * here is a sum).
 */
export async function getDashboardData(days = 30): Promise<DashboardData> {
  const targets = { url: TARGET_URL, domain: TARGET_DOMAIN };

  // HubSpot — good leads via the 1h Postgres cache, spam metrics via memoized report.
  let leads: HubSpotLead[] = [];
  let spam: SpamReport | null = null;
  let hubspotError: string | null = null;
  const hubspotConfigured = Boolean(process.env.HUBSPOT_SERVICE_KEY);
  if (hubspotConfigured) {
    try {
      leads = await getRecentLeads(days);
    } catch (err) {
      hubspotError = err instanceof Error ? err.message : String(err);
    }
    try {
      spam = await cached(`spam-report:${days}`, () => getSpamReport(days));
    } catch (err) {
      if (!hubspotError) hubspotError = err instanceof Error ? err.message : String(err);
    }
  }

  // PageSpeed via MCP (firstpage's own key) — degrade on API failure.
  const { result: psi, error: psiError } = await fetchPsiSafely();

  // Ahrefs — needs AHREFS_API_KEY.
  let ahrefsResult: CompetitorResult | null = null;
  let ahrefsError: string | null = null;
  const ahrefsConfigured = Boolean(process.env.AHREFS_API_KEY);
  if (ahrefsConfigured) {
    try {
      ahrefsResult = await cached("ahrefs", () =>
        getCompetitorKeywords(TARGET_DOMAIN, { country: "hk", limit: 10 })
      );
    } catch (err) {
      ahrefsError = err instanceof Error ? err.message : String(err);
    }
  }

  // AI visibility (Ahrefs) — 15 units/platform/call, moves slowly → 6h cache.
  let aiVisibility: AiVisibilityResult | null = null;
  let aiVisibilityError: string | null = null;
  if (ahrefsConfigured) {
    try {
      aiVisibility = await cached("ahrefs-ai", () => getAiVisibility(TARGET_DOMAIN), 6 * 60 * 60 * 1000);
    } catch (err) {
      aiVisibilityError = err instanceof Error ? err.message : String(err);
    }
  }

  // GSC — search performance. Windows are exact `days` calendar days each and
  // non-overlapping: current = [E−days+1, E], previous = [E−2d+1, E−days],
  // where E = yesterday. (dataStartDate(n) is E−n, so current starts at
  // dataStartDate(days−1) and previous ends at dataStartDate(days).)
  let gscRows: GscRow[] = [];
  let gscError: string | null = null;
  try {
    gscRows = await cached(
      `mcp-gsc:${GSC_SITE}:${dataStartDate(days - 1)}:${dataEndDate()}`,
      () => getMcpGsc(GSC_SITE, dataStartDate(days - 1), dataEndDate())
    );
  } catch (err) {
    gscError = err instanceof Error ? err.message : String(err);
  }
  const gscTotals = gscRows.length ? sumGsc(gscRows) : null;
  const gscQueries: GscQueryRow[] = gscRows
    .map((r) => ({
      query: (r.keys ?? []).join(" "),
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    }))
    .slice(0, 8);
  // Daily clicks series (group_by=date) — feeds the Organic clicks KPI sparkline.
  // Best-effort: on failure the sparkline just stays empty.
  let gscDaily: GscDailyPoint[] = [];
  try {
    const dailyRows = await cached(
      `mcp-gsc-daily:${GSC_SITE}:${dataStartDate(days - 1)}:${dataEndDate()}`,
      () => getMcpGsc(GSC_SITE, dataStartDate(days - 1), dataEndDate(), 31, ["date"])
    );
    gscDaily = dailyRows
      .map((r) => ({ date: (r.keys ?? [])[0] ?? "", clicks: r.clicks ?? 0 }))
      .filter((p) => p.date.length === 10);
  } catch {
    // daily GSC is best-effort
  }
  let gscPrevTotals: GscTotals | null = null;
  try {
    const gscPrevRows = await cached(
      `mcp-gsc:${GSC_SITE}:${dataStartDate(2 * days - 1)}:${dataStartDate(days)}`,
      () => getMcpGsc(GSC_SITE, dataStartDate(2 * days - 1), dataStartDate(days))
    );
    gscPrevTotals = gscPrevRows.length ? sumGsc(gscPrevRows) : null;
  } catch {
    // previous-window GSC is best-effort — deltas just go null
  }

  // GA4 — traffic trend. The previous window is fetched as its OWN explicit
  // window (not 2d−d subtraction): activeUsers is a unique-user count, and
  // unique counts don't add across windows, so 2d−d would understate the prior
  // window and inflate the delta.
  let ga4: { totals: { activeUsers: number; sessions: number } | null; trend: Ga4TrendPoint[] } = {
    totals: null,
    trend: [],
  };
  let ga4Error: string | null = null;
  try {
    const report = await cached(`mcp-ga4:${GA4_PROPERTY}:${days}`, () =>
      getMcpGa4(GA4_PROPERTY, ["activeUsers", "sessions"], ["date"], `${days}daysAgo`, "today")
    );
    ga4 = parseGa4(report);
  } catch (err) {
    ga4Error = err instanceof Error ? err.message : String(err);
  }
  let ga4Prev: { totals: { activeUsers: number; sessions: number } | null; trend: Ga4TrendPoint[] } = {
    totals: null,
    trend: [],
  };
  try {
    const reportPrev = await cached(`mcp-ga4:${GA4_PROPERTY}:prev:${days}`, () =>
      getMcpGa4(GA4_PROPERTY, ["activeUsers", "sessions"], ["date"], `${2 * days}daysAgo`, `${days}daysAgo`)
    );
    ga4Prev = parseGa4(reportPrev);
  } catch {
    // best-effort — deltas just go null
  }

  // Deals — pipeline + closed-won (current + double window for deltas).
  let deals: DealsAggregate | null = null;
  let dealsError: string | null = null;
  const dealsConfigured = Boolean(process.env.HUBSPOT_SERVICE_KEY);
  if (dealsConfigured) {
    try {
      const report = await cached(`deals-report:${days}`, () => getDealsReport(days));
      deals = aggregateDeals(report);
    } catch (err) {
      dealsError = err instanceof Error ? err.message : String(err);
    }
  }
  let dealsPrev: DealsAggregate | null = null;
  if (dealsConfigured) {
    try {
      const report2x = await cached(`deals-report:${2 * days}`, () => getDealsReport(2 * days));
      dealsPrev = aggregateDeals(report2x);
    } catch {
      // best-effort
    }
  }

  // Usage events — windowed Postgres stats (current + double window for deltas).
  const usage = await getUsageStats(days);
  const usage2x = await getUsageStats(2 * days);

  // Engagement cross-check — heavy (notes + associations), memoized 1h.
  let engagement: EngagementReport | null = null;
  let engagementError: string | null = null;
  if (hubspotConfigured) {
    try {
      engagement = await cached(`engagement:${days}`, () => getEngagementReport(days));
    } catch (err) {
      engagementError = err instanceof Error ? err.message : String(err);
    }
  }

  // Client portfolio size — count of every accessible GSC site + GA4 property.
  let inventory: McpInventory | null = null;
  let clientsError: string | null = null;
  const mcpConfigured = Boolean(process.env.FP_MCP_API_KEY);
  if (mcpConfigured) {
    try {
      inventory = await cached("mcp-inventory", () => getMcpInventory());
    } catch (err) {
      clientsError = err instanceof Error ? err.message : String(err);
    }
  }

  // ---- previous-window baselines (sum metrics: 2d − d) ----------------------
  let leadsPrevCount = 0;
  let spamPrev: { total: number; spam: number } | null = null;
  if (hubspotConfigured) {
    try {
      // Explicit previous window [now−2d, now−d) — leads are deduped by email,
      // so "double window minus window" would understate the prior window.
      leadsPrevCount = (await cached(`leads-prev:${days}`, () => fetchRecentLeads(2 * days, days))).length;
    } catch {
      // best-effort
    }
    if (spam) {
      try {
        const s2x = await cached(`spam-report:${2 * days}`, () => getSpamReport(2 * days));
        spamPrev = {
          total: Math.max(0, s2x.total - spam.total),
          spam: Math.max(0, s2x.spam - spam.spam),
        };
      } catch {
        // best-effort
      }
    }
  }

  const ga4Totals = ga4.totals;
  const ga4PrevTotals = ga4Prev.totals;

  const prevClosedWon = dealsPrev
    ? { count: dealsPrev.closedWon.count - (deals?.closedWon.count ?? 0), revenue: dealsPrev.closedWon.revenue - (deals?.closedWon.revenue ?? 0) }
    : null;
  const prevPipeline = dealsPrev
    ? dealsPrev.pipelineValue - (deals?.pipelineValue ?? 0)
    : null;

  const deltas: Deltas = {
    leads: pctChange(leads.length, leadsPrevCount),
    spamRate:
      spam && spamPrev && spam.total > 0 && spamPrev.total > 0
        ? // exact rates on both sides — spamRatePct is rounded to an integer,
          // mixing it with the exact previous rate could flip the ±2pp threshold
          (spam.spam / spam.total) * 100 - (spamPrev.spam / spamPrev.total) * 100
        : null,
    ga4Users: ga4Totals && ga4PrevTotals ? pctChange(ga4Totals.activeUsers, ga4PrevTotals.activeUsers) : null,
    ga4Sessions: ga4Totals && ga4PrevTotals ? pctChange(ga4Totals.sessions, ga4PrevTotals.sessions) : null,
    gscClicks: gscTotals && gscPrevTotals ? pctChange(gscTotals.clicks, gscPrevTotals.clicks) : null,
    gscImpressions: gscTotals && gscPrevTotals ? pctChange(gscTotals.impressions, gscPrevTotals.impressions) : null,
    closedWonRevenue: deals && prevClosedWon ? pctChange(deals.closedWon.revenue, prevClosedWon.revenue) : null,
    pipelineValue: deals ? pctChange(deals.pipelineValue, prevPipeline ?? 0) : null,
    usageRuns: pctChange(usage.totalRuns, usage2x.totalRuns - usage.totalRuns),
    usageCost: pctChange(usage.totalCostUsd, usage2x.totalCostUsd - usage.totalCostUsd),
  };

  return {
    hubspot: {
      configured: hubspotConfigured,
      leads,
      trend: buildTrend(leads, days),
      spam,
      error: hubspotError,
    },
    psi: { result: psi, error: psiError },
    ahrefs: { configured: ahrefsConfigured, result: ahrefsResult, error: ahrefsError },
    aiVisibility: { result: aiVisibility, error: aiVisibilityError },
    gsc: { siteUrl: GSC_SITE, totals: gscTotals, queries: gscQueries, daily: gscDaily, error: gscError },
    ga4: { propertyId: GA4_PROPERTY, totals: ga4.totals, trend: ga4.trend, error: ga4Error },
    deals: { aggregate: deals, error: dealsError },
    engagement: { report: engagement, error: engagementError },
    usage,
    clients: { configured: mcpConfigured, inventory, error: clientsError },
    targets,
    rangeDays: days,
    deltas,
  };
}
