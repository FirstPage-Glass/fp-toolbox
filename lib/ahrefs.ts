export interface AhrefsKeyword {
  keyword: string;
  volume: number;
  position: number;
  traffic: number;
}

export interface CompetitorResult {
  target: string;
  keywords: AhrefsKeyword[];
}

/**
 * Ahrefs API v3 — competitor organic keywords for a domain.
 * Server-side only; key in AHREFS_API_KEY env.
 */
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
  const url = `https://api.ahrefs.com/v3/site-explorer/organic-keywords/search?target=${encodeURIComponent(
    target
  )}&country=${country}&limit=${limit}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(`Ahrefs error ${res.status}`);
  }
  const data = await res.json();
  const rows = Array.isArray(data.keywords) ? data.keywords : [];
  return {
    target,
    keywords: rows.map((k: Record<string, unknown>) => ({
      keyword: String(k.keyword ?? ""),
      volume: Number(k.volume ?? 0),
      position: Number(k.position ?? 0),
      traffic: Number(k.traffic ?? 0),
    })),
  };
}
