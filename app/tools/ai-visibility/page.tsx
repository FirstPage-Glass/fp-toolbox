"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView from "@/components/tools/ResultView";
import { usePrefill } from "@/components/tools/usePrefill";

interface AiVisibilityResult {
  target: string;
  platforms: { name: string; citations: number; pages: number }[];
  totalCitations: number;
  totalPages: number;
}

export default function AiVisibilityPage() {
  const prefill = usePrefill();
  const [domain, setDomain] = useState(prefill.domain || "");
  const { data, error, loading, run } = useToolApi<AiVisibilityResult>("ai-visibility");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">AI Visibility Scanner</h1>
      <p className="mt-1 text-sm text-slate-600">
        See how visible a domain is in AI-generated search answers — a key metric for AI-era SEO.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="firstpage.hk"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
        />
        <button
          onClick={() => run({ domain })}
          disabled={loading || !domain}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Scanning…" : "Scan"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {data && (
        <div className="mt-6">
          <ResultView data={data} />
        </div>
      )}
    </div>
  );
}
