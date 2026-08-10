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

/** 7-day trailing average of activeUsers, smoothed for trend visibility. */
function withMovingAverage(data: Ga4TrendPoint[]): (Ga4TrendPoint & { users7d: number | null })[] {
  return data.map((p, i, arr) => {
    if (i < 6) return { ...p, users7d: null };
    const sum = arr.slice(i - 6, i + 1).reduce((s, x) => s + x.activeUsers, 0);
    return { ...p, users7d: Math.round(sum / 7) };
  });
}

/** Daily GA4 active users + sessions, with a 7-day moving average for users. */
export default function TrafficTrendChart({ data }: TrafficTrendChartProps) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No GA4 data in this period.
      </p>
    );
  }
  const chartData = withMovingAverage(data);
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
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
          dataKey="users7d"
          name="Users (7d avg)"
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="4 4"
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
