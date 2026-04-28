import { fetchAllTools } from "@/lib/nocodb";
import SlideDeck from "./SlideDeck";

export default async function PresentationPage() {
  const tools = await fetchAllTools();

  // Real metrics from NocoDB
  const totalHours = tools.reduce(
    (sum, t) => sum + (t.hours_saved_per_month || 0),
    0
  );
  const totalCost = tools.reduce(
    (sum, t) => sum + (t.cost_saved_per_month || 0),
    0
  );
  const activeCount = tools.filter((t) =>
    ["Active", "Live", "Production"].includes(t.status)
  ).length;

  // Teams served (from serve MultiSelect)
  const teamCoverageMap: Record<string, number> = {};
  tools.forEach((tool) => {
    (tool.serve || []).forEach((team) => {
      teamCoverageMap[team] = (teamCoverageMap[team] || 0) + 1;
    });
  });
  const teamCoverage = Object.entries(teamCoverageMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const teamCount = teamCoverage.length;

  // Status breakdown
  const statusOrder = ["Active", "Building", "Prototype", "Refactoring", "Planned"];
  const statusCounts: Record<string, number> = {};
  statusOrder.forEach((s) => (statusCounts[s] = 0));
  tools.forEach((t) => {
    if (statusCounts[t.status] !== undefined) statusCounts[t.status]++;
    else statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
  });

  // Top 5 by cost saved
  const topTools = [...tools]
    .sort(
      (a, b) =>
        (b.cost_saved_per_month || 0) - (a.cost_saved_per_month || 0)
    )
    .slice(0, 5);

  return (
    <SlideDeck
      tools={tools}
      totalHours={totalHours}
      totalCost={totalCost}
      activeCount={activeCount}
      teamCount={teamCount}
      statusCounts={statusCounts}
      teamCoverage={teamCoverage}
      topTools={topTools}
    />
  );
}
