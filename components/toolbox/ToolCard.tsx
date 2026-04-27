"use client";

import Link from "next/link";
import type { Tool } from "@/lib/data";

interface ToolCardProps {
  tool: Tool;
  onToggleFavorite?: (slug: string) => void;
}

const categoryColors: Record<string, string> = {
  AI: "bg-violet-100 text-violet-700",
  Automation: "bg-emerald-100 text-emerald-700",
  Internal: "bg-slate-100 text-slate-700",
  Analytics: "bg-amber-100 text-amber-700",
};

const statusColors: Record<string, string> = {
  Production: "bg-green-500",
  Live: "bg-green-500",
  "Internal Tool": "bg-slate-500",
  Prototype: "bg-amber-500",
};

export function ToolCard({ tool, onToggleFavorite }: ToolCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              categoryColors[tool.category] || categoryColors.Internal
            }`}
          >
            {tool.category}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              statusColors[tool.status] || statusColors.Prototype
            }`}
            title={tool.status}
          />
        </div>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(tool.slug)}
            className="text-slate-300 hover:text-amber-500 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 rounded w-8 h-8 flex items-center justify-center"
            title={tool.favorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={tool.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {tool.favorite ? "★" : "☆"}
          </button>
        )}
      </div>

      <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        <Link href={`/projects/${tool.slug}`}>{tool.name}</Link>
      </h3>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {tool.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tool.tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
        {tool.tags.length > 5 && (
          <span className="px-2 py-0.5 text-slate-400 text-xs">
            +{tool.tags.length - 5}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex gap-2">
          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Open ↗
            </a>
          )}
          {tool.repoUrl && (
            <a
              href={tool.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2.5 py-1 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Code ↗
            </a>
          )}
        </div>
        {tool.hasWebUi && (
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Web UI
          </span>
        )}
      </div>
    </div>
  );
}
