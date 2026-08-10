import type { GscQueryRow } from "@/lib/dashboard";

interface SearchPerformanceTableProps {
  queries: GscQueryRow[];
}

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

/** Top organic queries from GSC, ranked by impressions. */
export default function SearchPerformanceTable({ queries }: SearchPerformanceTableProps) {
  if (queries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No organic queries recorded for this period.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="pb-2">Query</th>
            <th className="pb-2 text-right">Impressions</th>
            <th className="pb-2 text-right">Clicks</th>
            <th className="pb-2 text-right">CTR</th>
            <th className="pb-2 text-right">Position</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((q) => (
            <tr key={q.query} className="border-b border-slate-100">
              <td className="py-2 pr-4 max-w-[260px] truncate" title={q.query}>
                {q.query}
              </td>
              <td className="py-2 text-right tabular-nums">{q.impressions}</td>
              <td className="py-2 text-right tabular-nums">{q.clicks}</td>
              <td className="py-2 text-right tabular-nums">{pct(q.ctr)}</td>
              <td className="py-2 text-right tabular-nums">{q.position.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
