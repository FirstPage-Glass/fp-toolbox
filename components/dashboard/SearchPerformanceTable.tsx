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
      <p className="py-8 text-center text-sm text-muted">
        No organic queries recorded for this period.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13.5px]">
        <thead>
          <tr className="text-left text-muted border-b-[1.5px] border-border">
            <th className="pb-2 pr-4 text-[11px] font-extrabold uppercase tracking-[0.08em]">Query</th>
            <th className="pb-2 pr-4 text-right text-[11px] font-extrabold uppercase tracking-[0.08em]">Impressions</th>
            <th className="pb-2 pr-4 text-right text-[11px] font-extrabold uppercase tracking-[0.08em]">Clicks</th>
            <th className="pb-2 pr-4 text-right text-[11px] font-extrabold uppercase tracking-[0.08em]">CTR</th>
            <th className="pb-2 text-right text-[11px] font-extrabold uppercase tracking-[0.08em]">Position</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((q) => (
            <tr key={q.query} className="border-b border-border last:border-0">
              <td className="py-2.5 pr-4 max-w-[260px] truncate font-semibold text-navy" title={q.query}>
                {q.query}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">{q.impressions}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums">{q.clicks}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums">{pct(q.ctr)}</td>
              <td className="py-2.5 text-right tabular-nums">{q.position.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
