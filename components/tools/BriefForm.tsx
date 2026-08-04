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

interface HubSpotLead {
  id: string;
  name: string;
  email: string;
  website: string | null;
  createdAt: string;
}

const EMPTY: BriefFormValues = {
  clientName: "",
  industry: "",
  objective: "",
  targetMarket: "",
  budget: "",
  website: "",
  notes: "",
};

export default function BriefForm({
  submitLabel,
  onGenerate,
}: {
  submitLabel: string;
  onGenerate: (brief: BriefFormValues) => Promise<void>;
}) {
  const [brief, setBrief] = useState<BriefFormValues>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [leads, setLeads] = useState<HubSpotLead[] | null>(null);
  const [leadsOpen, setLeadsOpen] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);

  async function loadLeads() {
    if (leads !== null) {
      setLeadsOpen((o) => !o);
      return;
    }
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const res = await fetch("/api/hubspot/recent-leads");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load leads");
      setLeads(data.leads || []);
      setLeadsOpen(true);
    } catch (err) {
      setLeadsError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLeadsLoading(false);
    }
  }

  function pickLead(l: HubSpotLead) {
    setBrief({
      ...brief,
      clientName: l.name || l.email.split("@")[0],
      website: l.website || "",
    });
    setLeadsOpen(false);
  }

  const set = (k: keyof BriefFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setBrief({ ...brief, [k]: e.target.value });

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
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Client brief</span>
        <button
          type="button"
          onClick={loadLeads}
          disabled={leadsLoading}
          className="rounded-lg border border-fp-300 bg-fp-50 px-3 py-1.5 text-xs font-semibold text-fp-700 hover:bg-fp-100 disabled:opacity-50"
        >
          {leadsLoading ? "Loading…" : "📇 Import from HubSpot"}
        </button>
      </div>

      {leadsError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {leadsError}
        </div>
      )}

      {leadsOpen && leads && (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
          {leads.length === 0 ? (
            <p className="px-2 py-3 text-sm text-slate-500">
              No recent leads (last 3 days, spam filtered).
            </p>
          ) : (
            leads.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => pickLead(l)}
                className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left hover:bg-fp-100"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-800">
                    {l.name || "(no name)"}
                  </span>
                  <span className="block truncate text-xs text-slate-500">{l.email}</span>
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {l.website ? l.website.replace(/^https?:\/\//, "") : "—"}
                </span>
              </button>
            ))
          )}
        </div>
      )}

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
