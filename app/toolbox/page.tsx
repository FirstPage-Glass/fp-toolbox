import Link from "next/link";
import { tools } from "@/lib/registry";

export default function ToolboxPage() {
  const active = tools.filter((t) => t.status === "active");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Toolbox</h1>
        <p className="mt-2 text-slate-600">
          Sales weapons built into the platform. Pick a tool — each one generates a client-ready deliverable.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.externalLink ?? `/tools/${tool.slug}`}
            target={tool.externalLink ? "_blank" : undefined}
            className="group rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-fp-300 transition-all"
          >
            <div className="text-3xl">{tool.icon}</div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-fp-700">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-fp-100 px-2.5 py-0.5 text-xs font-medium text-fp-700">
                {tool.category}
              </span>
              <span className="text-xs text-slate-400">{tool.owner}</span>
            </div>
          </Link>
        ))}
      </div>

      {active.length === 0 && (
        <p className="text-slate-500">No tools registered yet.</p>
      )}

      <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">External tools</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <a
              href="https://faq-generator.firstpage.com.hk"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-fp-700 hover:underline"
            >
              FAQ Schema Generator →
            </a>
            <span className="ml-2 text-xs text-slate-400">standalone, linked</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
