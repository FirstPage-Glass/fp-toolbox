"use client";

import { useState } from "react";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";
import OutputHistory, { type OutputItem } from "@/components/tools/OutputHistory";

interface ContentBriefOutput {
  keyword: string;
  title: string;
  searchIntent: string;
  targetAudience: string;
  wordCount: number;
  outline: { heading: string; points: string[] }[];
  faqIdeas: string[];
}

export default function ContentBriefPage() {
  const prefill = usePrefill();
  const [keyword, setKeyword] = useState(prefill.keyword || "");
  const [url, setUrl] = useState("");
  const [tone, setTone] = useState("professional");
  const [brief, setBrief] = useState<ContentBriefOutput | null>(null);
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
      const res = await fetch("/api/tools/content-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, url, tone, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setBrief(data.brief);
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
    setBrief(item.output as ContentBriefOutput);
    setCost(Number(item.costUsd));
    setActiveId(item.id);
    const b = item.brief as Record<string, unknown>;
    setKeyword(String(b.keyword ?? ""));
    setTone(String(b.tone ?? "professional"));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Content Brief Generator</h1>
      <p className="mt-1 text-sm text-slate-600">
        Turn a target keyword into a writer-ready brief — intent, audience, outline and FAQ ideas.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target keyword</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="local seo services hong kong"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Existing page (optional)
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://client-site.com/page"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
            >
              {["professional", "friendly", "authoritative", "conversational"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <button
            onClick={() => generate()}
            disabled={loading || !keyword.trim()}
            className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
          >
            {loading ? "Generating…" : "Generate brief"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {brief && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={prefillUrl("/tools/meta-generator", { keyword: brief.keyword })}
              className="rounded-lg bg-fp-100 px-3 py-1.5 text-sm font-semibold text-fp-700 hover:bg-fp-200"
            >
              Meta Tags →
            </a>
            <a
              href={prefillUrl("/tools/schema-generator", { keyword: brief.keyword })}
              className="rounded-lg bg-fp-100 px-3 py-1.5 text-sm font-semibold text-fp-700 hover:bg-fp-200"
            >
              Schema →
            </a>
            {cost != null && <span className="text-xs text-slate-500">Cost: US${cost.toFixed(4)}</span>}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Title</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{brief.title}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Search intent</div>
                <div className="mt-1 text-sm text-slate-700">{brief.searchIntent}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Audience</div>
                <div className="mt-1 text-sm text-slate-700">{brief.targetAudience}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word count</div>
                <div className="mt-1 text-lg font-bold text-fp-700">{brief.wordCount}</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Outline</h3>
              <div className="mt-3 space-y-4">
                {brief.outline.map((s, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-4">
                    <div className="text-sm font-bold text-slate-900">
                      {i + 1}. {s.heading}
                    </div>
                    <ul className="mt-2 space-y-1">
                      {s.points.map((p, j) => (
                        <li key={j} className="flex gap-2 text-sm text-slate-600">
                          <span className="text-fp-600">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">FAQ ideas</h3>
              <ul className="mt-2 space-y-1.5">
                {brief.faqIdeas.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-fp-600">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={refineText}
              onChange={(e) => setRefineText(e.target.value)}
              placeholder="Refine (e.g. target beginners, add comparison sections)"
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

          <OutputHistory toolSlug="content-brief" refreshKey={historyKey} activeId={activeId} onLoad={loadOutput} />
        </div>
      )}
    </div>
  );
}
