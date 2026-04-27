"use client";

import type { ToolCategory } from "@/lib/data";

interface CategoryFilterProps {
  selected: ToolCategory | "All";
  onChange: (category: ToolCategory | "All") => void;
}

const categories: (ToolCategory | "All")[] = ["All", "AI", "Automation", "Internal", "Analytics"];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === category
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {category === "All" ? "All Tools" : category}
        </button>
      ))}
    </div>
  );
}
