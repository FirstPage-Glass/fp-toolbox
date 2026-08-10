"use client";

import { useEffect, useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";

interface Ga4SnapshotResult {
  propertyId: string;
  days: number;
  totals: { activeUsers: number; sessions: number };
  trend: { date: string; activeUsers: number; sessions: number }[];
}

export default function Ga4SnapshotPage() {
  const prefill = usePrefill();
  const [properties, setProperties] = useState<{ propertyId: string; displayName: string }[]>([]);
  const [propertyId, setPropertyId] = useState(prefill.property || "");
  const [days, setDays] = useState(30);
  const { data, error, loading, run } = useToolApi<Ga4SnapshotResult>("ga4-snapshot");

  useEffect(() => {
    fetch("/api/tools/ga4-snapshot")
      .then((r) => r.json())
      .then((j) => {
        const list: { propertyId: string; displayName: string }[] = j.properties ?? [];
        setProperties(list);
        if (!propertyId && list.length) setPropertyId(prefill.property || list[0].propertyId);
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendTo: SendToLink[] = data
    ? [
        {
          label: "Monthly Report",
          href: prefillUrl("/tools/monthly-report", { property: data.propertyId }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">GA4 Traffic Snapshot</h1>
      <p className="mt-1 text-sm text-slate-600">
        Active users and sessions for any GA4 property in the portfolio, with a daily trend.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Property</label>
          <input
            list="ga4-properties"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            placeholder="Search or paste a property id…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
          <datalist id="ga4-properties">
            {properties.map((p) => (
              <option key={p.propertyId} value={p.propertyId}>
                {p.displayName}
              </option>
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Days</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {[7, 30, 90].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => run({ propertyId, days })}
          disabled={loading || !propertyId}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Running…" : "Snapshot"}
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
