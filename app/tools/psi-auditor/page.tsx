"use client";
import tool from "./tool";
import { ToolPageHeader } from "@/lib/tool-icons";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";

interface PsiAuditResult {
  url: string;
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  lcpMs: number | null;
  cls: number | null;
  tbtMs: number | null;
  grades: {
    performance: string;
    accessibility: string;
    bestPractices: string;
    seo: string;
  };
}

const CATS = [
  { key: "performance", label: "Performance" },
  { key: "accessibility", label: "Accessibility" },
  { key: "bestPractices", label: "Best Practices" },
  { key: "seo", label: "SEO" },
] as const;

type CatKey = (typeof CATS)[number]["key"];

function badgeClass(grade: string): string {
  if (grade === "Good") return "bg-green-100 text-green-700";
  if (grade === "Needs improvement") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function PsiAuditorPage() {
  const prefill = usePrefill();
  const [url, setUrl] = useState(prefill.url || "");
  const { data, error, loading, run } = useToolApi<PsiAuditResult>("psi-auditor");

  const sendTo: SendToLink[] = data
    ? [
        {
          label: "URL Inspector",
          href: prefillUrl("/tools/url-inspector", { url, site: url }),
        },
        {
          label: "Mobile vs Desktop",
          href: prefillUrl("/tools/mobile-desktop-psi", { url }),
        },
        {
          label: "Pitch Deck",
          href: prefillUrl("/tools/pitch-deck", { website: url }),
        },
      ]
    : [];

  return (
    <>
      <ToolPageHeader tool={tool} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-6 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://client-site.com/page"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
        />
        <button
          onClick={() => run({ url })}
          disabled={loading || !url}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {loading ? "Auditing…" : "Audit"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {data && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {sendTo.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg bg-fp-100 px-3 py-1.5 text-sm font-semibold text-fp-700 hover:bg-fp-200"
              >
                {l.label} →
              </a>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATS.map((c) => {
              const score = data[c.key as CatKey] as number | null;
              const grade = data.grades[c.key as CatKey];
              return (
                <div key={c.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {c.label}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeClass(grade)}`}>
                      {grade}
                    </span>
                  </div>
                  <div
                    className={`mt-2 text-3xl font-extrabold ${
                      score === null
                        ? "text-slate-400"
                        : score >= 90
                          ? "text-green-600"
                          : score >= 50
                            ? "text-amber-600"
                            : "text-red-600"
                    }`}
                  >
                    {score === null ? "n/a" : score}
                  </div>
                  <div className="text-xs text-slate-400">/ 100</div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                LCP (mobile)
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {data.lcpMs ? `${Math.round(data.lcpMs / 1000)}s` : "n/a"}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                TBT (mobile)
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {data.tbtMs != null ? `${Math.round(data.tbtMs / 1000)}s` : "n/a"}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                CLS (mobile)
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {data.cls != null ? data.cls.toFixed(3) : "n/a"}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
