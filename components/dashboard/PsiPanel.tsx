"use client";

import MetricCard from "./MetricCard";
import CardHead from "./CardHead";
import StatMini from "./StatMini";
import TwoCol from "./TwoCol";
import Card from "@/components/ui/Card";
import { usePanels } from "./panels-client";

/** Status chip tones for the PSI KPI (mirrors WebsiteSection's old logic). */
function psiStatus(score: number | null): { label: string; tone: "good" | "warn" | "bad" } | null {
  if (score === null) return null;
  if (score >= 90) return { label: "Good", tone: "good" };
  if (score >= 50) return { label: "Needs work", tone: "warn" };
  return { label: "Poor", tone: "bad" };
}

/** PageSpeed KPI card — client-filled so psi_audit never blocks hydration. */
export function PsiKpi({ days }: { days: number }) {
  const panels = usePanels(days);
  const result = panels?.psi.result ?? null;
  const error = panels?.psi.error ?? null;
  const score = result?.performanceScore ?? null;
  return (
    <MetricCard
      label="PageSpeed"
      value={score !== null ? `${score}` : "—"}
      suffix="/100"
      sub={
        result
          ? result.url.replace(/^https?:\/\//, "")
          : error
            ? "failed to fetch"
            : "checking…"
      }
      status={psiStatus(score) ? { ...psiStatus(score)!, hint: "mobile" } : undefined}
    />
  );
}

/** Full PageSpeed audit card — client-filled, streams in after the shell. */
export function PsiDetail({ days }: { days: number }) {
  const panels = usePanels(days);
  const result = panels?.psi.result ?? null;
  const error = panels?.psi.error ?? null;
  const score = result?.performanceScore ?? null;
  return (
    <Card className="mt-8">
      <CardHead title="Site performance" src="PageSpeed Insights · mobile" />
      {error ? (
        <p className="text-sm text-rose-600">Couldn&apos;t fetch PageSpeed: {error}</p>
      ) : result ? (
        <TwoCol
          left={
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[44px] font-extrabold text-navy tracking-[-0.02em] leading-none">
                  {score !== null ? score : "—"}
                </span>
                <span className="text-sm font-semibold text-muted">/ 100 performance</span>
              </div>
              <div
                className="h-3 rounded-full my-2.5"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.62 0.2 22) 0 49%, oklch(0.72 0.15 75) 49% 89%, oklch(0.55 0.14 152) 89% 100%)",
                }}
                aria-hidden
              />
              <div className="flex justify-between text-[11px] font-semibold text-muted">
                <span>Poor</span>
                <span>Needs work</span>
                <span>Good</span>
              </div>
            </div>
          }
          right={
            <>
              <StatMini label="Largest Contentful Paint" value={result.lcpMs !== null ? `${(result.lcpMs / 1000).toFixed(1)} s` : "—"} />
              <StatMini label="Cumulative Layout Shift" value={result.cls !== null ? result.cls.toFixed(2) : "—"} />
              <StatMini label="First Contentful Paint" value={result.fcpMs !== null ? `${(result.fcpMs / 1000).toFixed(1)} s` : "—"} />
              <StatMini label="Time to Interactive" value={result.tbtMs !== null ? `${(result.tbtMs / 1000).toFixed(1)} s` : "—"} />
            </>
          }
        />
      ) : (
        <p className="text-sm text-muted">Checking PageSpeed…</p>
      )}
    </Card>
  );
}