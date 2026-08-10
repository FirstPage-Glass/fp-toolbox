import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Background tone. */
  tone?: "white" | "slate";
  /** Remove default p-6 padding (e.g. tables need full-bleed). */
  noPadding?: boolean;
  /** Interactive hover lift, for clickable cards. */
  hover?: boolean;
}

const TONE: Record<NonNullable<CardProps["tone"]>, string> = {
  white: "bg-white border-slate-200",
  slate: "bg-slate-50 border-slate-200",
};

/** Shared card container: white (or slate) background, rounded, subtle border + shadow. */
export default function Card({
  children,
  className = "",
  tone = "white",
  noPadding = false,
  hover = false,
}: CardProps) {
  return (
    <div
      className={`rounded-xl shadow-sm border ${TONE[tone]} ${
        noPadding ? "" : "p-6"
      } ${hover ? "hover:shadow-md hover:border-fp-300 transition-all" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
