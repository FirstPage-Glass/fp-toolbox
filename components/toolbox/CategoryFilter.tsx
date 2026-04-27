"use client";

import type { UnifiedToolCategory } from "@/lib/unified-tools";

interface CategoryFilterProps {
  selected: UnifiedToolCategory | "All";
  onChange: (category: UnifiedToolCategory | "All") => void;
  variant?: "light" | "dark";
  availableCategories?: UnifiedToolCategory[];
}

const allCategories: (UnifiedToolCategory | "All")[] = [
  "All",
  "Automation",
  "Content",
  "Reporting",
  "Utility",
  "System",
];

export function CategoryFilter({ selected, onChange, variant = "light", availableCategories }: CategoryFilterProps) {
  const isDark = variant === "dark";

  const categories: (UnifiedToolCategory | "All")[] = availableCategories
    ? ["All", ...availableCategories]
    : allCategories;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === category
              ? "bg-fp-500 text-white shadow-md"
              : isDark
              ? "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20 backdrop-blur"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {category === "All" ? "All Tools" : category}
        </button>
      ))}
    </div>
  );
}
