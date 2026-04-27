"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { fetchAllTools, getCoverImageUrl, type NocoDBTool } from "@/lib/nocodb";

export default function SystemsPage() {
  const [tools, setTools] = useState<NocoDBTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchAllTools();
      setTools(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // Dynamic categories from actual NocoDB data
  const categories = useMemo(() => {
    const cats = new Set<string>();
    tools.forEach((t) => { if (t.category) cats.add(t.category); });
    return Array.from(cats).sort();
  }, [tools]);

  const filtered = useMemo(() => {
    if (filter === "All") return tools;
    return tools.filter((t) => t.category === filter);
  }, [filter, tools]);

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      Automation: "bg-emerald-100 text-emerald-700",
      Reporting: "bg-amber-100 text-amber-700",
      Content: "bg-fp-100 text-fp-700",
      Utility: "bg-purple-100 text-purple-700",
      System: "bg-slate-100 text-slate-700",
    };
    return map[cat] || "bg-slate-100 text-slate-700";
  };

  const getStatusBadge = (status: string) => {
    if (["Production", "Live", "Active"].includes(status))
      return "bg-green-100 text-green-700";
    if (["Prototype", "Prototype (In Use)"].includes(status))
      return "bg-amber-100 text-amber-700";
    if (status === "Building") return "bg-fp-100 text-fp-700";
    if (status === "Refactoring") return "bg-violet-100 text-violet-700";
    return "bg-slate-100 text-slate-700";
  };

  const parseTech = (ts?: string | null) => {
    if (!ts) return [];
    return ts.split(/[+&,]/).map((t) => t.trim()).filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-slate-200 rounded animate-pulse" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Our Systems</h1>
          <p className="text-slate-600 mt-1 max-w-xl">
            Production-ready AI pipelines and automation systems that run 24/7.
            Not demos — real infrastructure saving hours and cutting costs every month.
          </p>
        </div>
        <Link href="/" className="text-sm font-medium text-fp-500 hover:text-fp-700">
          ← Back to Overview
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterTab
          label="All"
          count={tools.length}
          active={filter === "All"}
          onClick={() => setFilter("All")}
        />
        {categories.map((cat) => (
          <FilterTab
            key={cat}
            label={cat}
            count={tools.filter((t) => t.category === cat).length}
            active={filter === cat}
            onClick={() => setFilter(cat)}
          />
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tool) => {
          const coverImage = tool.cover_image && tool.cover_image.length > 0
            ? getCoverImageUrl(tool.cover_image[0])
            : null;
          const techStack = parseTech(tool.tech_stack);
          const hasMetrics = tool.hours_saved_per_month || tool.cost_saved_per_month;

          return (
            <Link
              key={tool.slug}
              href={`/projects/${tool.slug}`}
              className="group block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-fp-300 transition-all"
            >
              {/* Cover Image */}
              {coverImage && (
                <div className="w-full h-36 overflow-hidden">
                  <img
                    src={coverImage}
                    alt={tool.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {tool.category && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getCategoryColor(tool.category)}`}>
                      {tool.category}
                    </span>
                  )}
                  {tool.status && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(tool.status)}`}>
                      {tool.status}
                    </span>
                  )}
                  {tool.type?.map((t) => (
                    <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Name + Tagline */}
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-fp-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {tool.tagline || tool.description}
                </p>

                {/* Serve badges */}
                {tool.serve && tool.serve.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tool.serve.map((s) => (
                      <span key={s} className="px-2 py-0.5 text-xs font-medium rounded-md border bg-orange-50 text-orange-700 border-orange-200">
                        👤 {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metrics */}
                {hasMetrics && (
                  <div className="mb-4 flex items-center gap-3">
                    {tool.hours_saved_per_month && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                        ⏱️ {tool.hours_saved_per_month}h/mo
                      </span>
                    )}
                    {tool.cost_saved_per_month && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-fp-50 text-fp-700 rounded-full text-xs font-semibold">
                        💰 ${tool.cost_saved_per_month.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                )}

                {/* Tech preview */}
                <div className="flex flex-wrap gap-1">
                  {techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-slate-50 rounded-md text-slate-500">
                      {tech}
                    </span>
                  ))}
                  {techStack.length > 4 && (
                    <span className="text-xs px-2 py-1 bg-slate-50 rounded-md text-slate-400">
                      +{techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const activeClasses = active
    ? "bg-slate-900 text-white"
    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeClasses}`}
    >
      {label}
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
        {count}
      </span>
    </button>
  );
}
