"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";

interface UrlInspectorResult {
  url: string;
  site: string | null;
  inspection: Record<string, unknown> | null;
  psi: Record<string, unknown> | null;
}

export default function UrlInspectorPage() {
  const prefill = usePrefill();
  const [url, setUrl] = useState(prefill.url || "");
  const [site, setSite] = useState(prefill.site || "");
  const { data, error, loading, run } = useToolApi<UrlInspectorResult>("url-inspector");

  const sendTo: SendToLink[] = data
    ? [
        {
          label: "Mobile vs Desktop PSI",
          href: prefillUrl("/tools/mobile-desktop-psi", { url: data.url }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">URL Inspector</h1>
      <p className="mt-1 text-sm text-slate-600">
        Index status, canonical, mobile usability and rich results for one URL — plus its PageSpeed score.
      </p>

      <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://client-site.com/page"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            GSC site (optional — auto-matched)
          </label>
          <input
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="https://client-site.com/"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => run({ url, site })}
          disabled={loading || !url}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Inspecting…" : "Inspect"}
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
