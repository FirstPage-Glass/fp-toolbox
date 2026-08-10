import MetricCard from "./MetricCard";
import UnconfiguredNotice from "./UnconfiguredNotice";
import SectionHeader from "./SectionHeader";
import AiPlanList from "./AiPlanList";
import Card from "@/components/ui/Card";
import LeadTrendChart from "./LeadTrendChart";
import LeadScoreChart from "./LeadScoreChart";
import type { DashboardData } from "@/lib/dashboard";
import type { Insight } from "@/lib/insights";
import type { AiPlan } from "@/lib/ai-plans";

const usd = (n: number): string =>
  `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

interface SalesSectionProps {
  d: DashboardData;
  insights: Insight[];
  aiPlans?: AiPlan[] | null;
}

/** Sales performance half of the dashboard: pipeline, leaderboard, leads, ROI. */
export default function SalesSection({ d, insights, aiPlans }: SalesSectionProps) {
  const totalLeads = d.hubspot.spam?.good ?? d.hubspot.leads.length;
  const spamRate = d.hubspot.spam?.spamRatePct ?? null;
  const deals = d.deals.aggregate;
  const donutData = d.hubspot.spam
    ? [
        { name: "Good leads", value: d.hubspot.spam.good },
        { name: "Spam", value: d.hubspot.spam.spam },
      ]
    : [];
  const spamSources = (d.hubspot.spam?.topSources ?? []).slice(0, 5);

  const eng = d.engagement.report;
  const misrate =
    eng && eng.engagedCount > 0 ? Math.round((eng.engagedSpam / eng.engagedCount) * 100) : null;

  const funnel = deals
    ? [
        { name: "Open", value: deals.funnel.open, color: "bg-fp-400" },
        { name: "Won", value: deals.funnel.won, color: "bg-emerald-400" },
      ]
    : [];
  const funnelTotal = deals ? deals.funnel.open + deals.funnel.won : 0;
  const maxRevenue = deals?.perOwner[0]?.wonRevenue ?? 0;

  return (
    <section id="sales" className="scroll-mt-40">
      <SectionHeader
        id="sales"
        accent="sales"
        title="Sales Performance"
        description={`Pipeline, lead quality and tool ROI — last ${d.rangeDays} days`}
        days={d.rangeDays}
        insights={insights}
      />

      <AiPlanList plans={aiPlans} />

      {/* KPI row */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Leads"
          value={totalLeads}
          sub={d.hubspot.configured ? "non-spam, from HubSpot" : "HubSpot not configured"}
          icon="📥"
          delta={d.deltas.leads}
        />
        <MetricCard
          label="Spam rate"
          value={spamRate !== null ? `${spamRate.toFixed(1)}%` : "—"}
          sub={spamRate !== null ? "of contacts in window" : "needs HUBSPOT_SERVICE_KEY"}
          icon="🛡️"
          delta={d.deltas.spamRate}
          deltaInvert
          deltaSuffix="pp"
        />
        <MetricCard
          label="Closed-won"
          value={deals ? usd(deals.closedWon.revenue) : "—"}
          sub={deals ? `${deals.closedWon.count} deals` : "HubSpot deals not loaded"}
          icon="💰"
          delta={d.deltas.closedWonRevenue}
        />
        <MetricCard
          label="Pipeline (new)"
          value={deals ? usd(deals.pipelineValue) : "—"}
          sub={deals ? `${deals.newCount} deals created` : "needs deals.read scope"}
          icon="📈"
          delta={d.deltas.pipelineValue}
        />
      </div>

      {/* Pipeline — deals created + outcome funnel */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900">Pipeline</h3>
        {!d.hubspot.configured ? (
          <div className="mt-4">
            <UnconfiguredNotice envVar="HUBSPOT_SERVICE_KEY">
              Connect HubSpot to see pipeline and closed-won revenue.
            </UnconfiguredNotice>
          </div>
        ) : d.deals.error ? (
          <div className="mt-4 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50 p-6 text-center">
            <div className="text-2xl" aria-hidden>🔒</div>
            <p className="mt-2 text-sm font-medium text-rose-700">
              Couldn&apos;t load deals — likely missing <code className="rounded bg-rose-100 px-1 py-0.5 font-mono">deals.read</code> scope.
            </p>
            <p className="mt-1 text-xs text-rose-500">{d.deals.error}</p>
          </div>
        ) : deals ? (
          <>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <Card tone="slate">
                <div className="text-sm text-slate-500">Avg deal size</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {deals.avgAmount ? usd(deals.avgAmount) : "—"}
                </div>
                <div className="mt-1 text-xs text-slate-500">new deals in window</div>
              </Card>
              <Card tone="slate">
                <div className="text-sm text-slate-500">Won deals</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  {deals.closedWon.count}
                </div>
                <div className="mt-1 text-xs text-slate-500">closed in window</div>
              </Card>
              <Card tone="slate">
                <div className="text-sm text-slate-500">New deals</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">{deals.newCount}</div>
                <div className="mt-1 text-xs text-slate-500">created in window</div>
              </Card>
            </div>
            <div className="mt-6">
              <p className="text-sm text-slate-500">New deals — open vs won</p>
              <div className="mt-2 space-y-2">
                {funnel.map((f) => (
                  <div key={f.name} className="flex items-center gap-3">
                    <span className="w-10 text-sm text-slate-600">{f.name}</span>
                    <div className="h-5 flex-1 overflow-hidden rounded bg-slate-100">
                      {funnelTotal > 0 ? (
                        <div
                          className={`h-full rounded ${f.color}`}
                          style={{ width: `${(f.value / funnelTotal) * 100}%` }}
                          title={`${f.value} deals`}
                        />
                      ) : null}
                    </div>
                    <span className="w-8 text-right text-sm tabular-nums text-slate-700">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Loading deals…</p>
        )}
      </Card>

      {/* Leaderboard — per-owner closed-won revenue */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900">Sales leaderboard</h3>
        <p className="mt-1 text-sm text-slate-500">
          Closed-won revenue by owner · {d.rangeDays}-day window
        </p>
        {d.deals.error ? (
          <p className="mt-3 text-sm text-rose-600">Deals unavailable: {d.deals.error}</p>
        ) : deals && deals.perOwner.length > 0 ? (
          <div className="mt-4 space-y-3">
            {deals.perOwner.map((row, idx) => (
              <div key={row.ownerId} className="flex items-center gap-3">
                <span className="w-6 text-right text-sm tabular-nums text-slate-400">
                  {idx + 1}
                </span>
                <span className="w-32 truncate text-sm font-medium text-slate-800">
                  {row.ownerName}
                </span>
                <div className="h-5 flex-1 overflow-hidden rounded bg-slate-100">
                  <div
                    className="h-full rounded bg-emerald-400"
                    style={{ width: `${maxRevenue > 0 ? (row.wonRevenue / maxRevenue) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-24 text-right text-sm font-semibold tabular-nums text-slate-900">
                  {usd(row.wonRevenue)}
                </span>
                <span className="hidden w-20 text-right text-xs tabular-nums text-slate-500 sm:block">
                  {row.wonCount} won
                </span>
                <span className="hidden w-24 text-right text-xs tabular-nums text-slate-500 md:block">
                  {usd(row.openPipeline)} open
                </span>
              </div>
            ))}
          </div>
        ) : deals ? (
          <p className="mt-3 text-sm text-slate-500">No closed-won deals in this window.</p>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Loading leaderboard…</p>
        )}
      </Card>

      {/* HubSpot leads */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900">HubSpot leads</h3>
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
                <p className="text-sm text-slate-500">Daily lead volume (last {d.rangeDays} days)</p>
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
      </Card>

      {/* Lead quality check — engagement cross-check */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900">Lead quality check</h3>
        <p className="mt-1 text-sm text-slate-500">
          Engagement cross-check · {d.rangeDays}-day window · contacts with a deal created as
          ground truth for a real lead
        </p>
        {!d.hubspot.configured ? (
          <div className="mt-4">
            <UnconfiguredNotice envVar="HUBSPOT_SERVICE_KEY">
              Connect HubSpot to cross-check the spam filter against real engagement.
            </UnconfiguredNotice>
          </div>
        ) : d.engagement.error ? (
          <p className="mt-3 text-sm text-rose-600">
            Couldn&apos;t load engagement data: {d.engagement.error}
          </p>
        ) : eng ? (
          <>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <Card tone="slate">
                <div className="text-sm text-slate-500">Engaged leads</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">{eng.engagedCount}</div>
                <div className="mt-1 text-xs text-slate-500">
                  of {eng.totalContacts} contacts in window · with a deal
                </div>
              </Card>
              <Card tone="slate">
                <div className="text-sm text-slate-500">Flagged as spam</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">{eng.engagedSpam}</div>
                <div className="mt-1 text-xs text-slate-500">real leads the filter rejected</div>
              </Card>
              <Card tone="slate">
                <div className="text-sm text-slate-500">Misjudged rate</div>
                <div className={`mt-1 text-3xl font-extrabold ${misrate !== null && misrate > 5 ? "text-amber-600" : "text-slate-900"}`}>
                  {misrate !== null ? `${misrate}%` : "—"}
                </div>
                <div className="mt-1 text-xs text-slate-500">of engaged leads</div>
              </Card>
            </div>

            {eng.engagedSpam === 0 ? (
              <p className="mt-4 text-sm font-medium text-emerald-700">
                ✓ Filter aligned — no engaged lead was flagged as spam.
              </p>
            ) : (
              <>
                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-700">Why real leads get flagged</p>
                  <div className="mt-2 space-y-2">
                    {eng.topReasons.slice(0, 4).map((r) => {
                      const pct = Math.round((r.count / eng.engagedSpam) * 100);
                      return (
                        <div key={r.label} className="flex items-center gap-3">
                          <span className="w-44 truncate text-sm text-slate-600" title={r.label}>{r.label}</span>
                          <div className="h-4 flex-1 overflow-hidden rounded bg-slate-100">
                            <div className="h-full rounded bg-amber-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right text-sm tabular-nums text-slate-700">{r.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {eng.misclassified.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-700">Misjudged leads</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {eng.misclassified.slice(0, 8).map((m) => (
                        <li key={m.email} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-mono text-xs text-slate-800">{m.email}</span>
                          {m.website ? (
                            <span className="text-xs text-slate-500">{m.website}</span>
                          ) : (
                            <span className="text-xs italic text-slate-400">no website</span>
                          )}
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                            {m.reason}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <p className="mt-4 text-xs text-slate-500">
                  Spam without follow-up — top domains:{" "}
                  {eng.pureSpamTopDomains.length
                    ? eng.pureSpamTopDomains.map((d) => `${d.label} (${d.count})`).join(" · ")
                    : "—"}
                </p>
              </>
            )}
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Loading engagement data…</p>
        )}
      </Card>

      {/* Usage / ROI — tool runs + LLM cost */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900">Tool ROI</h3>
        <p className="mt-1 text-sm text-slate-500">
          Usage events · last {d.rangeDays} days · LLM cost (US$)
        </p>
        {d.usage.perTool.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No tool usage logged yet — runs appear here as the team uses the toolbox.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="pb-2">Tool</th>
                  <th className="pb-2 text-right">Runs</th>
                  <th className="pb-2 text-right">LLM cost</th>
                </tr>
              </thead>
              <tbody>
                {d.usage.perTool.map((t) => (
                  <tr key={t.tool_slug} className="border-b border-slate-100">
                    <td className="py-2 font-medium text-slate-800">{t.tool_slug}</td>
                    <td className="py-2 text-right tabular-nums">{t.runs}</td>
                    <td className="py-2 text-right tabular-nums">${t.cost_usd.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-slate-900">
                  <td className="pt-2">Total</td>
                  <td className="pt-2 text-right tabular-nums">{d.usage.totalRuns}</td>
                  <td className="pt-2 text-right tabular-nums">${d.usage.totalCostUsd.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
