"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { AhrefsKeyword } from "@/lib/ahrefs";

interface KeywordBarChartProps {
  keywords: AhrefsKeyword[];
}

/** Ahrefs competitor organic keywords, search volume per keyword. */
export default function KeywordBarChart({ keywords }: KeywordBarChartProps) {
  if (keywords.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No keyword data returned for this domain.
      </p>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={keywords}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="keyword"
          width={150}
          tick={{ fontSize: 11, fill: "#334155" }}
          tickFormatter={(k: string) => (k.length > 18 ? `${k.slice(0, 17)}…` : k)}
        />
        <Tooltip formatter={(value) => [String(value), "Search volume"]} />
        <Bar dataKey="volume" name="Search volume" fill="#3369c5" radius={[0, 4, 4, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}
