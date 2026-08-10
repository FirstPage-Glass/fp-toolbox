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
        <label htmlFor={controlId} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        id={controlId}
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fp-500 focus:border-transparent text-slate-900 ${className}`}
        {...rest}
      />
    </div>
  );
}
