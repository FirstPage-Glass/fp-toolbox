import { getUsageStats } from "@/lib/usage";
import { tools } from "@/lib/registry";

export default async function PresentationPage() {
  const stats = await getUsageStats();
  const activeTools = tools.filter((t) => t.status === "active");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-slate-900">First Page Toolbox</h1>
      <p className="mt-2 text-lg text-slate-600">Sales enablement, measured in real usage.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-fp-800 p-8 text-white">
          <div className="text-4xl font-extrabold">{stats.totalRuns}</div>
          <div className="mt-1 text-sm text-fp-100">tool runs logged</div>
        </div>
        <div className="rounded-2xl bg-fp-700 p-8 text-white">
          <div className="text-4xl font-extrabold">{stats.activeUsers}</div>
          <div className="mt-1 text-sm text-fp-100">active users</div>
        </div>
        <div className="rounded-2xl bg-fp-600 p-8 text-white">
          <div className="text-4xl font-extrabold">${stats.totalCostUsd.toFixed(2)}</div>
          <div className="mt-1 text-sm text-fp-100">LLM cost (US$)</div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Tools in production</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {activeTools.map((t) => (
            <div key={t.slug} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl">{t.icon}</div>
              <div className="mt-2 font-semibold text-slate-900">{t.name}</div>
              <div className="text-sm text-slate-600">{t.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
