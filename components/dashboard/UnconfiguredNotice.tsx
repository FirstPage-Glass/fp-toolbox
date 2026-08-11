import type { ReactNode } from "react";

interface UnconfiguredNoticeProps {
  envVar: string;
  children: ReactNode;
}

/** Placeholder card shown when a dashboard data source has no API key configured. */
export default function UnconfiguredNotice({ envVar, children }: UnconfiguredNoticeProps) {
  return (
    <div className="rounded-[14px] border-2 border-dashed border-border bg-surface/50 p-6 text-center">
      <div className="text-2xl" aria-hidden>🔑</div>
      <p className="mt-2 text-sm font-medium text-navy">{children}</p>
      <p className="mt-1 text-xs text-muted">
        Set <code className="rounded bg-surface px-1 py-0.5 font-mono text-fp-700">{envVar}</code> in{" "}
        <code className="rounded bg-surface px-1 py-0.5 font-mono">.env.local</code> to activate.
      </p>
    </div>
  );
}
