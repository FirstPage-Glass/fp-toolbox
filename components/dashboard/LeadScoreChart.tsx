"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface LeadScoreDatum {
  name: string;
  value: number;
}

const COLORS: Record<string, string> = {
  "Good leads": "#10b981",
  Spam: "#fb7185",
};

interface LeadScoreChartProps {
  data: LeadScoreDatum[];
}

/** Good-vs-spam split of HubSpot contacts in the window. */
export default function LeadScoreChart({ data }: LeadScoreChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No leads in this period yet.
      </p>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((d) => (
            <Cell key={d.name} fill={COLORS[d.name] ?? "#94a3b8"} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [String(value), ""]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
