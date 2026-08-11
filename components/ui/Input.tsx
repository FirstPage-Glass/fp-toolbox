import { useId } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/** Labeled input with the standard focus ring. Safe in client components only. */
export default function Input({ label, id, className = "", ...rest }: InputProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <div>
      {label ? (
        <label htmlFor={controlId} className="mb-1.5 block text-[12.5px] font-bold text-navy">
          {label}
        </label>
      ) : null}
      <input
        id={controlId}
        className={`w-full px-3.5 py-2.5 border border-border rounded-[10px] bg-background focus:outline-none focus:border-blue focus:ring-[3px] focus:ring-fp-500/15 text-foreground text-[14px] placeholder:text-muted ${className}`}
        {...rest}
      />
    </div>
  );
}
