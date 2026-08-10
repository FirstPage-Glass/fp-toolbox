export interface AhrefsKeyword {
  keyword: string;
  volume: number;
}

export interface CompetitorResult {
  target: string;
  keywords: AhrefsKeyword[];
}

export interface AiVisibilityPlatform {
  name: string;
  citations: number;
  pages: number;
}

export interface AhrefsOverview {
  target: string;
  backlinks: number;
  refdomains: number;
  domainRating: number;
}

/**
 * Ahrefs site-overview for a domain: backlink count, referring domains and
 * domain rating (live data, current date). Uses the v3 `domain-rating` and
 * `backlinks-stats` endpoints. Server-side only.
 */
export async function getAhrefsOverview(target: string): Promise<AhrefsOverview> {
  const apiKey = process.env.AHREFS_API_KEY;
  if (!apiKey) {
    throw new Error("AHREFS_API_KEY not configured");
  }
  const date = new Date().toISOString().slice(0, 10);
  const [drRes, bsRes] = await Promise.all([
    fetch(
      `https://api.ahrefs.com/v3/site-explorer/domain-rating?target=${encodeURIComponent(
        target
      )}&date=${date}`,
      { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(30_000) }
    ),
    fetch(
      `https://api.ahrefs.com/v3/site-explorer/backlinks-stats?target=${encodeURIComponent(
        target
      )}&date=${date}`,
      { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(30_000) }
    ),
  ]);
  if (!drRes.ok || !bsRes.ok) {
    throw new Error(
      `Ahrefs overview error ${drRes.status}/${bsRes.status}`
    );
  }
  const dr = await drRes.json();
  const bs = await bsRes.json();
  return {
    target,
    backlinks: Number(bs?.metrics?.live ?? 0),
    refdomains: Number(bs?.metrics?.live_refdomains ?? 0),
    domainRating: Number(dr?.domain_rating?.domain_rating ?? 0),
  };
}

export interface AiVisibilityResult {
  target: string;
  platforms: AiVisibilityPlatform[];
  totalCitations: number;
  totalPages: number;
}

/** Platforms covered by one /ai-responses-count call (15 units each). */
const AI_PLATFORMS = ["chatgpt", "perplexity", "google_ai_overviews", "gemini", "copilot"] as const;

/**
 * Ahrefs API v3 — competitor organic keywords for a domain.
 * Server-side only; key in AHREFS_API_KEY env.
 * Endpoint requires `select` + `date` (YYYY-MM-DD); the API rejects dates newer
 * than its own data window, so on "bad date" we step back through candidates.
 */
const DATE_BACKOFF_DAYS = [0, 1, 2, 7, 14, 30, 60, 90, 180, 365];

function candidateDates(): string[] {
  const now = Date.now();
  return DATE_BACKOFF_DAYS.map((daysAgo) =>
    new Date(now - daysAgo * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
}

export async function getCompetitorKeywords(
  target: string,
  opts: { country?: string; limit?: number } = {}
): Promise<CompetitorResult> {
  const apiKey = process.env.AHREFS_API_KEY;
  if (!apiKey) {
    throw new Error("AHREFS_API_KEY not configured");
  }
  const country = opts.country || "hk";
  const limit = opts.limit || 5;
  const base = `https://api.ahrefs.com/v3/site-explorer/organic-keywords`;
  let lastError: Error | null = null;
  for (const date of candidateDates()) {
    const url = `${base}?select=keyword,volume&target=${encodeURIComponent(
      target
    )}&date=${date}&country=${country}&limit=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(30_000),
    });
    if (res.ok) {
      const data = await res.json();
      const rows = Array.isArray(data.keywords) ? data.keywords : [];
      return {
        target,
        keywords: rows.map((k: Record<string, unknown>) => ({
          keyword: String(k.keyword ?? ""),
          volume: Number(k.volume ?? 0),
        })),
      };
    }
    // 400 = bad date / bad params — try the next candidate. Anything else is fatal.
    if (res.status !== 400) {
      throw new Error(`Ahrefs error ${res.status}`);
    }
    lastError = new Error(`Ahrefs error ${res.status}: ${await res.text()}`);
  }
  throw lastError ?? new Error("Ahrefs error: no valid date found");
}

/**
 * AI visibility — how often the target is cited in AI-generated search answers
 * (ChatGPT, Perplexity, Google AI Overviews, Gemini, Copilot). 15 Ahrefs units
 * per platform per call; the dashboard memoizes this for 6h because the number
 * moves slowly and units are the scarce resource.
 */
export async function getAiVisibility(target: string): Promise<AiVisibilityResult> {
  const apiKey = process.env.AHREFS_API_KEY;
  if (!apiKey) {
    throw new Error("AHREFS_API_KEY not configured");
  }
  const url = `https://api.ahrefs.com/v3/site-explorer/ai-responses-count?select=${AI_PLATFORMS.join(
    ","
  )}&target=${encodeURIComponent(target)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(`Ahrefs AI visibility error ${res.status}`);
  }
  const data = await res.json();
  const counts = (data.ai_responses_count ?? {}) as Record<
    string,
    { citations?: number; pages?: number } | null
  >;
  const platforms: AiVisibilityPlatform[] = [];
  let totalCitations = 0;
  let totalPages = 0;
  for (const name of AI_PLATFORMS) {
    const p = counts[name];
    const citations = p?.citations ?? 0;
    const pages = p?.pages ?? 0;
    platforms.push({ name, citations, pages });
    totalCitations += citations;
    totalPages += pages;
  }
  return { target, platforms, totalCitations, totalPages };
}
