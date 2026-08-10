interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

/** Dashed empty-state block for filtered lists and result panels. */
export default function EmptyState({ icon = "🔍", title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="text-3xl" aria-hidden>
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}
