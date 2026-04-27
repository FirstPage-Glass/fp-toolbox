import Link from "next/link";
import { getAiProjects } from "@/lib/data";

export default function AiProjectsPage() {
  const projects = getAiProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Projects</h1>
          <p className="text-slate-600 mt-1">
            AI-powered tools and pipelines delivering measurable business impact
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-fp-500 hover:text-fp-700"
        >
          ← Back to Overview
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-fp-300 transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                AI
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  project.status === "Production" || project.status === "Live"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {project.status}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {project.name}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {project.description}
            </p>

            {project.hoursSavedPerMonth && (
              <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <span>💰</span>
                {project.hoursSavedPerMonth}h saved/mo · HK$
                {project.costSavedPerMonth?.toLocaleString()}
              </div>
            )}

            <div className="text-sm text-slate-500">
              <span className="font-medium">AI Models: </span>
              {project.aiModels.join(", ") || "None"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
