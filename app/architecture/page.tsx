import Link from "next/link";
import { integrations, projects, getTotalHoursSaved, getTotalCostSaved } from "@/lib/data";

export default function ArchitecturePage() {
  const totalHours = getTotalHoursSaved();
  const totalCost = getTotalCostSaved();
  const totalUptime = projects
    .filter((p) => p.uptime)
    .map((p) => parseFloat(p.uptime!.replace("%", "")))
    .reduce((a, b, _, arr) => a + b / arr.length, 0)
    .toFixed(1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Architecture & Integrations
          </h1>
          <p className="text-slate-600 mt-1">
            How all systems connect — one unified, maintainable stack
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Overview
        </Link>
      </div>

      {/* Stack Philosophy */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-xl p-8 text-white">
        <h2 className="text-xl font-bold mb-3">HK Stack Philosophy</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold text-blue-300 mb-1">Open Source First</div>
            <p className="text-slate-300">
              n8n, Python, FastAPI, NocoDB, SvelteKit. No vendor lock-in. No surprise licensing fees.
            </p>
          </div>
          <div>
            <div className="font-semibold text-blue-300 mb-1">API Gateway Pattern</div>
            <p className="text-slate-300">
              OpenRouter routes to Claude, GPT, Gemini. One key, multiple models. Swap providers in minutes.
            </p>
          </div>
          <div>
            <div className="font-semibold text-blue-300 mb-1">Database of Truth</div>
            <p className="text-slate-300">
              NocoDB centralizes all pipeline data. Every system reads from and writes to one source.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-3xl font-bold text-blue-600">{integrations.length}</div>
          <div className="text-sm text-slate-500">Core Integrations</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-3xl font-bold text-violet-600">{projects.length}</div>
          <div className="text-sm text-slate-500">Active Systems</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-3xl font-bold text-emerald-600">{totalUptime}%</div>
          <div className="text-sm text-slate-500">Avg. Uptime</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-3xl font-bold text-green-600">${totalCost.toLocaleString()}</div>
          <div className="text-sm text-slate-500">Monthly Value</div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((int) => (
          <div
            key={int.name}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {int.name}
              </h3>
              <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600 font-medium">
                {int.type}
              </span>
            </div>
            <p className="text-sm text-slate-500">{int.usedBy.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* Scale Highlights */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Scale Highlights</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">180+</div>
            <div className="text-sm text-slate-600">PBN Sites Managed</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">900+</div>
            <div className="text-sm text-slate-600">Backlinks/Month</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">3</div>
            <div className="text-sm text-slate-600">CMS Platforms</div>
          </div>
        </div>
      </div>

      {/* Production Standards */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Production Standards</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <span className="text-xl">✅</span>
            <div>
              <div className="font-semibold text-green-800">Error Handling</div>
              <div className="text-sm text-green-700">Every pipeline has retry logic, fallback paths, and alerting.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <span className="text-xl">✅</span>
            <div>
              <div className="font-semibold text-green-800">Version Control</div>
              <div className="text-sm text-green-700">All code in GitHub. Every change is tracked and reversible.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <span className="text-xl">✅</span>
            <div>
              <div className="font-semibold text-green-800">Tested</div>
              <div className="text-sm text-green-700">pytest coverage on Python pipelines. Production data never touched in tests.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <span className="text-xl">✅</span>
            <div>
              <div className="font-semibold text-green-800">Documented</div>
              <div className="text-sm text-green-700">Every system has README, flow diagrams, and runbooks.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
