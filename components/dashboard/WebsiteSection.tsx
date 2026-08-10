import MetricCard from "./MetricCard";
import UnconfiguredNotice from "./UnconfiguredNotice";
import SectionHeader from "./SectionHeader";
import AiPlanList from "./AiPlanList";
import TrafficTrendChart from "./TrafficTrendChart";
import SearchPerformanceTable from "./SearchPerformanceTable";
import KeywordBarChart from "./KeywordBarChart";
import type { DashboardData } from "@/lib/dashboard";
import type { UptimeStats } from "@/lib/uptime";
import type { Insight } from "@/lib/insights";
import type { AiPlan } from "@/lib/ai-plans";

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

/** Three-band PSI benchmark scale (poor <50 / needs work 50–89 / good ≥90). */
function PsiBand({ score }: { score: number | null }) {
  if (score === null) return null;
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="mt-3">
      <div className="relative h-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400" aria-hidden>
        <span
          className="absolute -top-1 h-4 w-1 rounded-full bg-slate-900"
          style={{ left: `calc(${pct}% - 2px)` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>poor</span>
        <span>needs work</span>
        <span>good</span>
      </div>
    </div>
  );
}

interface WebsiteSectionProps {
  d: DashboardData;
  uptime: UptimeStats;
  insights: Insight[];
  aiPlans?: AiPlan[] | null;
}

/** Website performance half of the dashboard: uptime, traffic, search, speed. */
export default function WebsiteSection({ d, uptime, insights, aiPlans }: WebsiteSectionProps) {
  const psiScore = d.psi.result?.performanceScore ?? null;

  return (
    <section id="website" className="scroll-mt-40">
      <SectionHeader
        id="website"
        accent="website"
        title="Website Performance"
        description={`Traffic, search presence and site health — ${d.targets.domain}`}
        days={d.rangeDays}
        insights={insights}
      />

      <AiPlanList plans={aiPlans} />

      {/* Site status — uptime checker */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Site status</h3>
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

      {/* KPI row */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Active users"
          value={d.ga4.totals ? d.ga4.totals.activeUsers.toLocaleString() : "—"}
          sub={d.ga4.totals ? `GA4 · last ${d.rangeDays} days` : "GA4 not loaded"}
          icon="👥"
          delta={d.deltas.ga4Users}
        />
        <MetricCard
          label="Organic clicks"
          value={d.gsc.totals ? d.gsc.totals.clicks.toLocaleString() : "—"}
          sub={d.gsc.totals ? "GSC · organic search" : "GSC not loaded"}
          icon="🖱️"
          delta={d.deltas.gscClicks}
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

      {/* Site analytics — GA4 (firstpage.hk) */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Site analytics</h3>
        <p className="mt-1 text-sm text-slate-500">GA4 — {d.ga4.propertyId} (last {d.rangeDays} days)</p>
        {d.ga4.error ? (
          <p className="mt-3 text-sm text-rose-600">Couldn&apos;t load GA4: {d.ga4.error}</p>
        ) : d.ga4.totals ? (
          <>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Active users"
                value={d.ga4.totals.activeUsers.toLocaleString()}
                icon="👥"
                delta={d.deltas.ga4Users}
              />
              <MetricCard
                label="Sessions"
                value={d.ga4.totals.sessions.toLocaleString()}
                icon="🔁"
                delta={d.deltas.ga4Sessions}
              />
              <MetricCard
                label="Avg users/day"
                value={d.ga4.trend.length
                  ? Math.round(d.ga4.totals.activeUsers / d.ga4.trend.length).toLocaleString()
                  : "—"}
              />
              <MetricCard
                label="Peak day"
                value={d.ga4.trend.length
                  ? d.ga4.trend.reduce((m, t) => (t.activeUsers > m.activeUsers ? t : m)).activeUsers.toLocaleString()
                  : "—"}
                sub={d.ga4.trend.length
                  ? d.ga4.trend.reduce((m, t) => (t.activeUsers > m.activeUsers ? t : m)).date
                  : ""}
              />
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
        <h3 className="text-lg font-semibold text-slate-900">Search performance</h3>
        <p className="mt-1 text-sm text-slate-500">
          Google Search Console — {d.gsc.siteUrl} (last {d.rangeDays} days)
        </p>
        {d.gsc.error ? (
          <p className="mt-3 text-sm text-rose-600">Couldn&apos;t load GSC: {d.gsc.error}</p>
        ) : d.gsc.totals ? (
          <>
            <div className="mt-4 grid gap-5 sm:grid-cols-4">
              <MetricCard
                label="Impressions"
                value={d.gsc.totals.impressions.toLocaleString()}
                icon="👁️"
                delta={d.deltas.gscImpressions}
              />
              <MetricCard
                label="Clicks"
                value={d.gsc.totals.clicks.toLocaleString()}
                icon="🖱️"
                delta={d.deltas.gscClicks}
              />
              <MetricCard
                label="Avg CTR"
                value={`${(d.gsc.totals.ctr * 100).toFixed(1)}%`}
              />
              <MetricCard
                label="Avg position"
                value={d.gsc.totals.position.toFixed(1)}
                sub="lower is better"
              />
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

      {/* Site performance — PSI */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Site performance</h3>
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
              <PsiBand score={psiScore} />
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

      {/* SEO / competitors — Ahrefs */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Search presence</h3>
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

        {/* AI Visibility — Ahrefs /ai-responses-count (6h cache) */}
        {d.aiVisibility.error ? (
          <p className="mt-4 text-sm text-rose-600">
            Couldn&apos;t fetch AI visibility: {d.aiVisibility.error}
          </p>
        ) : d.aiVisibility.result ? (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-700">AI Visibility</p>
              <span className="text-xs text-slate-500">citations in AI answers · Ahrefs</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-3">
              <div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {d.aiVisibility.result.totalCitations}
                </div>
                <div className="text-xs text-slate-500">total citations</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {d.aiVisibility.result.platforms.map((p) => (
                  <span
                    key={p.name}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                    title={`${p.pages} distinct pages cited`}
                  >
                    {p.name}
                    <span className="font-bold tabular-nums">{p.citations}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
