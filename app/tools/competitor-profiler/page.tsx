"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";

interface CompetitorResult {
  target: string;
  keywords: { keyword: string; volume: number }[];
}

export default function CompetitorProfilerPage() {
  const prefill = usePrefill();
  const [domain, setDomain] = useState(prefill.domain || "");
  const [country, setCountry] = useState("hk");
  const [limit, setLimit] = useState(10);
  const { data, error, loading, run } = useToolApi<CompetitorResult>("competitor-profiler");

  const sendTo: SendToLink[] = data
    ? [
        {
          label: "Keyword Gap",
          href: prefillUrl("/tools/keyword-gap", { domainB: data.target }),
        },
        ...(data.keywords[0]
          ? [
              {
                label: "Content Brief",
                href: prefillUrl("/tools/content-brief", {
                  keyword: data.keywords[0].keyword,
                }),
              },
              {
                label: "SEO ROI",
                href: prefillUrl("/tools/seo-roi", {
                  keyword: data.keywords[0].keyword,
                  domain: data.target,
                }),
              },
            ]
          : []),
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Competitor Profiler</h1>
      <p className="mt-1 text-sm text-slate-600">
        See the organic keywords any competitor domain ranks for, with search volumes.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Domain</label>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="competitor.com.hk"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {["hk", "us", "sg", "au", "uk", "tw", "cn"].map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Keywords</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => run({ domain, country, limit })}
          disabled={loading || !domain}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Profiling…" : "Profile"}
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
