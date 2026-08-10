"use client";

import { useState } from "react";
import { usePrefill } from "@/components/tools/usePrefill";
import OutputHistory, { type OutputItem } from "@/components/tools/OutputHistory";

interface SeoRoiResult {
  roi: {
    volumes: { keyword: string; volume: number }[];
    estimate: {
      monthlyTraffic: number;
      monthlyLeads: number;
      monthlyRevenue: number;
      annualRevenue: number;
    };
    assumptions: string[];
    narrative: string;
  };
}

export default function SeoRoiPage() {
  const prefill = usePrefill();
  const [domain, setDomain] = useState(prefill.domain || "");
  const [keywords, setKeywords] = useState(prefill.keyword || "");
  const [avgDealValue, setAvgDealValue] = useState(10000);
  const [conversionRate, setConversionRate] = useState(2);
  const [result, setResult] = useState<SeoRoiResult["roi"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [refineText, setRefineText] = useState("");
  const [refining, setRefining] = useState(false);

  async function generate(extra: { refineOutputId?: number; refineInstruction?: string } = {}) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tools/seo-roi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, keywords, avgDealValue, conversionRate, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setResult(data.roi);
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
    setResult((item.output as SeoRoiResult["roi"]));
    setCost(Number(item.costUsd));
    setActiveId(item.id);
    const b = item.brief as Record<string, unknown>;
    setDomain(String(b.domain ?? ""));
    if (Array.isArray(b.keywords)) setKeywords(b.keywords.join(", "));
    setAvgDealValue(Number(b.avgDealValue) || 10000);
    setConversionRate(Number(b.conversionRate) || 2);
  }

  const usd = (n: number) => `US$${Math.round(n).toLocaleString()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">SEO ROI Estimator</h1>
      <p className="mt-1 text-sm text-slate-600">
        Estimate the traffic, leads and revenue a keyword set could produce — every assumption stated out loud.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Keywords (comma / line separated)
          </label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={3}
            placeholder={"seo agency hong kong\nlocal seo services"}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Domain (optional — pulls top keywords)
            </label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="client-site.com.hk"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Avg deal value (USD)
              </label>
              <input
                type="number"
                min={1}
                value={avgDealValue}
                onChange={(e) => setAvgDealValue(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Conversion rate %
              </label>
              <input
                type="number"
                min={0.1}
                max={20}
                step={0.5}
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => generate()}
          disabled={loading || (!keywords.trim() && !domain)}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Estimating…" : "Estimate ROI"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            {cost != null && <span className="text-xs text-slate-500">Cost: US${cost.toFixed(4)}</span>}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly traffic</div>
                <div className="mt-1 text-xl font-bold text-fp-700">
                  {Math.round(result.estimate.monthlyTraffic).toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly leads</div>
                <div className="mt-1 text-xl font-bold text-fp-700">
                  {Math.round(result.estimate.monthlyLeads).toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly revenue</div>
                <div className="mt-1 text-xl font-bold text-fp-700">{usd(result.estimate.monthlyRevenue)}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Annual revenue</div>
                <div className="mt-1 text-xl font-bold text-fp-700">{usd(result.estimate.annualRevenue)}</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-700">{result.narrative}</p>

            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Assumptions</h3>
              <ul className="mt-2 space-y-1.5">
                {result.assumptions.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-fp-600">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={refineText}
              onChange={(e) => setRefineText(e.target.value)}
              placeholder="Refine (e.g. use a 3% conversion rate for B2B)"
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

          <OutputHistory toolSlug="seo-roi" refreshKey={historyKey} activeId={activeId} onLoad={loadOutput} />
        </div>
      )}
    </div>
  );
}
