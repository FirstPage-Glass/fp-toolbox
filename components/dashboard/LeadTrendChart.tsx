"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { LeadTrendPoint } from "@/lib/dashboard";

interface LeadTrendChartProps {
  data: LeadTrendPoint[];
}

/** Daily lead volume over the last 30 days. */
export default function LeadTrendChart({ data }: LeadTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickFormatter={(d: string) => d.slice(5)}
          minTickGap={24}
        />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
        <Tooltip
          formatter={(value) => [String(value), "Leads"]}
          labelFormatter={(label) => String(label)}
        />
        <Line
          type="monotone"
          dataKey="leads"
          name="Leads"
          stroke="#427fe0"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
