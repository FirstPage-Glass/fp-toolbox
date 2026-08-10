"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView from "@/components/tools/ResultView";

interface PipelinePulseResult {
  days: number;
  newCount: number;
  pipelineValue: number;
  avgAmount: number;
  funnel: { open: number; won: number; lost: number };
  closedWon: { count: number; revenue: number };
  closedLostCount: number;
  perOwner: {
    ownerId: string;
    ownerName: string;
    wonCount: number;
    wonRevenue: number;
    openPipeline: number;
  }[];
}

export default function PipelinePulsePage() {
  const [days, setDays] = useState(30);
  const { data, error, loading, run } = useToolApi<PipelinePulseResult>("pipeline-pulse");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Pipeline Pulse</h1>
      <p className="mt-1 text-sm text-slate-600">
        New deals, open pipeline value, closed-won revenue and the per-owner leaderboard from HubSpot.
      </p>

      <div className="mt-6 flex items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Window</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {[7, 30, 90].map((d) => (
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
          {loading ? "Pulsing…" : "Pulse"}
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
