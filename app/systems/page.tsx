"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { fetchAllTools, getCoverImageUrl, type NocoDBTool } from "@/lib/nocodb";

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
        badge: "bg-blue-100 text-blue-700",
        dot: "bg-blue-400",
        border: "border-blue-200",
      };
    if (["Production", "Live", "Active"].includes(status))
      return {
        badge: "bg-green-100 text-green-700",
        dot: "bg-green-500",
        border: "border-green-200",
      };
    if (["Prototype", "Prototype (In Use)"].includes(status))
      return {
        badge: "bg-amber-100 text-amber-700",
        dot: "bg-amber-500",
        border: "border-amber-200",
      };
    if (status === "Building")
      return {
        badge: "bg-fp-100 text-fp-700",
        dot: "bg-fp-500",
        border: "border-fp-200",
      };
    if (status === "Refactoring")
      return {
        badge: "bg-violet-100 text-violet-700",
        dot: "bg-violet-500",
        border: "border-violet-200",
      };
    return {
      badge: "bg-slate-100 text-slate-700",
      dot: "bg-slate-400",
      border: "border-slate-200",
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
            <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
              <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
              <h2 className="text-lg font-bold text-slate-800">{status}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                {sectionTools.length}
              </span>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectionTools.map((tool) => {
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
                      {hasMetrics && (
                        <div className="mb-4 flex items-center gap-3">
                          {tool.hours_saved_per_month && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                              ⏱️ {tool.hours_saved_per_month}h/mo
                            </span>
                          )}
                          {tool.cost_saved_per_month && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-fp-50 text-fp-700 rounded-full text-xs font-semibold">
                              💰 HK${tool.cost_saved_per_month.toLocaleString()}/mo
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
          </section>
        );
      })}
    </div>
  );
}
