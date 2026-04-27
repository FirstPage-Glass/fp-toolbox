import Link from "next/link";
import { fetchAllTools, type NocoDBTool } from "@/lib/nocodb";

export default async function HomePage() {
  const tools = await fetchAllTools();

  // Real metrics from NocoDB
  const totalHours = tools.reduce(
    (sum, t) => sum + (t.hours_saved_per_month || 0),
    0
  );
  const totalCost = tools.reduce(
    (sum, t) => sum + (t.cost_saved_per_month || 0),
    0
  );
  const activeCount = tools.filter((t) =>
    ["Active", "Live", "Production"].includes(t.status)
  ).length;

  // Teams served (from serve MultiSelect)
  const teamCoverage: Record<string, { count: number; tools: NocoDBTool[] }> =
    {};
  tools.forEach((tool) => {
    (tool.serve || []).forEach((team) => {
      if (!teamCoverage[team]) teamCoverage[team] = { count: 0, tools: [] };
      teamCoverage[team].count++;
      teamCoverage[team].tools.push(tool);
    });
  });
  const teamCount = Object.keys(teamCoverage).length;

  // Status breakdown
  const statusOrder = ["Active", "Building", "Prototype", "Refactoring", "Planned"];
  const statusCounts: Record<string, number> = {};
  statusOrder.forEach((s) => (statusCounts[s] = 0));
  tools.forEach((t) => {
    if (statusCounts[t.status] !== undefined) statusCounts[t.status]++;
    else statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
  });

  // Top 5 by cost saved
  const topTools = [...tools]
    .sort(
      (a, b) =>
        (b.cost_saved_per_month || 0) - (a.cost_saved_per_month || 0)
    )
    .slice(0, 5);

  // Tools by category
  const categoryCounts: Record<string, number> = {};
  tools.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  return (
    <div className="space-y-16">
      {/* HERO — Live NocoDB Metrics */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-fp-900 text-white p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fp-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {tools.length} Systems · {activeCount} Active
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            HK AI & Automation
            <span className="text-fp-300"> Portfolio</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-6">
            Real systems running 24/7. Every number below is live from NocoDB —
            not estimates.
          </p>
          <div className="mb-8">
            <Link
              href="/presentation"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-xl text-sm font-medium transition-colors"
            >
              <span>▶️</span> Present Mode — Jobs Done Deck
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              value={`${totalHours}h`}
              label="Saved Every Month"
              accent="text-fp-300"
            />
            <MetricCard
              value={`HK$${totalCost.toLocaleString()}`}
              label="Monthly Cost Reduction"
              accent="text-green-300"
            />
            <MetricCard
              value={`${activeCount}/${tools.length}`}
              label="Active / Total"
              accent="text-emerald-300"
            />
            <MetricCard
              value={`${teamCount}`}
              label="Teams Served"
              accent="text-violet-300"
            />
          </div>
        </div>
      </section>

      {/* STATUS BREAKDOWN + TEAM COVERAGE */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Portfolio at a Glance
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              System Status
            </h3>
            <div className="space-y-4">
              {statusOrder.map((status) => {
                const count = statusCounts[status] || 0;
                const pct = tools.length > 0 ? (count / tools.length) * 100 : 0;
                const color =
                  status === "Active"
                    ? "bg-green-500"
                    : status === "Building"
                    ? "bg-fp-500"
                    : status === "Prototype"
                    ? "bg-amber-500"
                    : status === "Planned"
                    ? "bg-blue-500"
                    : "bg-violet-500";
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700">
                        {status}
                      </span>
                      <span className="text-slate-500">
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Coverage */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Team Coverage
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(teamCoverage)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([team, data]) => (
                  <Link
                    key={team}
                    href="/systems"
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-fp-50 hover:border-fp-200 border border-transparent transition-all text-center"
                  >
                    <span className="text-2xl mb-2">
                      {teamEmoji(team)}
                    </span>
                    <span className="font-medium text-slate-800 text-sm">
                      {team}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {data.count} tool{data.count > 1 ? "s" : ""}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOP PERFORMERS */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Top Impact Systems
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">
                    System
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-700">
                    Hours/mo
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-700">
                    HK$/mo
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">
                    Serves
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topTools.map((tool) => (
                  <tr
                    key={tool.slug}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/projects/${tool.slug}`}
                        className="font-semibold text-slate-900 hover:text-fp-600"
                      >
                        {tool.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {tool.tagline || tool.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tool.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {tool.hours_saved_per_month || 0}h
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-green-700">
                      HK$
                      {(tool.cost_saved_per_month || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(tool.serve || []).slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-xs px-1.5 py-0.5 bg-fp-50 text-fp-700 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* BEFORE vs AFTER */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          What We Changed
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❌</span>
              <h3 className="text-lg font-bold text-red-800">
                Before Automation
              </h3>
            </div>
            <ul className="space-y-3 text-red-700 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Manual invoice sorting</strong> every Monday — Rita
                  spending hours in Excel
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Copy-paste blog uploads</strong> to 180+ WordPress
                  sites by a 2-person team
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Proposals written from scratch</strong> — inconsistent,
                  30+ min each
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Taobao writers + manual uploads</strong> for 900+
                  PBN backlinks/month
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>No central tool directory</strong> — everyone asks
                  Glass for links
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>FAQ sections written manually</strong> — writers crafting Q&amp;A from scratch for every page
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>SEO content briefs done ad hoc</strong> — AMs googling keywords and guessing structure
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Technical docs written from scratch</strong> — inconsistent format, hours per client
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <h3 className="text-lg font-bold text-green-800">
                After AI & Automation
              </h3>
            </div>
            <ul className="space-y-3 text-green-700 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Auto email reports</strong> sent every Monday at noon
                  — zero manual work
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>One Google Doc URL</strong> → auto-published to
                  WordPress/Shopify — 2 min
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>AI proposal assistant</strong> — structured output in
                  5 min, consistent every time
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>900+ backlinks automated</strong> — no writers, no
                  manual logins across 180+ sites
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Self-service portal</strong> — every tool documented,
                  searchable, accessible
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>AI FAQ schema generator</strong> — structured Q&amp;A with JSON-LD markup in seconds
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Content briefs auto-generated</strong> — keyword research, outline, and SEO specs in one click
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Technical docs AI-generated</strong> — consistent format, client-ready in minutes not hours
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* OUR SYSTEMS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Our Systems</h2>
          <Link
            href="/systems"
            className="text-sm font-medium text-fp-500 hover:text-fp-700"
          >
            View all {tools.length} systems →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools
            .filter((t) => t.slug)
            .slice(0, 6)
            .map((tool) => (
              <Link
                key={tool.slug}
                href={`/projects/${tool.slug}`}
                className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-fp-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {tool.category}
                    </span>
                    <StatusBadge status={tool.status} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                  {tool.tagline || tool.description}
                </p>

                {tool.cost_saved_per_month ? (
                  <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    <span>💰</span>
                    {tool.hours_saved_per_month}h saved · HK$
                    {tool.cost_saved_per_month.toLocaleString()}/mo
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-1">
                  {parseTech(tool.tech_stack)
                    .slice(0, 4)
                    .map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-slate-50 rounded text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  {parseTech(tool.tech_stack).length > 4 && (
                    <span className="text-xs px-2 py-1 bg-slate-50 rounded text-slate-400">
                      +{parseTech(tool.tech_stack).length - 4}
                    </span>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
      <div className={`text-3xl font-bold ${accent}`}>{value}</div>
      <div className="text-xs text-slate-300 mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Live: "bg-green-100 text-green-700",
    Production: "bg-green-100 text-green-700",
    Building: "bg-fp-100 text-fp-700",
    Prototype: "bg-amber-100 text-amber-700",
    Refactoring: "bg-violet-100 text-violet-700",
    Planned: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function teamEmoji(team: string): string {
  const map: Record<string, string> = {
    Finance: "💰",
    AMs: "👤",
    Clients: "🤝",
    "SEO Tech": "🔍",
    Content: "📝",
    Sales: "📈",
    Everyone: "🌍",
  };
  return map[team] || "🔧";
}

function parseTech(ts?: string | null): string[] {
  if (!ts) return [];
  return ts
    .split(/[+&,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}
