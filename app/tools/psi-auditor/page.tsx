"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";

interface PsiResult {
  url: string;
  performanceScore: number | null;
  lcpMs: number | null;
  cls: number | null;
  grade: string;
}

export default function PsiAuditorPage() {
  const prefill = usePrefill();
  const [url, setUrl] = useState(prefill.url || "");
  const { data, error, loading, run } = useToolApi<PsiResult>("psi-auditor");

  const sendTo: SendToLink[] = data
    ? [
        {
          label: "URL Inspector",
          href: prefillUrl("/tools/url-inspector", { url, site: url }),
        },
        {
          label: "Mobile vs Desktop",
          href: prefillUrl("/tools/mobile-desktop-psi", { url }),
        },
        {
          label: "Pitch Deck",
          href: prefillUrl("/tools/pitch-deck", { website: url }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">PageSpeed Auditor</h1>
      <p className="mt-1 text-sm text-slate-600">
        One URL, one audit — mobile performance score, LCP and CLS from PageSpeed Insights.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://client-site.com/page"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
        />
        <button
          onClick={() => run({ url })}
          disabled={loading || !url}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Auditing…" : "Audit"}
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
