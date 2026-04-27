"use client";

import type { UnifiedTool } from "@/lib/unified-tools";

interface ToolCardProps {
  tool: UnifiedTool;
}

const categoryColors: Record<string, string> = {
  Automation: "bg-emerald-100 text-emerald-700",
  Data: "bg-cyan-100 text-cyan-700",
  Reporting: "bg-amber-100 text-amber-700",
  Content: "bg-fp-100 text-fp-700",
  Integration: "bg-orange-100 text-orange-700",
  Utility: "bg-purple-100 text-purple-700",
};

const statusBadges: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Production: "bg-green-100 text-green-700",
  Live: "bg-green-100 text-green-700",
  "Internal Tool": "bg-slate-100 text-slate-700",
  Prototype: "bg-amber-100 text-amber-700",
  Inactive: "bg-red-100 text-red-700",
  Building: "bg-fp-100 text-fp-700",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-fp-300 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              categoryColors[tool.category] || categoryColors.Utility
            }`}
          >
            {tool.category}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              statusBadges[tool.status] || statusBadges.Prototype
            }`}
          >
            {tool.status}
          </span>
          {tool.status === "Building" && tool.priority && (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                priorityColors[tool.priority] || priorityColors.Medium
              }`}
            >
              {tool.priority} Priority
            </span>
          )}
        </div>
      </div>

      {tool.slug ? (
        <a
          href={`/projects/${tool.slug}`}
          className="font-semibold text-slate-900 mb-2 group-hover:text-fp-500 transition-colors block"
        >
          {tool.name}
        </a>
      ) : (
        <h3 className="font-semibold text-slate-900 mb-2">
          {tool.name}
        </h3>
      )}

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
              className="text-xs px-2.5 py-1 bg-fp-500 text-white rounded-md hover:bg-fp-700 transition-colors"
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
              Repo ↗
            </a>
          )}
        </div>
        {tool.owner && (
          <span className="text-xs text-slate-500">
            {tool.owner}
          </span>
        )}
      </div>
    </div>
  );
}
