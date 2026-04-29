"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { fetchAllTools, getCoverImageUrl, calculateCostSaved, type NocoDBTool } from "@/lib/nocodb";

const STATUS_ORDER = [
  "Production",
  "Live",
  "Active",
  "Prototype (In Use)",
  "Prototype",
  "Building",
  "Refactoring",
  "Planned",
];

export default function SystemsPage() {
  const [tools, setTools] = useState<NocoDBTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchAllTools();
      setTools(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, NocoDBTool[]>();
    tools.forEach((t) => {
      const status = t.status || "Unknown";
      if (!map.has(status)) map.set(status, []);
      map.get(status)!.push(t);
    });

    // Sort statuses by preferred order, then alphabetically for any extras
    const sortedStatuses = Array.from(map.keys()).sort((a, b) => {
      const ia = STATUS_ORDER.indexOf(a);
      const ib = STATUS_ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedStatuses.map((status) => ({
      status,
      tools: map.get(status)!,
    }));
  }, [tools]);

  const getStatusSectionStyle = (status: string) => {
    if (status === "Planned")
      return {
        badge: "bg-blue-500/20 text-blue-100",
        dot: "bg-blue-400",
        border: "border-blue-500",
        headerBg: "bg-blue-900",
      };
    if (["Production", "Live", "Active"].includes(status))
      return {
        badge: "bg-green-500/20 text-green-100",
        dot: "bg-green-400",
        border: "border-green-500",
        headerBg: "bg-green-900",
      };
    if (["Prototype", "Prototype (In Use)"].includes(status))
      return {
        badge: "bg-amber-500/20 text-amber-100",
        dot: "bg-amber-400",
        border: "border-amber-500",
        headerBg: "bg-amber-900",
      };
    if (status === "Building")
      return {
        badge: "bg-fp-500/20 text-fp-100",
        dot: "bg-fp-400",
        border: "border-fp-500",
        headerBg: "bg-fp-900",
      };
    if (status === "Refactoring")
      return {
        badge: "bg-violet-500/20 text-violet-100",
        dot: "bg-violet-400",
        border: "border-violet-500",
        headerBg: "bg-violet-900",
      };
    return {
      badge: "bg-slate-500/20 text-slate-100",
      dot: "bg-slate-400",
      border: "border-slate-500",
      headerBg: "bg-slate-800",
    };
  };

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

  const parseTech = (ts?: string | null) => {
    if (!ts) return [];
    return ts.split(/[+&,]/).map((t) => t.trim()).filter(Boolean);
  };

  const formatSince = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value + "-01");
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const serveStyles: Record<string, { emoji: string; bg: string; text: string; border: string }> = {
    Finance:    { emoji: "💰", bg: "bg-emerald-50",    text: "text-emerald-700",    border: "border-emerald-200" },
    AMs:        { emoji: "👤", bg: "bg-sky-50",        text: "text-sky-700",        border: "border-sky-200" },
    Clients:    { emoji: "🤝", bg: "bg-violet-50",     text: "text-violet-700",     border: "border-violet-200" },
    "SEO Tech": { emoji: "🔍", bg: "bg-amber-50",      text: "text-amber-700",      border: "border-amber-200" },
    Content:    { emoji: "📝", bg: "bg-fp-50",         text: "text-fp-700",         border: "border-fp-200" },
    Sales:      { emoji: "📈", bg: "bg-rose-50",        text: "text-rose-700",        border: "border-rose-200" },
    Everyone:   { emoji: "🌍", bg: "bg-slate-100",      text: "text-slate-700",      border: "border-slate-200" },
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
    <div className="space-y-10">
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

      {/* Status Sections */}
      {grouped.map(({ status, tools: sectionTools }) => {
        const style = getStatusSectionStyle(status);
        return (
          <section key={status} className="space-y-4">
            {/* Section Header */}
            <div className={`flex items-center gap-3 p-4 rounded-xl ${style.headerBg} shadow-md`}>
              <span className={`w-3 h-3 rounded-full ${style.dot} ring-2 ring-white/30`} />
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{status}</h2>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${style.badge}`}>
                {sectionTools.length} system{sectionTools.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectionTools.map((tool) => {
                const coverImage = tool.cover_image && tool.cover_image.length > 0
                  ? getCoverImageUrl(tool.cover_image[0])
                  : null;
                const techStack = parseTech(tool.tech_stack);
                const calculatedCost = calculateCostSaved(tool.hours_saved_per_month);
                const hasMetrics = tool.hours_saved_per_month || calculatedCost > 0;

                return (
                  <div
                    key={tool.slug}
                    className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-fp-300 transition-all flex flex-col"
                  >
                    {/* Cover Image */}
                    {coverImage && (
                      <Link href={`/projects/${tool.slug}`} className="relative block w-full h-36 overflow-hidden">
                        <img
                          src={coverImage}
                          alt={tool.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Type badges overlay top-right */}
                        {tool.type && tool.type.length > 0 && (
                          <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
                            {tool.type.map((t) => (
                              <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 backdrop-blur-sm">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {tool.category && (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getCategoryColor(tool.category)}`}>
                            {tool.category}
                          </span>
                        )}
                      </div>

                      {/* Name + Tagline */}
                      <Link href={`/projects/${tool.slug}`}>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-fp-600 transition-colors">
                          {tool.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                        {tool.tagline || tool.description}
                      </p>

                      {/* Serve badges */}
                      {tool.serve && tool.serve.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tool.serve.map((s) => {
                            const style = serveStyles[s] || serveStyles.Everyone;
                            return (
                              <span key={s} className={`px-2 py-0.5 text-xs font-medium rounded-md border ${style.bg} ${style.text} ${style.border}`}>
                                {style.emoji} {s}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Metrics */}
                      {(hasMetrics || tool.since) && (
                        <div className="mb-4 flex items-center gap-3 flex-wrap">
                          {tool.since && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
                              📅 Since {formatSince(tool.since)}
                            </span>
                          )}
                          {tool.hours_saved_per_month && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                              ⏱️ {tool.hours_saved_per_month}h/mo
                            </span>
                          )}
                          {calculatedCost > 0 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-fp-50 text-fp-700 rounded-full text-xs font-semibold">
                              💰 HK${calculatedCost.toLocaleString()}/mo
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tech preview */}
                      <div className="flex flex-wrap gap-1 mb-4">
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

                      {/* Action Buttons */}
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
                        {tool.live_link && (
                          <a
                            href={tool.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2.5 py-1 bg-fp-500 text-white rounded-md hover:bg-fp-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open ↗
                          </a>
                        )}
                        {tool.gh_link && (
                          <a
                            href={tool.gh_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2.5 py-1 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Repo ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
