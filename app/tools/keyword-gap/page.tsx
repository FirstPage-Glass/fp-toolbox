"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";

interface GapResult {
  domainA: string;
  domainB: string;
  country: string;
  aKeywordCount: number;
  bKeywordCount: number;
  gapCount: number;
  gap: { keyword: string; volume: number }[];
}

export default function KeywordGapPage() {
  const prefill = usePrefill();
  const [domainA, setDomainA] = useState(prefill.domainA || "");
  const [domainB, setDomainB] = useState(prefill.domainB || "");
  const [country, setCountry] = useState("hk");
  const [limit, setLimit] = useState(50);
  const { data, error, loading, run } = useToolApi<GapResult>("keyword-gap");

  const sendTo: SendToLink[] = data?.gap?.[0]
    ? [
        {
          label: "Content Brief",
          href: prefillUrl("/tools/content-brief", { keyword: data.gap[0].keyword }),
        },
        {
          label: "Meta Generator",
          href: prefillUrl("/tools/meta-generator", { keyword: data.gap[0].keyword }),
        },
        {
          label: "SEO ROI",
          href: prefillUrl("/tools/seo-roi", { keyword: data.gap[0].keyword, domain: data.domainA }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Keyword Gap Analyzer</h1>
      <p className="mt-1 text-sm text-slate-600">
        Find the keywords domain B ranks for that domain A is missing — your content opportunity list.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Domain A (client)</label>
          <input
            value={domainA}
            onChange={(e) => setDomainA(e.target.value)}
            placeholder="client.com.hk"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Domain B (competitor)</label>
          <input
            value={domainB}
            onChange={(e) => setDomainB(e.target.value)}
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
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Per domain</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {[25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => run({ domainA, domainB, country, limit })}
          disabled={loading || !domainA || !domainB}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Comparing…" : "Find gap"}
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
