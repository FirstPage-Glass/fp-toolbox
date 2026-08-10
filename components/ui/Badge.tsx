import type { ReactNode } from "react";

type BadgeColor = "fp" | "slate" | "emerald" | "blue" | "amber" | "rose" | "violet";

const COLOR: Record<BadgeColor, string> = {
  fp: "bg-fp-100 text-fp-700",
  slate: "bg-slate-100 text-slate-700",
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
  violet: "bg-violet-100 text-violet-700",
};

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
}

/** Small rounded status/category pill. Static class map — no dynamic Tailwind classes. */
export default function Badge({ children, color = "slate", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLOR[color]} ${className}`}
    >
      {children}
    </span>
  );
}
