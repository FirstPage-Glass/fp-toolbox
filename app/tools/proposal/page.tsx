"use client";

import { useState } from "react";
import BriefForm, { type BriefFormValues } from "@/components/tools/BriefForm";

interface ProposalSection {
  heading: string;
  paragraphs: string[];
  bullets: string[];
}

interface Proposal {
  title: string;
  sections: ProposalSection[];
}

export default function ProposalPage() {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cost, setCost] = useState<number | null>(null);

  async function generate(brief: BriefFormValues) {
    setError(null);
    setProposal(null);
    const res = await fetch("/api/tools/proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brief),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Generation failed");
      return;
    }
    setProposal(data.proposal);
    setCost(data.meta?.costUsd ?? null);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Proposal Generator</h1>
      <p className="mt-1 text-sm text-slate-600">
        Same client brief, proposal template — a full draft with case proof and investment framing.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <BriefForm submitLabel="Generate proposal" onGenerate={generate} />

        <div>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}
          {proposal && (
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
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-10 shadow-sm">
                  <h1 className="text-3xl font-bold text-slate-900">{proposal.title}</h1>
                  <p className="mt-2 text-sm text-fp-700">Prepared by First Page Digital</p>
                </div>
                {proposal.sections.map((s, i) => (
                  <section key={i} className="rounded-xl border border-slate-200 bg-white p-10 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">{s.heading}</h2>
                    {s.paragraphs.map((p, j) => (
                      <p key={j} className="mt-3 text-slate-700">{p}</p>
                    ))}
                    {s.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {s.bullets.map((b, j) => (
                          <li key={j} className="flex gap-2 text-slate-700">
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
          )}
        </div>
      </div>
    </div>
  );
}
