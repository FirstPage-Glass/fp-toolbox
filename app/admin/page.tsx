import { getSpamReport } from "@/lib/hubspot";
import { cached } from "@/lib/cache";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Memoized 10 min (DB-backed) — the admin page no longer re-hits HubSpot on
  // every refresh.
  const report = await cached("spam-report-admin:30", () => getSpamReport(30), 10 * 60 * 1000);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        title="Lead Quality Report"
        description="Last 30 days of HubSpot contacts — how much of the inbound is real, and where the junk comes from."
      />

      <div className="grid gap-5 sm:grid-cols-4">
        <StatCard label="Total contacts" value={String(report.total)} sub="last 30 days" />
        <StatCard label="Real leads" value={String(report.good)} sub="pass domain-match + reputation filter" />
        <StatCard label="Spam" value={String(report.spam)} sub="blocked by the filter" />
        <StatCard label="Spam rate" value={`${report.spamRatePct}%`} sub="of all inbound" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
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
        </Card>

        <Card>
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
        </Card>
      </div>
    </div>
  );
}