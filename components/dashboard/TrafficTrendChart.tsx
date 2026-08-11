"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
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

/** Daily GA4 active users (area) + sessions + 7d moving average — design-ref site analytics chart. */
export default function TrafficTrendChart({ data }: TrafficTrendChartProps) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted">
        No GA4 data in this period.
      </p>
    );
  }
  const chartData = withMovingAverage(data);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="ga4Area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.16 250 / 0.28)" />
            <stop offset="100%" stopColor="oklch(0.62 0.16 250 / 0)" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#787878" }}
          tickFormatter={(d: string) => d.slice(5)}
          minTickGap={24}
        />
        <YAxis tick={{ fontSize: 11, fill: "#787878" }} allowDecimals={false} />
        <Tooltip labelFormatter={(label) => String(label)} />
        <Area
          type="monotone"
          dataKey="activeUsers"
          name="Active users"
          stroke="#427fe0"
          strokeWidth={2.5}
          fill="url(#ga4Area)"
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
          stroke="oklch(0.5 0.14 254)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
