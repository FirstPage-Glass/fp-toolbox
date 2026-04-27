"use client";

import type { UnifiedTool } from "@/lib/unified-tools";
import { ToolCard } from "./ToolCard";

interface ToolGridProps {
  tools: UnifiedTool[];
  onToggleFavorite?: (id: string) => void;
  onClearFilters?: () => void;
}

export function ToolGrid({ tools, onToggleFavorite, onClearFilters }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 text-lg">No tools match your search.</p>
        <p className="text-slate-400 text-sm mt-2">Try adjusting your filters.</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}
