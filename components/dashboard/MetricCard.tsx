interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
}

/** KPI card for the dashboard header row. Pure presentational, renders in the server tree. */
export default function MetricCard({ label, value, sub, icon }: MetricCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{label}</div>
        {icon ? <span className="text-lg" aria-hidden>{icon}</span> : null}
      </div>
      <div className="mt-1 text-3xl font-extrabold text-slate-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
    </div>
  );
}
