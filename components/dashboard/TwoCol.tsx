import type { ReactNode } from "react";

/** Two-column card body (design-ref .card .two): left + right, divider on desktop. */
export default function TwoCol({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="min-w-0">{left}</div>
      <div className="min-w-0 md:border-l md:border-border md:pl-6">{right}</div>
    </div>
  );
}
