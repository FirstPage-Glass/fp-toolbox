"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { prefillUrl } from "@/components/tools/usePrefill";

interface ScoredLead {
  id: string;
  name: string;
  email: string;
  website: string | null;
  createdAt: string;
  score: number;
  label: "hot" | "warm" | "cold";
  reasons: string[];
}

interface LeadScorerResult {
  days: number;
  total: number;
  counts: { hot: number; warm: number; cold: number };
  leads: ScoredLead[];
}

export default function LeadScorerPage() {
  const [days, setDays] = useState(7);
  const { data, error, loading, run } = useToolApi<LeadScorerResult>("lead-scorer");

  const sendTo: SendToLink[] = data?.leads?.[0]
    ? [
        {
          label: "Meeting Prep",
          href: prefillUrl("/tools/meeting-prep", {
            url: data.leads[0].website ?? "",
            client: data.leads[0].name || data.leads[0].email.split("@")[0],
          }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Lead Scorer</h1>
      <p className="mt-1 text-sm text-slate-600">
        Fresh HubSpot leads scored 0–100 from email reputation and website signals — hot ones first.
      </p>

      <div className="mt-6 flex items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Window</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {[1, 3, 7, 14, 30].map((d) => (
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
          {loading ? "Scoring…" : "Score leads"}
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
