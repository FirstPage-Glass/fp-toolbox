export interface AhrefsKeyword {
  keyword: string;
  volume: number;
}

export interface CompetitorResult {
  target: string;
  keywords: AhrefsKeyword[];
}

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
