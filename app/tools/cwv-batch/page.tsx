"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { prefillUrl } from "@/components/tools/usePrefill";

interface CwvRow {
  url: string;
  performanceScore: number | null;
  lcpMs: number | null;
  cls: number | null;
  status: string;
}

interface CwvBatchResult {
  audited: number;
  rows: CwvRow[];
}

export default function CwvBatchPage() {
  const [urls, setUrls] = useState("");
  const { data, error, loading, run } = useToolApi<CwvBatchResult>("cwv-batch");

  function submit() {
    const list = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 10);
    if (list.length) run({ urls: list });
  }

  const sendTo: SendToLink[] = data
    ? data.rows
        .filter((r) => r.status === "ok")
        .map((r) => ({
          label: `Inspect ${r.url.replace(/^https?:\/\//, "")}`,
          href: prefillUrl("/tools/url-inspector", { url: r.url, site: r.url }),
        }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Core Web Vitals Batch</h1>
      <p className="mt-1 text-sm text-slate-600">
        Paste up to 10 URLs, one per line — run a mobile PSI audit on each and compare.
      </p>

      <div className="mt-6">
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          rows={6}
          placeholder={"https://client-site.com/\nhttps://client-site.com/pricing\n…"}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={submit}
            disabled={loading || !urls.trim()}
            className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
          >
            {loading ? "Auditing…" : "Audit batch"}
          </button>
          <span className="text-xs text-slate-400">
            {urls.split("\n").filter((u) => u.trim()).length}/10 URLs
          </span>
        </div>
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
