import type { ReactNode } from "react";

/** Chart legend row (design-ref .legend): color swatch + label. */
export default function Legend({
  items,
  center = false,
}: {
  items: { color: string; label: ReactNode }[];
  center?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap gap-4 mt-2.5 text-xs text-muted ${center ? "justify-center" : ""}`}
    >
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <i className="w-2.5 h-2.5 rounded-[3px] inline-block" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
