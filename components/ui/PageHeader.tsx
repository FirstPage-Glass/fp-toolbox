import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Small pill next to the title, e.g. "22 tools". */
  count?: string;
  /** Extra content on the right (e.g. actions, links). */
  trailing?: ReactNode;
}

/** Shared page header: title + optional count pill + description + right-side content. */
export default function PageHeader({
  title,
  description,
  count,
  trailing,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          {count ? (
            <span className="rounded-full bg-fp-100 px-2.5 py-0.5 text-xs font-semibold text-fp-700">
              {count}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-2 text-slate-600">{description}</p>
        ) : null}
      </div>
      {trailing ?? null}
    </div>
  );
}
