import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import { getUptimeStats } from "@/lib/uptime";
import MetricCard from "@/components/dashboard/MetricCard";

// ponytail: render on every request — the uptime panel must reflect the 5-min
// checker live, and external API calls are all memoized for 1h anyway.
export const dynamic = "force-dynamic";
import UnconfiguredNotice from "@/components/dashboard/UnconfiguredNotice";
import LeadTrendChart from "@/components/dashboard/LeadTrendChart";
import LeadScoreChart from "@/components/dashboard/LeadScoreChart";
import KeywordBarChart from "@/components/dashboard/KeywordBarChart";
import TrafficTrendChart from "@/components/dashboard/TrafficTrendChart";
import SearchPerformanceTable from "@/components/dashboard/SearchPerformanceTable";

function psiColor(score: number | null): string {
  if (score === null) return "text-slate-400";
  if (score >= 90) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
}

/** HK-local time for the uptime panel, e.g. "10/08 14:35". */
function fmtTime(d: Date): string {
  return d.toLocaleString("en-GB", {
    timeZone: "Asia/Hong_Kong",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function HomePage() {
  const d = await getDashboardData();
  const uptime = await getUptimeStats(d.targets.url);

  const totalLeads = d.hubspot.spam?.good ?? d.hubspot.leads.length;
  const spamRate = d.hubspot.spam?.spamRatePct ?? null;
  const psiScore = d.psi.result?.performanceScore ?? null;

  const spamSources = (d.hubspot.spam?.topSources ?? []).slice(0, 5);
  const donutData = d.hubspot.spam
    ? [
        { name: "Good leads", value: d.hubspot.spam.good },
        { name: "Spam", value: d.hubspot.spam.spam },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">FirstPage Division Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Live metrics from our HubSpot pipeline, site performance and search presence — no
          hand-claimed numbers.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Leads (30d)"
          value={totalLeads}
          sub={d.hubspot.configured ? "non-spam, from HubSpot" : "HubSpot not configured"}
          icon="📥"
        />
        <MetricCard
          label="Spam rate"
          value={spamRate !== null ? `${spamRate.toFixed(1)}%` : "—"}
          sub={spamRate !== null ? "of contacts in window" : "needs HUBSPOT_SERVICE_KEY"}
          icon="🛡️"
        />
        <MetricCard
          label="PageSpeed"
          value={psiScore !== null ? `${psiScore}` : "—"}
          sub={d.psi.result ? d.psi.result.url.replace(/^https?:\/\//, "") : "checking…"}
          icon="⚡"
        />
        <MetricCard
          label="Keywords tracked"
          value={d.ahrefs.result ? d.ahrefs.result.keywords.length : "—"}
          sub={d.ahrefs.configured ? `${d.targets.domain} (HK)` : "needs AHREFS_API_KEY"}
          icon="🔍"
        />
      </div>

      {/* Site status — uptime checker */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Site status</h2>
            <p className="mt-1 text-sm text-slate-500">
              Checked every 5 minutes — {d.targets.url}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                  uptime.lastCheck?.ok
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    uptime.lastCheck?.ok ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  aria-hidden
                />
                {uptime.lastCheck ? (uptime.lastCheck.ok ? "Online" : "Offline") : "No checks yet"}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {uptime.lastCheck ? (
                  <>
                    {fmtTime(uptime.lastCheck.checkedAt)} ·{" "}
                    {uptime.lastCheck.statusCode ?? "no response"} ·{" "}
                    {uptime.lastCheck.latencyMs}ms
                  </>
                ) : (
                  "first check runs on server start"
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-slate-900">
                {uptime.uptimePct !== null ? `${uptime.uptimePct}%` : "—"}
              </div>
              <div className="text-sm text-slate-500">uptime (24h)</div>
            </div>
          </div>
        </div>
        {uptime.recent.length > 0 ? (
          <div className="mt-4 flex items-end gap-1" title="Last 12 checks, oldest → newest">
            {uptime.recent
              .slice()
              .reverse()
              .map((c, i) => (
                <span
                  key={i}
                  title={`${fmtTime(c.checkedAt)} — ${c.ok ? "up" : "down"} (${c.statusCode ?? "no response"}, ${c.latencyMs}ms)`}
                  className={`h-6 w-2.5 rounded-sm ${c.ok ? "bg-emerald-400" : "bg-rose-400"}`}
                />
              ))}
          </div>
        ) : null}
      </div>

      {/* HubSpot leads */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">HubSpot leads</h2>
        {!d.hubspot.configured ? (
          <div className="mt-4">
            <UnconfiguredNotice envVar="HUBSPOT_SERVICE_KEY">
              Connect HubSpot to see lead volume, spam rate and source breakdown.
            </UnconfiguredNotice>
          </div>
        ) : (
          <>
            {d.hubspot.error ? (
              <p className="mt-3 text-sm text-rose-600">Couldn&apos;t load leads: {d.hubspot.error}</p>
            ) : null}
            <div className="mt-4 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="text-sm text-slate-500">Daily lead volume (last 30 days)</p>
                <LeadTrendChart data={d.hubspot.trend} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Contact quality</p>
                <LeadScoreChart data={donutData} />
                {spamSources.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-slate-700">Top spam sources</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-600">
                      {spamSources.map((s) => (
                        <li key={s.domain} className="flex justify-between">
                          <span className="truncate">{s.domain}</span>
                          <span className="ml-3 tabular-nums text-slate-500">{s.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Site analytics — GA4 (firstpage.hk) */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Site analytics</h2>
        <p className="mt-1 text-sm text-slate-500">GA4 — firstpage.hk (last 30 days)</p>
        {d.ga4.error ? (
          <p className="mt-3 text-sm text-rose-600">Couldn&apos;t load GA4: {d.ga4.error}</p>
        ) : d.ga4.totals ? (
          <>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="text-sm text-slate-500">Active users</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {d.ga4.totals.activeUsers.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="text-sm text-slate-500">Sessions</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {d.ga4.totals.sessions.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="text-sm text-slate-500">Avg users/day</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {d.ga4.trend.length
                    ? Math.round(d.ga4.totals.activeUsers / d.ga4.trend.length).toLocaleString()
                    : "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="text-sm text-slate-500">Peak day</div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900">
                  {d.ga4.trend.length
                    ? d.ga4.trend.reduce((m, t) => (t.activeUsers > m.activeUsers ? t : m)).activeUsers.toLocaleString()
                    : "—"}
                </div>
                <div className="text-xs text-slate-500">
                  {d.ga4.trend.length
                    ? d.ga4.trend.reduce((m, t) => (t.activeUsers > m.activeUsers ? t : m)).date
                    : ""}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500">Daily active users &amp; sessions</p>
              <TrafficTrendChart data={d.ga4.trend} />
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Loading GA4…</p>
        )}
      </div>

      {/* Search performance — GSC (firstpage.com.hk) */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Search performance</h2>
        <p className="mt-1 text-sm text-slate-500">
          Google Search Console — {d.gsc.siteUrl} (last 30 days)
        </p>
        {d.gsc.error ? (
          <p className="mt-3 text-sm text-rose-600">Couldn&apos;t load GSC: {d.gsc.error}</p>
        ) : d.gsc.totals ? (
          <>
            <div className="mt-4 grid gap-5 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="text-sm text-slate-500">Impressions</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {d.gsc.totals.impressions.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="text-sm text-slate-500">Clicks</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {d.gsc.totals.clicks.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="text-sm text-slate-500">Avg CTR</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {(d.gsc.totals.ctr * 100).toFixed(1)}%
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="text-sm text-slate-500">Avg position</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {d.gsc.totals.position.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500">Top organic queries</p>
              <div className="mt-2">
                <SearchPerformanceTable queries={d.gsc.queries} />
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Loading GSC…</p>
        )}
      </div>

      {/* Site performance */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Site performance</h2>
        <p className="mt-1 text-sm text-slate-500">
          PageSpeed Insights (mobile) for {d.targets.url}
        </p>
        {d.psi.error ? (
          <p className="mt-3 text-sm text-rose-600">Couldn&apos;t fetch PageSpeed: {d.psi.error}</p>
        ) : d.psi.result ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
              <div className="text-sm text-slate-500">Performance</div>
              <div className={`mt-1 text-3xl font-extrabold ${psiColor(psiScore)}`}>
                {psiScore !== null ? `${psiScore}/100` : "—"}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
              <div className="text-sm text-slate-500">Largest Contentful Paint</div>
              <div className="mt-1 text-3xl font-extrabold text-slate-900">
                {d.psi.result.lcpMs !== null ? `${(d.psi.result.lcpMs / 1000).toFixed(1)}s` : "—"}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
              <div className="text-sm text-slate-500">Cumulative Layout Shift</div>
              <div className="mt-1 text-3xl font-extrabold text-slate-900">
                {d.psi.result.cls !== null ? d.psi.result.cls.toFixed(3) : "—"}
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Checking PageSpeed…</p>
        )}
      </div>

      {/* SEO / competitors */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Search presence</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ahrefs organic keywords for {d.targets.domain} (Hong Kong)
        </p>
        {!d.ahrefs.configured ? (
          <div className="mt-4">
            <UnconfiguredNotice envVar="AHREFS_API_KEY">
              Connect Ahrefs to see which keywords we rank for.
            </UnconfiguredNotice>
          </div>
        ) : d.ahrefs.error ? (
          <p className="mt-3 text-sm text-rose-600">Couldn&apos;t fetch Ahrefs: {d.ahrefs.error}</p>
        ) : d.ahrefs.result ? (
          <div className="mt-4">
            <KeywordBarChart keywords={d.ahrefs.result.keywords} />
          </div>
        ) : null}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Data refreshes hourly. Sources: HubSpot, firstpage MCP (GA4/GSC/PSI), Ahrefs.{" "}
        {d.clients.configured && d.clients.inventory ? (
          <span className="font-medium text-slate-700">
            {d.clients.inventory.gscSites} GSC sites · {d.clients.inventory.ga4Properties} GA4
            properties under management.
          </span>
        ) : null}{" "}
        <Link href="/toolbox" className="text-fp-700 hover:underline">
          Open the toolbox →
        </Link>
      </p>
    </div>
  );
}
