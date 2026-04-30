"use client";

import type { UnifiedTool } from "@/lib/unified-tools";
import Image from "next/image";

interface ToolCardProps {
  tool: UnifiedTool;
}

const categoryColors: Record<string, string> = {
  Automation: "bg-emerald-100 text-emerald-700",
  Reporting: "bg-amber-100 text-amber-700",
  Content: "bg-fp-100 text-fp-700",
  Utility: "bg-purple-100 text-purple-700",
  System: "bg-slate-100 text-slate-700",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

const typeColors: Record<string, string> = {
  "Agentic Workflow": "bg-indigo-50 text-indigo-700 border-indigo-200",
  N8N: "bg-orange-50 text-orange-700 border-orange-200",
  "Web App": "bg-sky-50 text-sky-700 border-sky-200",
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-fp-300 transition-all group flex flex-col">
      {/* Cover Image */}
      {tool.coverImage && (
        <div className="relative w-full aspect-[5/3] overflow-hidden shrink-0">
          <Image
            src={tool.coverImage}
            alt={tool.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          {/* Type badges overlay top-right */}
          {tool.type.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
              {tool.type.map((t) => (
                <span
                  key={t}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 backdrop-blur-sm ${
                    typeColors[t] || "bg-slate-50/90 text-slate-600 border-slate-200/80"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                categoryColors[tool.category] || categoryColors.Utility
              }`}
            >
              {tool.category}
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

        <p className="text-sm text-slate-600 mb-4">
          {tool.description}
        </p>

        {/* Since badge */}
        {tool.since && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 mb-4 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
            📅 Since {tool.since}
          </span>
        )}

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

        <div className="mt-auto pt-3 border-t border-slate-100">
          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-xs px-2.5 py-2 bg-fp-500 text-white rounded-md hover:bg-fp-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Open ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
