import { cached } from "./cache";
import { getRecentLeads, getSpamReport } from "./hubspot";
import type { HubSpotLead, SpamReport } from "./hubspot";
import { getCompetitorKeywords } from "./ahrefs";
import type { CompetitorResult } from "./ahrefs";
import { getMcpPsi, getMcpGsc, getMcpGa4, getMcpInventory } from "./mcp";
import type { McpPsiResult, GscRow, Ga4Report, McpInventory } from "./mcp";

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

export interface Ga4TrendPoint {
  date: string;
  activeUsers: number;
  sessions: number;
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
  gsc: {
    siteUrl: string;
    totals: GscTotals | null;
    queries: GscQueryRow[];
    error: string | null;
  };
  ga4: {
    propertyId: string;
    totals: { activeUsers: number; sessions: number } | null;
    trend: Ga4TrendPoint[];
    error: string | null;
  };
  clients: {
    configured: boolean;
    inventory: McpInventory | null;
    error: string | null;
  };
  targets: { url: string; domain: string };
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
 */
export async function getDashboardData(): Promise<DashboardData> {
  const targets = { url: TARGET_URL, domain: TARGET_DOMAIN };

  // HubSpot — good leads via the 1h Postgres cache, spam metrics via memoized report.
  let leads: HubSpotLead[] = [];
  let spam: SpamReport | null = null;
  let hubspotError: string | null = null;
  const hubspotConfigured = Boolean(process.env.HUBSPOT_SERVICE_KEY);
  if (hubspotConfigured) {
    try {
      leads = await getRecentLeads(30);
    } catch (err) {
      hubspotError = err instanceof Error ? err.message : String(err);
    }
    try {
      spam = await cached("spam-report", () => getSpamReport(30));
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

  // GSC — firstpage.com.hk search performance (top queries, last 30 days).
  let gscRows: GscRow[] = [];
  let gscError: string | null = null;
  try {
    gscRows = await cached(
      `mcp-gsc:${GSC_SITE}:${dataStartDate()}:${dataEndDate()}`,
      () => getMcpGsc(GSC_SITE, dataStartDate(), dataEndDate())
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

  // GA4 — firstpage.hk traffic (daily trend, last 30 days, relative dates).
  let ga4: { totals: { activeUsers: number; sessions: number } | null; trend: Ga4TrendPoint[] } = {
    totals: null,
    trend: [],
  };
  let ga4Error: string | null = null;
  try {
    const report = await cached(`mcp-ga4:${GA4_PROPERTY}`, () =>
      getMcpGa4(GA4_PROPERTY, ["activeUsers", "sessions"], ["date"], "30daysAgo", "today")
    );
    ga4 = parseGa4(report);
  } catch (err) {
    ga4Error = err instanceof Error ? err.message : String(err);
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

  return {
    hubspot: {
      configured: hubspotConfigured,
      leads,
      trend: buildTrend(leads),
      spam,
      error: hubspotError,
    },
    psi: { result: psi, error: psiError },
    ahrefs: { configured: ahrefsConfigured, result: ahrefsResult, error: ahrefsError },
    gsc: { siteUrl: GSC_SITE, totals: gscTotals, queries: gscQueries, error: gscError },
    ga4: { propertyId: GA4_PROPERTY, totals: ga4.totals, trend: ga4.trend, error: ga4Error },
    clients: { configured: mcpConfigured, inventory, error: clientsError },
    targets,
  };
}
