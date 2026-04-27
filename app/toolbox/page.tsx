"use client";

import { useState, useMemo, useEffect } from "react";
import {
  fetchAllUnifiedTools,
  filterTools,
  type UnifiedToolCategory,
  type UnifiedTool,
} from "@/lib/unified-tools";
import { ToolSearch } from "@/components/toolbox/ToolSearch";
import { ToolGrid } from "@/components/toolbox/ToolGrid";
import { CategoryFilter } from "@/components/toolbox/CategoryFilter";


export default function ToolboxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<UnifiedToolCategory | "All">("All");
  const [allTools, setAllTools] = useState<UnifiedTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live data from NocoDB
  useEffect(() => {
    const loadTools = async () => {
      setIsLoading(true);
      const tools = await fetchAllUnifiedTools();
      setAllTools(tools);
      setIsLoading(false);
    };
    loadTools();
  }, []);

  const filteredTools = useMemo(() => {
    const liveTools = allTools.filter((t) => Boolean(t.url));
    return filterTools(liveTools, {
      search: searchQuery,
      category: selectedCategory,
    });
  }, [searchQuery, selectedCategory, allTools]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-fp-900 text-white p-8 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fp-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🧰</span>
            <div>
              <h1 className="text-3xl font-bold">FP Toolbox</h1>
              <p className="text-sm text-slate-300">Built by Glass Chan</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-white/10 backdrop-blur text-sm font-medium rounded-full">
              {filteredTools.length} live tools
            </span>
          </div>

          <p className="text-slate-300 max-w-2xl mb-6">
            Everything here is production-ready and running 24/7. No demos — real systems saving hours every week.
          </p>

          {!isLoading && (
            <div className="space-y-4 mb-6">
              <ToolSearch value={searchQuery} onChange={setSearchQuery} variant="dark" />
              <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} variant="dark" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400">Need something new or found a bug?</span>
            <a
              href="mailto:glass.c@firstpage.com.hk"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg transition-colors"
            >
              <span>✉️</span>
              <span>glass.c@firstpage.com.hk</span>
            </a>
            <span className="text-xs text-slate-500">or Slack @glasschan</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-fp-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">Loading tools from NocoDB...</p>
        </div>
      ) : (
        <div className="space-y-5">
            {searchQuery && (
              <p className="text-sm text-slate-500">
                Showing {filteredTools.length} results for &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            <ToolGrid
              tools={filteredTools}
              onClearFilters={handleClearFilters}
            />
          </div>
      )}
    </div>
  );
}
