import { getUsageStats } from "@/lib/usage";
import { tools } from "@/lib/registry";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";

export default async function PresentationPage() {
  const stats = await getUsageStats();
  const activeTools = tools.filter((t) => t.status === "active" && !t.externalLink);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <PageHeader
        title="First Page Toolbox"
        description="Sales enablement, measured in real usage."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <StatCard label="tool runs logged" value={stats.totalRuns} tone="fp-800" size="lg" />
        <StatCard label="active users" value={stats.activeUsers} tone="fp-700" size="lg" />
        <StatCard
          label="LLM cost (US$)"
          value={`$${stats.totalCostUsd.toFixed(2)}`}
          tone="fp-600"
          size="lg"
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Tools in production</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {activeTools.map((t) => (
            <Card key={t.slug}>
              <div className="text-2xl">{t.icon}</div>
              <div className="mt-2 font-semibold text-slate-900">{t.name}</div>
              <div className="text-sm text-slate-600">{t.description}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
