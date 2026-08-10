"use client";

interface ToolSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/** Controlled search input with icon. */
export default function ToolSearch({ value, onChange }: ToolSearchProps) {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden
      >
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tools by name, description, category or owner…"
        aria-label="Search tools"
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-fp-500"
      />
    </div>
  );
}
