"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-slate-900">Toolbox</h1>
          <span className="px-2.5 py-1 bg-fp-100 text-fp-700 text-sm font-medium rounded-full">
            {filteredTools.length} tools
          </span>
        </div>
        <p className="text-slate-600">
          Live tools you can use right now. For the full system inventory, visit <Link href="/systems" className="text-fp-500 hover:underline">Our Systems</Link>.
        </p>
        <nav className="flex items-center gap-2 mt-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-fp-500 transition-colors">
            Overview
          </Link>
          <span>/</span>
          <span className="text-slate-700">Toolbox</span>
        </nav>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-fp-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">Loading tools from NocoDB...</p>
        </div>
      ) : (
        <div className="space-y-5">
            <ToolSearch value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

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
