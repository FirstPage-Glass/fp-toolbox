"use client";

import { useState } from "react";
import { usePrefill } from "@/components/tools/usePrefill";
import ResultView from "@/components/tools/ResultView";
import OutputHistory, { type OutputItem } from "@/components/tools/OutputHistory";

interface MetaItem {
  keyword: string;
  title: string;
  description: string;
}

export default function MetaGeneratorPage() {
  const prefill = usePrefill();
  const [keywords, setKeywords] = useState(prefill.keyword || "");
  const [locale, setLocale] = useState("en-HK");
  const [items, setItems] = useState<MetaItem[] | null>(null);
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
      const res = await fetch("/api/tools/meta-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, locale, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setItems(data.items);
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
    setItems((item.output as { items: MetaItem[] }).items);
    setCost(Number(item.costUsd));
    setActiveId(item.id);
    const b = item.brief as Record<string, unknown>;
    if (Array.isArray(b.keywords)) setKeywords(b.keywords.join("\n"));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Meta Tag Generator</h1>
      <p className="mt-1 text-sm text-slate-600">
        One keyword per line — get SEO titles and meta descriptions for the whole list.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          rows={5}
          placeholder={"seo agency hong kong\nlocal seo services\n…"}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          >
            {["en-HK", "en-US", "en-GB", "zh-HK", "zh-CN"].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <button
            onClick={() => generate()}
            disabled={loading || !keywords.trim()}
            className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
          >
            {loading ? "Generating…" : "Generate metas"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {items && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            {cost != null && <span className="text-xs text-slate-500">Cost: US${cost.toFixed(4)}</span>}
            <div className="flex-1" />
            <div className="flex gap-2">
              <input
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                placeholder="Refine (e.g. add a call to action)"
                className="flex-1 min-w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
              />
              <button
                onClick={refine}
                disabled={!activeId || !refineText.trim() || refining}
                className="rounded-lg bg-fp-100 px-4 py-2 text-sm font-semibold text-fp-700 hover:bg-fp-200 disabled:opacity-40"
              >
                {refining ? "Refining…" : "Refine"}
              </button>
            </div>
          </div>
          <ResultView data={{ items }} />
          <OutputHistory toolSlug="meta-generator" refreshKey={historyKey} activeId={activeId} onLoad={loadOutput} />
        </div>
      )}
    </div>
  );
}
