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
  white: "bg-white border-border",
  slate: "bg-surface border-border",
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
      className={`rounded-[14px] shadow-[var(--shadow-sm)] border ${TONE[tone]} ${
        noPadding ? "" : "p-6"
      } ${
        hover
          ? "hover:shadow-[var(--shadow-md)] hover:-translate-y-[3px] hover:border-fp-300 transition-all"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
