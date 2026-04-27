import Link from "next/link";
import { getProjectBySlug, projects } from "@/lib/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <Link
          href={
            project.category === "AI"
              ? "/ai-projects"
              : "/automation-projects"
          }
          className="hover:text-blue-600"
        >
          {project.category} Projects
        </Link>
        <span>/</span>
        <span className="text-slate-900">{project.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              project.category === "AI"
                ? "bg-purple-100 text-purple-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {project.category}
          </span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
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
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              Web UI
            </span>
          )}
          {project.uptime && (
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {project.uptime} Uptime
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          {project.name}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              What It Does
            </h3>
            <p className="text-slate-700">{project.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Business Impact
            </h3>
            <p className="text-slate-700">{project.impact}</p>
          </div>
        </div>

        {/* Business Metrics Bar */}
        {(project.hoursSavedPerMonth || project.volumePerMonth) && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.hoursSavedPerMonth && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-700">
                    {project.hoursSavedPerMonth}h
                  </div>
                  <div className="text-xs text-green-600">Saved/Month</div>
                </div>
              )}
              {project.costSavedPerMonth && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-700">
                    ${project.costSavedPerMonth.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600">Value/Month</div>
                </div>
              )}
              {project.volumePerMonth && (
                <div className="text-center p-3 bg-violet-50 rounded-lg">
                  <div className="text-xl font-bold text-violet-700">
                    {project.volumePerMonth}
                  </div>
                  <div className="text-xs text-violet-600">Volume</div>
                </div>
              )}
              {project.since && (
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-xl font-bold text-slate-700">
                    {project.since}
                  </div>
                  <div className="text-xs text-slate-600">Running Since</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              🌐 Live URL →
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
            >
              📁 GitHub Repo →
            </a>
          )}
        </div>
      </div>

      {/* Tech Stack & Integrations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            🛠️ Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            🔗 Integrations
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.integrations.map((integration) => (
              <span
                key={integration}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {integration}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Before / After */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-6">
          <h3 className="text-lg font-bold text-red-800 mb-3">❌ Before</h3>
          <p className="text-red-700">{project.before}</p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 rounded-r-xl p-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">✅ After</h3>
          <p className="text-green-700">{project.after}</p>
        </div>
      </div>

      {/* AI Models */}
      {project.aiModels.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            🤖 AI Models
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.aiModels.map((model) => (
              <span
                key={model}
                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
              >
                {model}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline Flow */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          🔀 Pipeline Flow
        </h2>
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-700 overflow-x-auto">
          {project.flow}
        </div>
      </div>
    </div>
  );
}
