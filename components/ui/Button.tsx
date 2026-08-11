import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "brand";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-grad-cta text-white shadow-[0_6px_16px_oklch(0.62_0.19_22_/_0.35)] hover:brightness-105",
  secondary: "bg-white border border-border text-navy hover:border-blue hover:text-fp-600",
  brand: "bg-fp-100 text-fp-700 hover:bg-fp-200",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-[14px]",
  lg: "px-6 py-3 text-[15px]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Shared button. Safe in client components only (event handlers). */
export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] font-bold tracking-[0.02em] min-h-[44px] transition-all active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    />
  );
}
