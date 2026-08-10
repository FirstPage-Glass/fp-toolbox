import DeltaBadge from "./DeltaBadge";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  /** Percent change vs previous window — renders an up/down badge. */
  delta?: number | null;
  /** true when a drop is good (e.g. spam rate). */
  deltaInvert?: boolean;
  /** Delta suffix; "%" default, "pp" for percentage-point metrics. */
  deltaSuffix?: string;
}

/** KPI card for the dashboard sections. Pure presentational, renders in the server tree. */
export default function MetricCard({
  label,
  value,
  sub,
  icon,
  delta,
  deltaInvert = false,
  deltaSuffix = "%",
}: MetricCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{label}</div>
        {icon ? <span className="text-lg" aria-hidden>{icon}</span> : null}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-3xl font-extrabold text-slate-900">{value}</span>
        <DeltaBadge delta={delta} invert={deltaInvert} suffix={deltaSuffix} />
      </div>
      {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
    </div>
  );
}
