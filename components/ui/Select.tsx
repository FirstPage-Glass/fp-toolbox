import { useId } from "react";
import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

/** Labeled select with the standard control styling. Safe in client components only. */
export default function Select({ label, id, className = "", children, ...rest }: SelectProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <div>
      {label ? (
        <label htmlFor={controlId} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <select
        id={controlId}
        className={`block w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-fp-500 focus:border-transparent text-slate-900 ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
