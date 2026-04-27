import Link from "next/link";
import { fetchAllTools, type NocoDBTool } from "@/lib/nocodb";

// Technology category mapping
const techCategories: Record<string, string[]> = {
  "AI / LLM": [
    "Claude",
    "Gemini",
    "OpenRouter",
    "LLMs",
    "Hermes Agent",
    "AI",
    "minimax-m2",
    "haiku",
    "sonnet",
    "jina.ai",
  ],
  Automation: ["n8n", "Agentic Flow"],
  "Data / Storage": [
    "NocoDB",
    "Google Sheets",
    "Google Docs",
    "SQLite",
    "Google Drive",
  ],
  "CMS / APIs": [
    "WordPress REST API",
    "WordPress API",
    "Shopify",
    "Wix",
    "CMS",
  ],
  "Web / Frontend": [
    "Next.js",
    "Svelte",
    "SvelteKit",
    "React",
    "TypeScript",
    "Tailwind",
  ],
  "Email / Comms": [
    "Resend",
    "Resend Email API",
    "Email",
  ],
  "Scraping / Search": [
    "Serper API",
    "Serper",
    "Firecrawl",
    "Jina Reader",
    "jina.ai",
  ],
  "Cloud / Infra": [
    "Cloudflare",
    "Docker",
    "FastAPI",
    "Express",
    "Python",
    "JavaScript",
  ],
};

function categorizeTech(tech: string): string {
  for (const [category, techs] of Object.entries(techCategories)) {
    if (
      techs.some(
        (t) =>
          tech.toLowerCase().includes(t.toLowerCase()) ||
          t.toLowerCase().includes(tech.toLowerCase())
      )
    ) {
      return category;
    }
  }
  return "Other";
}

export default async function StackPage() {
  const tools = await fetchAllTools();

  // Parse all tech stacks
  const techMap = new Map<
    string,
    { count: number; tools: NocoDBTool[]; category: string }
  >();

  tools.forEach((tool) => {
    const techs = tool.tech_stack
      ? tool.tech_stack
          .split(/[+&,]/)
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    techs.forEach((tech) => {
      const existing = techMap.get(tech);
      if (existing) {
        existing.count++;
        if (!existing.tools.find((t) => t.slug === tool.slug)) {
          existing.tools.push(tool);
        }
      } else {
        techMap.set(tech, {
          count: 1,
          tools: [tool],
          category: categorizeTech(tech),
        });
      }
    });
  });

  // Group by category
  const byCategory: Record<string, { tech: string; count: number; tools: NocoDBTool[] }[]> = {};
  techMap.forEach((data, tech) => {
    if (!byCategory[data.category]) byCategory[data.category] = [];
    byCategory[data.category].push({ tech, count: data.count, tools: data.tools });
  });

  // Sort categories and techs within
  const categoryOrder = [
    "AI / LLM",
    "Automation",
    "Data / Storage",
    "CMS / APIs",
    "Web / Frontend",
    "Email / Comms",
    "Scraping / Search",
    "Cloud / Infra",
    "Other",
  ];
  const sortedCategories = categoryOrder.filter((c) => byCategory[c]);
  sortedCategories.forEach((cat) => {
    byCategory[cat].sort((a, b) => b.count - a.count);
  });

  const totalTechs = techMap.size;
  const totalTools = tools.length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tech Stack</h1>
          <p className="text-slate-600 mt-1 max-w-xl">
            Every technology used across {totalTools} systems. Aggregated live
            from NocoDB — see which tools depend on what.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-fp-500 hover:text-fp-700"
        >
          ← Back to Overview
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-3xl font-bold text-fp-500">{totalTechs}</div>
          <div className="text-sm text-slate-500">Technologies</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-3xl font-bold text-violet-600">{totalTools}</div>
          <div className="text-sm text-slate-500">Systems</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-3xl font-bold text-emerald-600">
            {sortedCategories.length}
          </div>
          <div className="text-sm text-slate-500">Categories</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-3xl font-bold text-green-600">
            {Math.round(totalTechs / totalTools)}
          </div>
          <div className="text-sm text-slate-500">Avg Techs / Tool</div>
        </div>
      </div>

      {/* Tech Stack by Category */}
      <div className="space-y-6">
        {sortedCategories.map((category) => (
          <div
            key={category}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">{category}</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {byCategory[category].map(({ tech, count, tools: usedBy }) => (
                  <div
                    key={tech}
                    className="border border-slate-100 rounded-lg p-4 hover:border-fp-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">
                        {tech}
                      </span>
                      <span className="text-xs px-2 py-1 bg-fp-50 text-fp-700 rounded-full font-medium">
                        {count} tool{count > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {usedBy.slice(0, 4).map((t) => (
                        <Link
                          key={t.slug}
                          href={`/projects/${t.slug}`}
                          className="text-xs px-2 py-0.5 bg-slate-50 text-slate-600 rounded hover:bg-fp-50 hover:text-fp-700 transition-colors"
                        >
                          {t.name}
                        </Link>
                      ))}
                      {usedBy.length > 4 && (
                        <span className="text-xs px-2 py-0.5 bg-slate-50 text-slate-400 rounded">
                          +{usedBy.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stack Philosophy — kept but tightened */}
      <div className="bg-gradient-to-r from-slate-900 to-fp-900 rounded-xl p-8 text-white">
        <h2 className="text-xl font-bold mb-4">How We Choose Tech</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold text-fp-300 mb-1">
              No Vendor Lock-in
            </div>
            <p className="text-slate-300">
              Open-source first: n8n, NocoDB, Next.js. If a service shuts down
              or raises prices, we migrate in days not months.
            </p>
          </div>
          <div>
            <div className="font-semibold text-fp-300 mb-1">
              One AI Gateway
            </div>
            <p className="text-slate-300">
              OpenRouter routes to Claude, GPT, Gemini. One API key, swap
              models instantly. No single LLM dependency.
            </p>
          </div>
          <div>
            <div className="font-semibold text-fp-300 mb-1">
              Single Source of Truth
            </div>
            <p className="text-slate-300">
              NocoDB is the hub. Every system reads from and writes to one
              database. No data silos, no reconciliation headaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
