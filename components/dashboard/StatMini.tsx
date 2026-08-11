import type { ReactNode } from "react";

/** Label/value row used inside dashboard cards (design-ref .stat-mini). */
export default function StatMini({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 border-b border-dashed border-border last:border-0">
      <span className="text-[13.5px] text-muted">{label}</span>
      <span className="font-extrabold text-[18px] text-navy leading-none tabular-nums">
        {value}
      </span>
    </div>
  );
}
