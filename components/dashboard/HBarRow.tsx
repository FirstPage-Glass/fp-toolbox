import type { ReactNode } from "react";

interface HBarRowProps {
  name: string;
  /** 0-100 fill width. */
  pct: number;
  value: ReactNode;
  color: string;
  nameWidth?: string;
}

/** Horizontal bar row (design-ref .hbar-row): label right-aligned + track + mono value. */
export default function HBarRow({
  name,
  pct,
  value,
  color,
  nameWidth = "w-[130px]",
}: HBarRowProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className={`${nameWidth} shrink-0 text-[13px] font-semibold text-navy truncate text-right`} title={name}>
        {name}
      </span>
      <div className="flex-1 h-[18px] rounded-[5px] bg-surface overflow-hidden">
        <div className="h-full rounded-[5px]" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-[64px] shrink-0 text-right font-mono text-[12.5px] text-muted tabular-nums">
        {value}
      </span>
    </div>
  );
}
