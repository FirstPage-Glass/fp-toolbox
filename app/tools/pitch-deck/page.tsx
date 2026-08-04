"use client";

import { useState } from "react";
import BriefForm, { EMPTY_BRIEF, type BriefFormValues } from "@/components/tools/BriefForm";
import HubSpotLeads from "@/components/tools/HubSpotLeads";
import OutputHistory, { type OutputItem } from "@/components/tools/OutputHistory";

interface DeckSlide {
  heading: string;
  bullets: string[];
  stat?: { value: string; label: string };
}

interface Deck {
  title: string;
  subtitle: string;
  slides: DeckSlide[];
}

export default function PitchDeckPage() {
  const [brief, setBrief] = useState<BriefFormValues>(EMPTY_BRIEF);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cost, setCost] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [refineText, setRefineText] = useState("");
  const [refining, setRefining] = useState(false);

  async function generate(extra: { refineOutputId?: number; refineInstruction?: string } = {}) {
    setError(null);
    const res = await fetch("/api/tools/pitch-deck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...brief, ...extra }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Generation failed");
      return;
    }
    setDeck(data.deck);
    setCost(data.meta?.costUsd ?? null);
    setActiveId(data.outputId ?? null);
    setHistoryKey((k) => k + 1);
    setRefineText("");
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
    setDeck(item.output as Deck);
    setCost(Number(item.costUsd));
    setActiveId(item.id);
    setBrief((b) => ({ ...b, clientName: item.brief.clientName, website: item.brief.website ?? "" }));
  }

  function pickLead(l: { name: string; email: string; website: string | null }) {
    setBrief((b) => ({
      ...b,
      clientName: l.name || l.email.split("@")[0],
      website: l.website || "",
    }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Pitch Deck Generator</h1>
      <p className="mt-1 text-sm text-slate-600">
        Fill in the client brief — the deck is generated with live PageSpeed + competitor data, rendered as HTML, and exported to PDF. Every output is saved to history and refinable.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* Left: brief form */}
        <BriefForm brief={brief} onChange={setBrief} submitLabel="Generate deck" onGenerate={() => generate()} />

        {/* Right rail: HubSpot + history */}
        <div className="space-y-4">
          <HubSpotLeads onPick={pickLead} />
          <OutputHistory toolSlug="pitch-deck" refreshKey={historyKey} activeId={activeId} onLoad={loadOutput} />
        </div>
      </div>

      {/* Output: full width below the intake row */}
      <div className="mt-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}
        {deck && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => window.print()}
                className="rounded-lg bg-fp-700 px-4 py-2 text-sm font-semibold text-white hover:bg-fp-800"
              >
                Export PDF
              </button>
              {cost != null && (
                <span className="text-xs text-slate-500">Generation cost: US${cost.toFixed(4)}</span>
              )}
            </div>

            {/* Refine bar */}
            <div className="mb-4 flex gap-2">
              <input
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                placeholder="Refine instruction (e.g. make the pricing slide more aggressive)"
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

            {/* ponytail: print CSS turns each slide into one PDF page */}
            <div className="deck-sheet space-y-6">
              {[
                { heading: deck.title, bullets: [deck.subtitle] },
                ...deck.slides,
              ].map((slide, i) => (
                <section
                  key={i}
                  className="slide-page rounded-xl border border-slate-200 bg-white p-10 shadow-sm"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-fp-600">
                    {i === 0 ? "First Page Digital" : `Slide ${i}`}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900">{slide.heading}</h2>
                  {slide.stat && (
                    <div className="mt-4 rounded-lg bg-fp-50 p-4 text-center">
                      <div className="text-3xl font-extrabold text-fp-800">{slide.stat.value}</div>
                      <div className="text-sm text-slate-600">{slide.stat.label}</div>
                    </div>
                  )}
                  <ul className="mt-4 space-y-2">
                    {slide.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-slate-700">
                        <span className="text-fp-600">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
