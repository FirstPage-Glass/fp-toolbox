"use client";

interface CategoryFilterProps {
  /** Ordered category labels to render (All is prepended automatically). */
  categories: string[];
  /** Active category, or null for All. */
  active: string | null;
  onChange: (category: string | null) => void;
}

/** Horizontal category chips: All + one per category, single-select. */
export default function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  const chip = (label: string, selected: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? "bg-fp-600 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:border-fp-300 hover:text-fp-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {chip("All", active === null, () => onChange(null))}
      {categories.map((c) => chip(c, active === c, () => onChange(c)))}
    </div>
  );
}
