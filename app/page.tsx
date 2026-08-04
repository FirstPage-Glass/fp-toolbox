import Link from "next/link";
import { getUsageStats } from "@/lib/usage";
import { tools } from "@/lib/registry";

export default async function HomePage() {
  const stats = await getUsageStats();
  const activeTools = tools.filter((t) => t.status === "active");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Toolbox Overview</h1>
        <p className="mt-2 text-slate-600">
          Real usage metrics from the toolbox — every run is logged, no hand-claimed numbers.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Total runs</div>
          <div className="mt-1 text-3xl font-extrabold text-slate-900">{stats.totalRuns}</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Active users</div>
          <div className="mt-1 text-3xl font-extrabold text-slate-900">{stats.activeUsers}</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">LLM cost (US$)</div>
          <div className="mt-1 text-3xl font-extrabold text-slate-900">{stats.totalCostUsd.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Usage by tool</h2>
          {stats.perTool.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No usage yet — run a tool to see data here.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="pb-2">Tool</th>
                  <th className="pb-2 text-right">Runs</th>
                  <th className="pb-2 text-right">Cost (US$)</th>
                </tr>
              </thead>
              <tbody>
                {stats.perTool.map((row) => (
                  <tr key={row.tool_slug} className="border-b border-slate-100">
                    <td className="py-2">{row.tool_slug}</td>
                    <td className="py-2 text-right">{row.runs}</td>
                    <td className="py-2 text-right">{row.cost_usd.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Tools</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {activeTools.map((t) => (
              <li key={t.slug}>
                <Link href={`/tools/${t.slug}`} className="text-fp-700 hover:underline">
                  {t.icon} {t.name}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/toolbox" className="text-sm text-fp-700 hover:underline">
                Open the toolbox →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
