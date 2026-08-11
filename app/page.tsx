import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import { getUptimeStats } from "@/lib/uptime";
import { buildInsights } from "@/lib/insights";
import { buildAiPlans } from "@/lib/ai-plans";
import RangePicker from "@/components/dashboard/RangePicker";
import SectionNav from "@/components/dashboard/SectionNav";
import WebsiteSection from "@/components/dashboard/WebsiteSection";
import SalesSection from "@/components/dashboard/SalesSection";
import LeadQualitySection from "@/components/dashboard/LeadQualitySection";
import { getSpamReport } from "@/lib/hubspot";
import { cached } from "@/lib/cache";

// ponytail: render on every request — the uptime panel must reflect the 5-min
// checker live, and external API calls are all memoized for 1h anyway.
export const dynamic = "force-dynamic";

/** 7/30/90 range from `?days=`; anything else (or missing) falls back to 30. */
function parseDays(raw: string | undefined): number {
  const n = Number(raw);
  return n === 7 || n === 90 ? n : 30;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const sp = await searchParams;
  const days = parseDays(sp.days);
  const d = await getDashboardData(days);
  const uptime = await getUptimeStats(d.targets.url);
  const insights = buildInsights(d);
  // AI plans are memoized 1h and degrade to null — never block the page.
  const aiPlans = await buildAiPlans(d);
  // Lead Quality report (same memoized 10-min source as /admin).
  const spamReport = await cached("spam-report-overview:30", () => getSpamReport(30), 10 * 60 * 1000);

  const inventory =
    d.clients.configured && d.clients.inventory
      ? `${d.clients.inventory.gscSites} GSC sites · ${d.clients.inventory.ga4Properties} GA4 properties`
      : null;

  return (
    <>
      {/* Page head — design-ref dashboard.html .pagehead */}
      <div className="bg-grad-banner text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[34px] pb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-white text-[clamp(24px,3vw,32px)] font-extrabold tracking-[-0.015em]">
              FirstPage Division Dashboard
            </h1>
            <p className="mt-1 text-[14px] text-[oklch(0.93_0.02_250)]">
              Website &amp; sales performance, refreshed hourly
            </p>
            {inventory ? (
              <p className="mt-[3px] text-[12.5px] text-[oklch(0.93_0.02_250)] opacity-85">
                {inventory} under management
              </p>
            ) : null}
          </div>
          <RangePicker days={days} />
        </div>
      </div>

      <SectionNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WebsiteSection
          d={d}
          uptime={uptime}
          insights={insights.website}
          aiPlans={aiPlans?.website ?? null}
        />
        <div className="mt-12" aria-hidden>
          <SalesSection
            d={d}
            insights={insights.sales}
            aiPlans={aiPlans?.sales ?? null}
          />
        </div>

        <LeadQualitySection report={spamReport} days={30} />

        <p className="mt-10 pb-4 text-sm text-muted">
          Data refreshes hourly. Sources: HubSpot, firstpage MCP (GA4/GSC/PSI), Ahrefs.{" "}
          <Link href="/toolbox" className="font-bold text-fp-600">
            Open the toolbox →
          </Link>
        </p>
      </main>
    </>
  );
}
