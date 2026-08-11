import type { ReactNode } from "react";

/** Card header row: title + right-aligned "Source: X" label (design-ref .card .hd). */
export default function CardHead({
  title,
  src,
}: {
  title: string;
  src?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <h3 className="text-[15.5px] font-extrabold text-navy">{title}</h3>
      {src ? (
        <span className="ml-auto text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
          Source: <b className="text-fp-600 font-bold">{src}</b>
        </span>
      ) : null}
    </div>
  );
}
