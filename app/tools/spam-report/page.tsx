"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView from "@/components/tools/ResultView";

interface SpamReportResult {
  total: number;
  good: number;
  spam: number;
  spamRatePct: number;
  categories: { reason: string; count: number }[];
  topSources: { domain: string; count: number }[];
}

export default function SpamReportPage() {
  const [days, setDays] = useState(30);
  const { data, error, loading, run } = useToolApi<SpamReportResult>("spam-report");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Lead Spam Report</h1>
      <p className="mt-1 text-sm text-slate-600">
        Aggregate the last N days of HubSpot contacts — how much is junk, why, and where it comes from.
      </p>

      <div className="mt-6 flex items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Window</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {[7, 14, 30, 60, 90].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => run({ days })}
          disabled={loading}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Reporting…" : "Report"}
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
