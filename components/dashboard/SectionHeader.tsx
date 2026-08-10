import type { ReactNode } from "react";
import RangePicker from "./RangePicker";
import InsightList from "./InsightList";
import type { Insight } from "@/lib/insights";

interface SectionHeaderProps {
  /** Anchor id the sticky nav jumps to (#website / #sales). */
  id: string;
  /** Accent color scheme for the section. */
  accent: "website" | "sales";
  title: string;
  description: string;
  days: number;
  insights: Insight[];
  /** Extra content on the header right (e.g. uptime status pills). */
  right?: ReactNode;
}

const ACCENT_BAR: Record<SectionHeaderProps["accent"], string> = {
  website: "bg-fp-500",
  sales: "bg-emerald-500",
};

/** Section header: accent bar + title + range picker + rule-driven insights. */
export default function SectionHeader({
  id,
  accent,
  title,
  description,
  days,
  insights,
  right,
}: SectionHeaderProps) {
  return (
    <div id={id} className="scroll-mt-40">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`mt-2 w-1.5 self-stretch rounded-full ${ACCENT_BAR[accent]}`} aria-hidden />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          {right ?? null}
          <RangePicker days={days} />
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Key takeaways
        </p>
        <div className="mt-2">
          <InsightList insights={insights} />
        </div>
      </div>
    </div>
  );
}
