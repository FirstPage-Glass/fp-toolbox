import Link from "next/link";

const RANGES = [7, 30, 90] as const;

interface RangePickerProps {
  days: number;
}

/**
 * Dashboard time-range switcher (7/30/90 days) — server component: plain Links
 * against `?days=N` search params, no client state.
 */
export default function RangePicker({ days }: RangePickerProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-slate-100 p-1">
      {RANGES.map((r) => {
        const isActive = days === r;
        return (
          <Link
            key={r}
            href={`/?days=${r}`}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {r}d
          </Link>
        );
      })}
    </div>
  );
}
