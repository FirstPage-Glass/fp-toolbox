"use client";

import type { UnifiedTool } from "@/lib/unified-tools";

interface QuickAccessPanelProps {
  tools: UnifiedTool[];
}

export function QuickAccessPanel({ tools }: QuickAccessPanelProps) {
  const quickAccessTools = tools.filter((t) => t.quickAccess || t.favorite);

  if (quickAccessTools.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-amber-500">⚡</span>
        Quick Access
      </h3>
      <div className="space-y-2">
        {quickAccessTools.slice(0, 6).map((tool) =>
          tool.url ? (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  tool.category === "Automation"
                    ? "bg-emerald-500"
                    : tool.category === "Reporting"
                    ? "bg-amber-500"
                    : tool.category === "Content"
                    ? "bg-blue-500"
                    : tool.category === "Data"
                    ? "bg-cyan-500"
                    : tool.category === "Integration"
                    ? "bg-orange-500"
                    : "bg-purple-500"
                }`}
              />
              <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors flex-1 truncate">
                {tool.name}
              </span>
              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                Open ↗
              </span>
            </a>
          ) : (
            <div key={tool.id} className="flex items-center gap-3 p-2 rounded-lg">
              <span
                className={`w-2 h-2 rounded-full ${
                  tool.category === "Automation"
                    ? "bg-emerald-500"
                    : tool.category === "Reporting"
                    ? "bg-amber-500"
                    : tool.category === "Content"
                    ? "bg-blue-500"
                    : tool.category === "Data"
                    ? "bg-cyan-500"
                    : tool.category === "Integration"
                    ? "bg-orange-500"
                    : "bg-purple-500"
                }`}
              />
              <span className="text-sm text-slate-700 flex-1 truncate">
                {tool.name}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
