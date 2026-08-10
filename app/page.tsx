import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import { getUptimeStats } from "@/lib/uptime";
import { buildInsights } from "@/lib/insights";
import { buildAiPlans } from "@/lib/ai-plans";
import PageHeader from "@/components/ui/PageHeader";
import SectionNav from "@/components/dashboard/SectionNav";
import WebsiteSection from "@/components/dashboard/WebsiteSection";
import SalesSection from "@/components/dashboard/SalesSection";

// ponytail: render on every request — the uptime panel must reflect the 1-min
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        title="FirstPage Division Dashboard"
        description="Live metrics from our HubSpot pipeline, site performance and search presence — no hand-claimed numbers."
      />

      <SectionNav />

      <div className="mt-8">
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
