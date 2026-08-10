// Lightweight MCP JSON-RPC client for the firstpage MCP server
// (https://mcp.firstpage.com.hk/mcp/, bearer key from FP_MCP_API_KEY).
// Server-side only — never import from client components.
// Protocol verified against firstpage-mcp 0.1.1: no session id required,
// tools/call returns JSON or SSE, results are text content (usually JSON).

const MCP_URL = process.env.FP_MCP_URL || "https://mcp.firstpage.com.hk/mcp/";
const MCP_PROTOCOL_VERSION = "2025-03-26";

export class McpError extends Error {}

let initialized: Promise<void> | null = null;

function apiKey(): string {
  const key = process.env.FP_MCP_API_KEY;
  if (!key) throw new McpError("FP_MCP_API_KEY not configured");
  return key;
}

function baseHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
}

async function ensureInitialized(): Promise<void> {
  if (!initialized) {
    initialized = (async () => {
      const res = await fetch(MCP_URL, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: MCP_PROTOCOL_VERSION,
            capabilities: {},
            clientInfo: { name: "fp-dashboard", version: "1.0.0" },
          },
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new McpError(`MCP initialize failed: ${res.status}`);
      await fetch(MCP_URL, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
        signal: AbortSignal.timeout(10_000),
      }).catch(() => undefined); // notification — ignore transport errors
    })().catch((err) => {
      initialized = null;
      throw err;
    });
  }
  return initialized;
}

/** Call an MCP tool; parses the JSON text payload, throws McpError on failure. */
export async function mcpCall<T = unknown>(
  tool: string,
  args: Record<string, unknown>
): Promise<T> {
  await ensureInitialized();
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: tool, arguments: args },
    }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!res.ok) throw new McpError(`MCP ${tool} http ${res.status}`);
  const data: { error?: { message?: string }; result?: { content?: { type?: string; text?: string }[] } } =
    await res.json();
  if (data.error) {
    throw new McpError(`${tool}: ${data.error.message ?? JSON.stringify(data.error)}`);
  }
  const content = data.result?.content ?? [];
  const txt = content
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("\n");
  if (!txt) throw new McpError(`${tool}: empty result`);
  try {
    return JSON.parse(txt) as T;
  } catch {
    return txt as T;
  }
}

// ---- typed data helpers ----------------------------------------------------

export interface McpPsiResult {
  url: string;
  performanceScore: number | null; // 0-100
  lcpMs: number | null;
  cls: number | null;
}

/** PageSpeed audit via MCP (firstpage's own key — no shared free-tier quota). */
export async function getMcpPsi(
  url: string,
  strategy: "mobile" | "desktop" = "mobile"
): Promise<McpPsiResult> {
  const raw = await mcpCall<{
    scores?: Record<string, { score?: number }>;
    core_web_vitals?: {
      largest_contentful_paint?: number;
      cumulative_layout_shift?: number;
    };
  }>("psi_audit", { url, strategy });
  const perf = raw.scores?.performance?.score;
  return {
    url,
    performanceScore: perf != null ? Math.round(perf * 100) : null,
    lcpMs: raw.core_web_vitals?.largest_contentful_paint ?? null,
    cls: raw.core_web_vitals?.cumulative_layout_shift ?? null,
  };
}

export interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** GSC search performance rows (per-query) for a site + YYYY-MM-DD range. */
export async function getMcpGsc(
  siteUrl: string,
  startDate: string,
  endDate: string,
  rowLimit = 1000
): Promise<GscRow[]> {
  return mcpCall<GscRow[]>("gsc_search_performance", {
    site_url: siteUrl,
    start_date: startDate,
    end_date: endDate,
    row_limit: rowLimit,
  });
}

export interface Ga4Row {
  dimensionValues?: { value: string }[];
  metricValues: { value: string }[];
}

export interface Ga4Report {
  metricHeaders: { name: string }[];
  rows: Ga4Row[];
}

/** GA4 report via MCP. property_id is the bare numeric id (no properties/ prefix). */
export async function getMcpGa4(
  propertyId: string,
  metrics: string[],
  dimensions: string[] | undefined,
  startDate: string,
  endDate: string
): Promise<Ga4Report> {
  const args: Record<string, unknown> = {
    property_id: propertyId,
    metrics,
    start_date: startDate,
    end_date: endDate,
    row_limit: 40,
  };
  if (dimensions) args.dimensions = dimensions;
  return mcpCall<Ga4Report>("ga4_run_report", args);
}

export interface McpInventory {
  gscSites: number;
  ga4Properties: number;
}

/** Client portfolio size — count of all accessible GSC sites + GA4 properties. */
export async function getMcpInventory(): Promise<McpInventory> {
  const [gsc, ga4] = await Promise.all([
    mcpCall<unknown[]>("gsc_list_sites", {}),
    mcpCall<unknown[]>("ga4_list_properties", {}),
  ]);
  return {
    gscSites: Array.isArray(gsc) ? gsc.length : 0,
    ga4Properties: Array.isArray(ga4) ? ga4.length : 0,
  };
}

export interface RichResultItem {
  type: string;
  items: string[];
}

export interface McpUrlInspection {
  url: string;
  verdict: string | null;
  coverageState: string | null;
  robotsTxtState: string | null;
  indexingState: string | null;
  pageFetchState: string | null;
  googleCanonical: string | null;
  userCanonical: string | null;
  lastCrawlTime: string | null;
  sitemaps: string[];
  referringUrls: string[];
  mobileUsability: string | null;
  richResults: RichResultItem[];
}

/** GSC URL inspection — index status + mobile usability + rich results for one URL. */
export async function getMcpUrlInspection(
  siteUrl: string,
  inspectionUrl: string
): Promise<McpUrlInspection> {
  const raw = await mcpCall<{
    inspectionResult?: {
      indexStatusResult?: Record<string, unknown>;
      mobileUsabilityResult?: { verdict?: string };
      richResultsResult?: {
        verdict?: string;
        detectedItems?: { richResultType?: string; items?: { name?: string }[] }[];
      };
    };
  }>("gsc_url_inspection", { site_url: siteUrl, inspection_url: inspectionUrl });
  const r = raw.inspectionResult ?? {};
  const idx = (r.indexStatusResult ?? {}) as Record<string, unknown>;
  const mob = r.mobileUsabilityResult ?? {};
  const rich = r.richResultsResult ?? {};
  return {
    url: inspectionUrl,
    verdict: idx.verdict ? String(idx.verdict) : null,
    coverageState: idx.coverageState ? String(idx.coverageState) : null,
    robotsTxtState: idx.robotsTxtState ? String(idx.robotsTxtState) : null,
    indexingState: idx.indexingState ? String(idx.indexingState) : null,
    pageFetchState: idx.pageFetchState ? String(idx.pageFetchState) : null,
    googleCanonical: idx.googleCanonical ? String(idx.googleCanonical) : null,
    userCanonical: idx.userCanonical ? String(idx.userCanonical) : null,
    lastCrawlTime: idx.lastCrawlTime ? String(idx.lastCrawlTime) : null,
    sitemaps: Array.isArray(idx.sitemap) ? (idx.sitemap as string[]) : [],
    referringUrls: Array.isArray(idx.referringUrls) ? (idx.referringUrls as string[]) : [],
    mobileUsability: mob.verdict ?? null,
    richResults: (Array.isArray(rich.detectedItems) ? rich.detectedItems : []).map((d) => ({
      type: d.richResultType ?? "unknown",
      items: (Array.isArray(d.items) ? d.items : []).map((i) => i.name ?? ""),
    })),
  };
}
