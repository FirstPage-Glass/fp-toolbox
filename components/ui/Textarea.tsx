import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

/** Labeled textarea with the standard control styling. Safe in client components only. */
export default function Textarea({ label, id, className = "", ...rest }: TextareaProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <div>
      {label ? (
        <label htmlFor={controlId} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <textarea
        id={controlId}
        className={`block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fp-500 focus:border-transparent text-slate-900 ${className}`}
        {...rest}
      />
    </div>
  );
}
