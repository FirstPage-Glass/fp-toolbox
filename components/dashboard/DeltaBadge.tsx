interface DeltaBadgeProps {
  /** Percent change vs previous window; null/undefined renders nothing. */
  delta?: number | null;
  /** true when a drop is good (e.g. spam rate). */
  invert?: boolean;
  /** Label suffix; "%" for ratios, "pp" for percentage-point metrics. */
  suffix?: string;
}

/** Small up/down arrow badge for KPI cards. Pure presentational, server-safe. */
export default function DeltaBadge({ delta, invert = false, suffix = "%" }: DeltaBadgeProps) {
  if (delta === null || delta === undefined) return null;
  const up = delta > 0;
  const good = invert ? !up : up;
  const rounded = Math.abs(delta) >= 10 ? Math.round(delta).toFixed(0) : delta.toFixed(1);
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        good ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      }`}
      title={`vs previous window`}
    >
      <span aria-hidden>{up ? "↑" : "↓"}</span>
      {rounded}
      {suffix}
    </span>
  );
}
