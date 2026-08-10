"use client";

import { useEffect, useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";

interface GscExplorerResult {
  siteUrl: string;
  days: number;
  totals: { clicks: number; impressions: number };
  rows: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
}

export default function GscExplorerPage() {
  const prefill = usePrefill();
  const [sites, setSites] = useState<{ siteUrl: string; displayName: string }[]>([]);
  const [site, setSite] = useState(prefill.site || "");
  const [days, setDays] = useState(30);
  const [minClicks, setMinClicks] = useState(0);
  const [query, setQuery] = useState(prefill.query || "");
  const { data, error, loading, run } = useToolApi<GscExplorerResult>("gsc-explorer");

  useEffect(() => {
    fetch("/api/tools/gsc-explorer")
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
          label: "URL Inspector",
          href: prefillUrl("/tools/url-inspector", {
            url: data.siteUrl.replace(/\/?$/, "/"),
            site: data.siteUrl,
          }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">GSC Query Explorer</h1>
      <p className="mt-1 text-sm text-slate-600">
        Pull the organic search queries driving any client site&apos;s traffic from Google Search Console.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Site</label>
          <input
            list="gsc-sites"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="Search or paste a site…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
          <datalist id="gsc-sites">
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
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Min clicks</label>
          <input
            type="number"
            min={0}
            value={minClicks}
            onChange={(e) => setMinClicks(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Query contains</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. seo agency"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => run({ siteUrl: site, days, minClicks, query })}
          disabled={loading || !site}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Running…" : "Explore"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {data && (
        <div className="mt-6 space-y-4">
          <ResultView data={data} sendTo={sendTo} />
        </div>
      )}
    </div>
  );
}
