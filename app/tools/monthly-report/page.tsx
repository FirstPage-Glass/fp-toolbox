"use client";

import { useEffect, useState } from "react";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";
import OutputHistory, { type OutputItem } from "@/components/tools/OutputHistory";

interface MonthlyReport {
  title: string;
  summary: string;
  sections: { heading: string; paragraphs: string[]; bullets: string[] }[];
}

export default function MonthlyReportPage() {
  const prefill = usePrefill();
  const [siteSuggestions, setSiteSuggestions] = useState<string[]>([]);
  const [url, setUrl] = useState(prefill.url || "");
  const [clientName, setClientName] = useState(prefill.client || "");
  const [period, setPeriod] = useState("");
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [refineText, setRefineText] = useState("");
  const [refining, setRefining] = useState(false);

  useEffect(() => {
    fetch("/api/tools/monthly-report")
      .then((r) => r.json())
      .then((j) => setSiteSuggestions(Array.isArray(j.sites) ? j.sites : []))
      .catch(() => undefined);
  }, []);

  async function generate(extra: { refineOutputId?: number; refineInstruction?: string } = {}) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tools/monthly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, clientName, period, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setReport(data.report);
      setCost(data.meta?.costUsd ?? null);
      setActiveId(data.outputId ?? null);
      setHistoryKey((k) => k + 1);
      setRefineText("");
    } finally {
      setLoading(false);
    }
  }

  async function refine() {
    if (!activeId || !refineText.trim()) return;
    setRefining(true);
    try {
      await generate({ refineOutputId: activeId, refineInstruction: refineText.trim() });
    } finally {
      setRefining(false);
    }
  }

  function loadOutput(item: OutputItem) {
    setReport(item.output as MonthlyReport);
    setCost(Number(item.costUsd));
    setActiveId(item.id);
    const b = item.brief as Record<string, unknown>;
    setUrl(String(b.url ?? ""));
    setClientName(String(b.clientName ?? ""));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Monthly SEO Report</h1>
      <p className="mt-1 text-sm text-slate-600">
        GSC, GA4, PageSpeed and AI visibility data narrated into a client-ready monthly report.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client website</label>
          <input
            list="monthly-sites"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://client-site.com/"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
          <datalist id="monthly-sites">
            {siteSuggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client name</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Acme Ltd"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reporting period</label>
            <input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. July 2026"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <button
            onClick={() => generate()}
            disabled={loading || !url}
            className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
          >
            {loading ? "Generating…" : "Generate report"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {report && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={prefillUrl("/tools/proposal", { clientName, website: url })}
              className="rounded-lg bg-fp-100 px-3 py-1.5 text-sm font-semibold text-fp-700 hover:bg-fp-200"
            >
              Proposal →
            </a>
            {cost != null && <span className="text-xs text-slate-500">Cost: US${cost.toFixed(4)}</span>}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{report.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{report.summary}</p>

            <div className="mt-6 space-y-6">
              {report.sections.map((s, i) => (
                <section key={i}>
                  <h3 className="text-base font-bold text-slate-900">{s.heading}</h3>
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="mt-2 text-sm text-slate-700">
                      {p}
                    </p>
                  ))}
                  {s.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {s.bullets.map((b, k) => (
                        <li key={k} className="flex gap-2 text-sm text-slate-700">
                          <span className="text-fp-600">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={refineText}
              onChange={(e) => setRefineText(e.target.value)}
              placeholder="Refine (e.g. highlight the biggest win, soften the traffic drop)"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
            />
            <button
              onClick={refine}
              disabled={!activeId || !refineText.trim() || refining}
              className="rounded-lg bg-fp-100 px-4 py-2 text-sm font-semibold text-fp-700 hover:bg-fp-200 disabled:opacity-40"
            >
              {refining ? "Refining…" : "Refine"}
            </button>
          </div>

          <OutputHistory toolSlug="monthly-report" refreshKey={historyKey} activeId={activeId} onLoad={loadOutput} />
        </div>
      )}
    </div>
  );
}
