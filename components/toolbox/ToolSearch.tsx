"use client";

interface ToolSearchProps {
  value: string;
  onChange: (value: string) => void;
  variant?: "light" | "dark";
}

export function ToolSearch({ value, onChange, variant = "light" }: ToolSearchProps) {
  const isDark = variant === "dark";
  return (
    <div className="relative">
      <label htmlFor="tool-search" className="sr-only">
        Search tools by name, description, tech stack...
      </label>
      <svg
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-400"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        id="tool-search"
        type="text"
        placeholder="Search tools by name, description, tech stack..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-fp-500 focus:border-transparent transition-all ${
          isDark
            ? "bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur"
            : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"
        }`}
      />
    </div>
  );
}
