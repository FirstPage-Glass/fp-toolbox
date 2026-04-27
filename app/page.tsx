import Link from "next/link";
import {
  projects,
  teamImpact,
  integrations,
  getTotalHoursSaved,
  getTotalCostSaved,
  getProductionCount,
} from "@/lib/data";

export default function HomePage() {
  const totalHours = getTotalHoursSaved();
  const totalCost = getTotalCostSaved();
  const prodCount = getProductionCount();

  return (
    <div className="space-y-16">
      {/* HERO — Boss Sees Value in 3 Seconds */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-fp-900 text-white p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fp-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative">
          {/* Leadership Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Led by Glass Chan — HK AI & Automation Team
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            HK Team Delivers
            <span className="text-fp-300"> Production-Ready AI</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            Not demos. Not hype. Real systems running 24/7 that save hours,
            cut costs, and scale across SEO, Finance, Sales, and CX.
          </p>

          {/* The Numbers That Matter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              value={`${totalHours}h`}
              label="Saved Every Month"
              accent="text-fp-300"
            />
            <MetricCard
              value={`$${totalCost.toLocaleString()}`}
              label="Monthly Cost Reduction"
              accent="text-green-300"
            />
            <MetricCard
              value={`${prodCount}/${projects.length}`}
              label="In Production"
              accent="text-emerald-300"
            />
            <MetricCard
              value="4"
              label="Teams Served"
              accent="text-violet-300"
            />
          </div>
        </div>
      </section>

      {/* BEFORE vs AFTER — Company Level */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          What We Changed
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❌</span>
              <h3 className="text-lg font-bold text-red-800">
                Before HK AI & Automation
              </h3>
            </div>
            <ul className="space-y-3 text-red-700 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>180+ PBN sites</strong> managed manually — 20 min per
                  backlink, inconsistent quality
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>400+ invoices</strong> reviewed via Excel email tennis
                  — no tracking, no visibility
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Proposals written from scratch</strong> — 2-3 hours
                  each, missed red flags, inconsistent
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Blog posts copy-pasted</strong> to 3 CMS platforms — 30
                  min each, formatting errors
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Monday mornings wasted</strong> on manual overdue
                  invoice sorting — hours of Excel work
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <h3 className="text-lg font-bold text-green-800">
                After HK AI & Automation
              </h3>
            </div>
            <ul className="space-y-3 text-green-700 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>900+ backlinks/month</strong> auto-generated and
                  deployed — 5 min setup per batch
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Full-stack web portal</strong> with PIN auth — AMs
                  review online, real-time dashboard
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>AI proposal coaching</strong> in 60 seconds —
                  structured, consistent, no missed red flags
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>One Google Doc URL</strong> → auto-published to
                  WordPress/Wix/Shopify — 2 minutes
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Color-coded HTML emails</strong> auto-sent every
                  Monday at 12pm — zero manual work
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY HK BEATS AUS / OTHERS */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Why HK Systems Win
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-6">
              <div className="w-10 h-10 rounded-lg bg-fp-50 flex items-center justify-center mb-4">
                <span className="text-xl">🛡️</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Production-First
              </h3>
              <p className="text-sm text-slate-600">
                Every system has error handling, retry logic, monitoring, and
                alerts. They don't break when volume spikes.
              </p>
            </div>
            <div className="p-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-4">
                <span className="text-xl">🔧</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Built In-House
              </h3>
              <p className="text-sm text-slate-600">
                Custom n8n workflows, Python pipelines, and FastAPI apps. We
                own the stack. No vendor lock-in, no surprise bills.
              </p>
            </div>
            <div className="p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                <span className="text-xl">📈</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Measurable ROI
              </h3>
              <p className="text-sm text-slate-600">
                Every pipeline tracks hours saved, cost reduction, and output
                volume. No vanity metrics — just business results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM IMPACT */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Impact by Team
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(teamImpact).map(([teamName, team]) => (
            <div
              key={teamName}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {teamName}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {team.monthlyVolume}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {team.keyMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-slate-50 rounded-lg p-3"
                  >
                    <div className="text-xs text-slate-500">
                      {metric.label}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {team.projects.map((slug) => {
                  const project = projects.find((p) => p.slug === slug);
                  return project ? (
                    <Link
                      key={slug}
                      href={`/projects/${slug}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-fp-50 text-fp-700 hover:bg-fp-100 transition-colors"
                    >
                      {project.name}
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          ))}
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
            View all {projects.length} systems →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Architecture & Integrations
          </h2>
          <Link
            href="/architecture"
            className="text-sm font-medium text-fp-500 hover:text-fp-700"
          >
            View details →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid md:grid-cols-3 gap-4">
            {integrations.map((int) => (
              <div
                key={int.name}
                className="border border-slate-100 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">
                    {int.name}
                  </span>
                  <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                    {int.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {int.usedBy.join(", ")}
                </div>
              </div>
            ))}
          </div>
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

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-fp-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              project.category === "AI"
                ? "bg-purple-100 text-purple-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {project.category}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              project.status === "Production" || project.status === "Live"
                ? "bg-green-100 text-green-700"
                : project.status === "Prototype (In Use)"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {project.status}
          </span>
        </div>
        {project.hasWebUi && (
          <span className="text-xs text-slate-400">Web UI</span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {project.name}
      </h3>
      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* Business impact badge */}
      {project.hoursSavedPerMonth && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
          <span>💰</span>
          {project.hoursSavedPerMonth}h saved/mo · $
          {project.costSavedPerMonth?.toLocaleString()}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-1 bg-slate-50 rounded text-slate-600"
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 4 && (
          <span className="text-xs px-2 py-1 bg-slate-50 rounded text-slate-400">
            +{project.techStack.length - 4}
          </span>
        )}
      </div>
    </Link>
  );
}
