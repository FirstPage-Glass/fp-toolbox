"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  fetchAllUnifiedTools,
  filterTools,
  getAllTags,
  type UnifiedToolCategory,
  type UnifiedTool,
} from "@/lib/unified-tools";
import { ToolSearch } from "@/components/toolbox/ToolSearch";
import { ToolGrid } from "@/components/toolbox/ToolGrid";
import { CategoryFilter } from "@/components/toolbox/CategoryFilter";
import { QuickAccessPanel } from "@/components/toolbox/QuickAccessPanel";

// Update ToolCard props to use id instead of slug
declare module "@/components/toolbox/ToolCard" {
  interface ToolCardProps {
    tool: UnifiedTool;
    onToggleFavorite?: (id: string) => void;
  }
}

export default function ToolboxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<UnifiedToolCategory | "All">("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTools, setAllTools] = useState<UnifiedTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("toolbox-favorites");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

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

  const allTags = useMemo(() => getAllTags(allTools), [allTools]);

  const enhanceToolsWithFavorites = useCallback(
    (tools: UnifiedTool[]) => tools.map((tool) => ({
      ...tool,
      favorite: favorites.has(tool.id),
    })),
    [favorites]
  );

  const toolsWithFavorites = useMemo(
    () => enhanceToolsWithFavorites(allTools),
    [allTools, enhanceToolsWithFavorites]
  );

  const filteredTools = useMemo(() => {
    const filtered = filterTools(allTools, {
      search: searchQuery,
      category: selectedCategory,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    });
    return enhanceToolsWithFavorites(filtered);
  }, [searchQuery, selectedCategory, selectedTags, allTools, enhanceToolsWithFavorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem("toolbox-favorites", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-slate-900">Toolbox</h1>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {filteredTools.length} tools
          </span>
        </div>
        <p className="text-slate-600">
          All AI and automation tools in one place. Search, filter, and star your favorites.
        </p>
        <nav className="flex items-center gap-2 mt-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Overview
          </Link>
          <span>/</span>
          <span className="text-slate-700">Toolbox</span>
        </nav>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">Loading tools from NocoDB...</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0 space-y-5">
            <QuickAccessPanel tools={toolsWithFavorites} />

          {/* Tag Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-3 text-xs text-slate-500 hover:text-slate-700"
              >
                Clear all filters
              </button>
            )}
          </div>

            {/* Stats */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Automation</span>
                  <span className="font-medium text-emerald-600">
                    {allTools.filter((t) => t.category === "Automation").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Content</span>
                  <span className="font-medium text-blue-600">
                    {allTools.filter((t) => t.category === "Content").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Reporting</span>
                  <span className="font-medium text-amber-600">
                    {allTools.filter((t) => t.category === "Reporting").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Data</span>
                  <span className="font-medium text-cyan-600">
                    {allTools.filter((t) => t.category === "Data").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Integration</span>
                  <span className="font-medium text-orange-600">
                    {allTools.filter((t) => t.category === "Integration").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Utility</span>
                  <span className="font-medium text-purple-600">
                    {allTools.filter((t) => t.category === "Utility").length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-5">
            <ToolSearch value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

            {searchQuery && (
              <p className="text-sm text-slate-500">
                Showing {filteredTools.length} results for "{searchQuery}"
              </p>
            )}

            <ToolGrid
              tools={filteredTools}
              onToggleFavorite={handleToggleFavorite}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
