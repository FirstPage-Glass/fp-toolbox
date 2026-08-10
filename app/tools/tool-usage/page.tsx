"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView from "@/components/tools/ResultView";

interface UsageStatsResult {
  totalRuns: number;
  activeUsers: number;
  totalCostUsd: number;
  perTool: { tool_slug: string; runs: number; cost_usd: number }[];
  windowDays: number | null;
}

export default function ToolUsagePage() {
  const [days, setDays] = useState(0); // 0 = all time
  const { data, error, loading, run } = useToolApi<UsageStatsResult>("tool-usage");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Tool Usage Stats</h1>
      <p className="mt-1 text-sm text-slate-600">
        How much the team is using the toolbox — runs, active users and LLM cost per tool.
      </p>

      <div className="mt-6 flex items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Window</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            <option value={0}>All time</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <button
          onClick={() => run({ days })}
          disabled={loading}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Loading…" : "Usage"}
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
