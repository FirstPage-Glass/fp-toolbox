import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
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
    <Table className="text-[13.5px]">
      <TableHeader>
        <TableRow className="border-border">
          <TableHead className="h-auto px-0 pb-2 pr-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted">Query</TableHead>
          <TableHead className="h-auto px-0 pb-2 pr-4 text-right text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted">Impressions</TableHead>
          <TableHead className="h-auto px-0 pb-2 pr-4 text-right text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted">Clicks</TableHead>
          <TableHead className="h-auto px-0 pb-2 pr-4 text-right text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted">CTR</TableHead>
          <TableHead className="h-auto px-0 pb-2 text-right text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted">Position</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {queries.map((q) => (
          <TableRow key={q.query} className="border-border">
            <TableCell className="px-0 py-2.5 pr-4 max-w-[260px] truncate font-semibold text-navy" title={q.query}>
              {q.query}
            </TableCell>
            <TableCell className="px-0 py-2.5 pr-4 text-right tabular-nums">{q.impressions}</TableCell>
            <TableCell className="px-0 py-2.5 pr-4 text-right tabular-nums">{q.clicks}</TableCell>
            <TableCell className="px-0 py-2.5 pr-4 text-right tabular-nums">{pct(q.ctr)}</TableCell>
            <TableCell className="px-0 py-2.5 text-right tabular-nums">{q.position.toFixed(1)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
