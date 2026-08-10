"use client";

import { useEffect, useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";

interface SerpResult {
  siteUrl: string;
  days: number;
  buckets: { position: string; queries: number; clicks: number; impressions: number }[];
  topQueries: { query: string; impressions: number; clicks: number; ctr: number; position: number }[];
}

export default function SerpLandscapePage() {
  const prefill = usePrefill();
  const [sites, setSites] = useState<{ siteUrl: string; displayName: string }[]>([]);
  const [site, setSite] = useState(prefill.site || "");
  const [days, setDays] = useState(30);
  const { data, error, loading, run } = useToolApi<SerpResult>("serp-landscape");

  useEffect(() => {
    fetch("/api/tools/serp-landscape")
      .then((r) => r.json())
      .then((j) => {
        const list: { siteUrl: string; displayName: string }[] = j.sites ?? [];
        setSites(list);
        if (!site && list.length) setSite(prefill.site || list[0].siteUrl);
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendTo: SendToLink[] = data
    ? [
        {
          label: "Query Explorer",
          href: prefillUrl("/tools/gsc-explorer", { site: data.siteUrl }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">SERP Landscape</h1>
      <p className="mt-1 text-sm text-slate-600">
        The shape of a site&apos;s rankings — how many queries sit in each position bucket, and the biggest-impression queries.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Site</label>
          <input
            list="serp-sites"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="Search or paste a site…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
          <datalist id="serp-sites">
            {sites.map((s) => (
              <option key={s.siteUrl} value={s.siteUrl}>
                {s.displayName}
              </option>
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Days</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {[7, 30, 90].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => run({ siteUrl: site, days })}
          disabled={loading || !site}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Mapping…" : "Map SERPs"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {data && (
        <div className="mt-6">
          <ResultView data={data} sendTo={sendTo} />
        </div>
      )}
    </div>
  );
}
