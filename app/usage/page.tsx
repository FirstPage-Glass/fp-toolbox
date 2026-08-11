import { getUsageStats } from "@/lib/usage";
import { tools } from "@/lib/registry";
import { ToolIcon, categoryBgClass, categoryColorClass } from "@/lib/tool-icons";

export const dynamic = "force-dynamic";

function fmtMoney(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default async function UsagePage() {
  const stats = await getUsageStats();
  const activeTools = tools.filter((t) => t.status === "active");
  const runsBySlug = new Map(stats.perTool.map((p) => [p.tool_slug, p.runs]));
  const avgPerRun =
    stats.totalRuns > 0 ? stats.totalCostUsd / stats.totalRuns : 0;

  const ranked = [...activeTools]
    .map((t) => ({ tool: t, runs: runsBySlug.get(t.slug) ?? 0 }))
    .sort((a, b) => b.runs - a.runs);

  return (
    <>
      {/* Page head — design-ref usage.html .pagehead */}
      <div className="bg-grad-banner text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-11 pb-[52px] relative">
          <span className="inline-flex items-center text-xs font-bold tracking-[0.12em] uppercase bg-white/14 border border-white/22 px-3.5 py-1.5 rounded-full mb-5">
            Toolbox adoption, live
          </span>
          <h1 className="text-white text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] max-w-[20ch]">
            First Page Toolbox: used, not just built.
          </h1>
          <p className="text-[oklch(0.93_0.02_250)] text-[15.5px] mt-3 max-w-[58ch]">
            Every run is logged to Postgres with its user, duration and LLM
            cost. This is the live proof of adoption: for leadership, and for
            the team.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
        {/* Big numbers */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-9">
          <div className="relative bg-white border border-border rounded-[14px] shadow-[var(--shadow-sm)] p-6 overflow-hidden">
            <span className="absolute right-4 top-5 text-[11.5px] font-extrabold px-2.5 py-1 rounded-full bg-[oklch(0.55_0.14_152_/_0.13)] text-[oklch(0.42_0.13_152)]">
              ▲ live
            </span>
            <div className="text-xs font-extrabold uppercase tracking-[0.09em] text-muted">
              Tool runs logged
            </div>
            <div className="mt-2.5 text-[40px] font-extrabold text-navy tracking-[-0.02em] leading-none tabular-nums">
              {stats.totalRuns.toLocaleString()}
            </div>
            <div className="mt-2 text-[13px] text-muted">
              All-time · every generate &amp; refine action
            </div>
          </div>

          <div className="relative bg-white border border-border rounded-[14px] shadow-[var(--shadow-sm)] p-6 overflow-hidden">
            <span className="absolute right-4 top-5 text-[11.5px] font-extrabold px-2.5 py-1 rounded-full bg-[oklch(0.55_0.14_152_/_0.13)] text-[oklch(0.42_0.13_152)]">
              ▲ live
            </span>
            <div className="text-xs font-extrabold uppercase tracking-[0.09em] text-muted">
              Active users
            </div>
            <div className="mt-2.5 text-[40px] font-extrabold text-navy tracking-[-0.02em] leading-none tabular-nums">
              {stats.activeUsers}
            </div>
            <div className="mt-2 text-[13px] text-muted">
              Team members who ran a tool
            </div>
          </div>

          <div className="relative bg-white border border-border rounded-[14px] shadow-[var(--shadow-sm)] p-6 overflow-hidden">
            <span className="absolute right-4 top-5 text-[11.5px] font-extrabold px-2.5 py-1 rounded-full bg-[oklch(0.55_0.14_152_/_0.13)] text-[oklch(0.42_0.13_152)]">
              {stats.totalRuns > 0 ? `US$${avgPerRun.toFixed(2)}/run` : "—"}
            </span>
            <div className="text-xs font-extrabold uppercase tracking-[0.09em] text-muted">
              LLM cost (US$)
            </div>
            <div className="mt-2.5 text-[40px] font-extrabold text-navy tracking-[-0.02em] leading-none tabular-nums">
              {fmtMoney(stats.totalCostUsd)}
            </div>
            <div className="mt-2 text-[13px] text-muted">
              All-time total LLM spend
            </div>
          </div>
        </div>

        {/* Tools in production */}
        <div className="flex items-baseline gap-3 mb-5 mt-10">
          <h2 className="text-xl font-extrabold text-navy">Tools in production</h2>
          <span className="text-xs font-bold text-muted">{activeTools.length} active</span>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {ranked.map(({ tool, runs }) => (
            <div
              key={tool.slug}
              className="flex gap-3.5 items-start bg-white border border-border rounded-[14px] shadow-[var(--shadow-sm)] p-4.5"
            >
              <span
                className={`flex h-[42px] w-[42px] items-center justify-center rounded-[10px] shrink-0 ${categoryBgClass(tool.category)} ${categoryColorClass(tool.category)}`}
              >
                <ToolIcon name={tool.name} className="w-[21px] h-[21px]" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[15px] font-extrabold text-navy truncate">
                  {tool.name}
                  {tool.externalLink ? (
                    <span className="ml-1.5 inline-block text-[10.5px] font-extrabold uppercase tracking-[0.06em] bg-navy text-white px-1.5 py-0.5 rounded-[5px] align-middle">
                      External
                    </span>
                  ) : null}
                </h3>
                <p className="text-[12.5px] text-muted leading-snug mt-0.5 line-clamp-2">
                  {tool.description}
                </p>
              </div>
              <div className="ml-auto text-right shrink-0">
                <b className="block font-extrabold text-[18px] text-navy tabular-nums">
                  {runs.toLocaleString()}
                </b>
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
                  runs
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
