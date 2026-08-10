"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type { Ga4TrendPoint } from "@/lib/dashboard";

interface TrafficTrendChartProps {
  data: Ga4TrendPoint[];
}

/** Daily GA4 active users + sessions over the last 30 days. */
export default function TrafficTrendChart({ data }: TrafficTrendChartProps) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No GA4 data in this period.
      </p>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickFormatter={(d: string) => d.slice(5)}
          minTickGap={24}
        />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
        <Tooltip labelFormatter={(label) => String(label)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="activeUsers"
          name="Active users"
          stroke="#427fe0"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="sessions"
          name="Sessions"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
