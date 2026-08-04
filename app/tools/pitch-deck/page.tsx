"use client";

import { useState } from "react";
import BriefForm, { type BriefFormValues } from "@/components/tools/BriefForm";

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
  const [deck, setDeck] = useState<Deck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cost, setCost] = useState<number | null>(null);

  async function generate(brief: BriefFormValues) {
    setError(null);
    setDeck(null);
    const res = await fetch("/api/tools/pitch-deck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brief),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Generation failed");
      return;
    }
    setDeck(data.deck);
    setCost(data.meta?.costUsd ?? null);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Pitch Deck Generator</h1>
      <p className="mt-1 text-sm text-slate-600">
        Fill in the client brief — the deck is generated with live PageSpeed + competitor data, rendered as HTML, and exported to PDF.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <BriefForm submitLabel="Generate deck" onGenerate={generate} />

        <div>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}
          {deck && (
            <div>
              <div className="mb-4 flex items-center gap-3">
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
    </div>
  );
}
