"use client";

import Link from "next/link";
import { projects } from "@/lib/data";
import { useState } from "react";

type Filter = "All" | "AI" | "Automation";

export default function SystemsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  const aiCount = projects.filter((p) => p.category === "AI").length;
  const autoCount = projects.filter((p) => p.category === "Automation").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Our Systems</h1>
          <p className="text-slate-600 mt-1 max-w-xl">
            Production-ready AI pipelines and automation systems that run 24/7.
            Not demos — real infrastructure saving hours and cutting costs every
            month.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-fp-500 hover:text-fp-700"
        >
          ← Back to Overview
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <FilterTab
          label="All"
          count={projects.length}
          active={filter === "All"}
          onClick={() => setFilter("All")}
        />
        <FilterTab
          label="AI"
          count={aiCount}
          active={filter === "AI"}
          onClick={() => setFilter("AI")}
          color="purple"
        />
        <FilterTab
          label="Automation"
          count={autoCount}
          active={filter === "Automation"}
          onClick={() => setFilter("Automation")}
          color="emerald"
        />
      </div>

      {/* Project Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-fp-300 transition-all"
          >
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  project.category === "AI"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {project.category}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  project.status === "Production" || project.status === "Live"
                    ? "bg-green-100 text-green-700"
                    : project.status === "Prototype (In Use)"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {project.status}
              </span>
              {project.hasWebUi && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-fp-100 text-fp-700">
                  Web UI
                </span>
              )}
            </div>

            {/* Name + Tagline */}
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-fp-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              {project.tagline}
            </p>

            {/* Metrics */}
            {project.hoursSavedPerMonth && (
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                  ⏱️ {project.hoursSavedPerMonth}h/mo
                </span>
                {project.costSavedPerMonth && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-fp-50 text-fp-700 rounded-full text-xs font-semibold">
                    💰 ${project.costSavedPerMonth.toLocaleString()}/mo
                  </span>
                )}
              </div>
            )}

            {/* Tech preview */}
            <div className="flex flex-wrap gap-1">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-1 bg-slate-50 rounded-md text-slate-500"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-xs px-2 py-1 bg-slate-50 rounded-md text-slate-400">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color?: "purple" | "emerald";
}) {
  const activeClasses = active
    ? "bg-slate-900 text-white"
    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeClasses}`}
    >
      {color === "purple" && <span className="w-2 h-2 rounded-full bg-purple-500" />}
      {color === "emerald" && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
      {label}
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
