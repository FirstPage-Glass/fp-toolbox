import { getSpamReport } from "@/lib/hubspot";
import { cached } from "@/lib/cache";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Memoized 10 min (DB-backed) — the admin page no longer re-hits HubSpot on
  // every refresh.
  const report = await cached("spam-report-admin:30", () => getSpamReport(30), 10 * 60 * 1000);

  const kpi = (label: string, value: string, sub: string) => (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-extrabold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{sub}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Lead Quality Report</h1>
        <p className="mt-2 text-slate-600">
          Last 30 days of HubSpot contacts — how much of the inbound is real, and where the junk comes from.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        {kpi("Total contacts", String(report.total), "last 30 days")}
        {kpi("Real leads", String(report.good), "pass domain-match + reputation filter")}
        {kpi("Spam", String(report.spam), "blocked by the filter")}
        {kpi("Spam rate", `${report.spamRatePct}%`, "of all inbound")}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Why contacts are spam</h2>
          {report.categories.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No spam in the window — clean!</p>
          ) : (
            <div className="mt-4 space-y-3">
              {report.categories.map((c) => {
                const pct = report.spam ? Math.round((c.count / report.spam) * 100) : 0;
                return (
                  <div key={c.reason}>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700">{c.reason}</span>
                      <span className="text-slate-500">{c.count} · {pct}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-red-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Worst source domains</h2>
          <p className="mt-1 text-xs text-slate-400">
            Email domains to consider blocking in HubSpot (settings → suppression).
          </p>
          {report.topSources.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No spam sources found.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="pb-2">Domain</th>
                  <th className="pb-2 text-right">Contacts</th>
                </tr>
              </thead>
              <tbody>
                {report.topSources.map((s) => (
                  <tr key={s.domain} className="border-b border-slate-100">
                    <td className="py-2 font-mono text-xs">{s.domain}</td>
                    <td className="py-2 text-right">{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}