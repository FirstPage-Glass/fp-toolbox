"use client";

import { useState } from "react";

export interface BriefFormValues {
  clientName: string;
  industry: string;
  objective: string;
  targetMarket: string;
  budget: string;
  website: string;
  notes: string;
}

export const EMPTY_BRIEF: BriefFormValues = {
  clientName: "",
  industry: "",
  objective: "",
  targetMarket: "",
  budget: "",
  website: "",
  notes: "",
};

export default function BriefForm({
  brief,
  onChange,
  submitLabel,
  onGenerate,
}: {
  brief: BriefFormValues;
  onChange: (b: BriefFormValues) => void;
  submitLabel: string;
  onGenerate: (brief: BriefFormValues) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  const set = (k: keyof BriefFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...brief, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onGenerate(brief);
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <span className="text-sm font-semibold text-slate-700">Client brief</span>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Client name *</label>
          <input className={input} value={brief.clientName} onChange={set("clientName")} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
          <input className={input} value={brief.industry} onChange={set("industry")} required placeholder="e.g. Financial Services" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Objective *</label>
          <input className={input} value={brief.objective} onChange={set("objective")} required placeholder="e.g. Lead Generation (B2B)" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Target market</label>
          <input className={input} value={brief.targetMarket} onChange={set("targetMarket")} placeholder="e.g. Hong Kong, Singapore" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
          <input className={input} value={brief.budget} onChange={set("budget")} placeholder="e.g. HKD 50k/month" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Client website</label>
          <input className={input} value={brief.website} onChange={set("website")} placeholder="https://… (enables PSI + competitor data)" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea className={input} rows={3} value={brief.notes} onChange={set("notes")} />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-fp-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-50"
      >
        {busy ? "Generating…" : submitLabel}
      </button>
    </form>
  );
}
