export interface PsiResult {
  performanceScore: number | null;
  lcpMs: number | null;
  cls: number | null;
  url: string;
}

/** PageSpeed Insights API v5 — free tier needs no key; optional PSI_API_KEY raises the quota. */
export async function getPsiScore(url: string): Promise<PsiResult> {
  const key = process.env.PSI_API_KEY
    ? `&key=${encodeURIComponent(process.env.PSI_API_KEY)}`
    : "";
  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=mobile${key}`,
    { signal: AbortSignal.timeout(60_000) }
  );
  if (!res.ok) {
    throw new Error(`PSI error ${res.status}`);
  }
  const data = await res.json();
  const lh = data.lighthouseResult;
  return {
    performanceScore: lh?.categories?.performance?.score != null ? Math.round(lh.categories.performance.score * 100) : null,
    lcpMs: lh?.audits?.["largest-contentful-paint"]?.numericValue ?? null,
    cls: lh?.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
    url,
  };
}
