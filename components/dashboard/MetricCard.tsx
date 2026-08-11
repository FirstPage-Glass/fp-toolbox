import Sparkline from "./Sparkline";
import Card from "@/components/ui/Card";

interface MetricStatus {
  /** Tone for non-delta statuses (e.g. PageSpeed "Needs work"). */
  tone: "good" | "warn" | "bad";
  label: string;
  hint?: string;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  /** Small suffix rendered beside the value, e.g. "/100". */
  suffix?: string;
  /** Fallback sub-line when there is no delta/status. */
  sub?: string;
  /** Percent change vs previous window — renders an up/down line. */
  delta?: number | null;
  /** true when a drop is good (e.g. spam rate). */
  deltaInvert?: boolean;
  /** Delta suffix; "%" default, "pp" for percentage-point metrics. */
  deltaSuffix?: string;
  /** Hint text next to the delta, e.g. "vs prev 30d". */
  deltaHint?: string;
  /** Non-delta status (PageSpeed grade). */
  status?: MetricStatus;
  /** Daily series for the sparkline. */
  spark?: number[];
  /** Sparkline stroke color. */
  sparkColor?: string;
}

/** KPI card (design-ref .kpi): label + big value + delta/status line + sparkline. */
export default function MetricCard({
  label,
  value,
  suffix,
  sub,
  delta,
  deltaInvert = false,
  deltaSuffix = "%",
  deltaHint,
  status,
  spark,
  sparkColor = "oklch(0.55 0.14 152)",
}: MetricCardProps) {
  const up = delta !== null && delta !== undefined && delta > 0;
  const good = delta === null || delta === undefined ? null : deltaInvert ? !up : up;
  const deltaAbs =
    delta === null || delta === undefined ? null : Math.abs(delta) >= 10 ? Math.round(delta).toFixed(0) : delta.toFixed(1);

  const statusColor =
    status?.tone === "good"
      ? "text-[oklch(0.45_0.13_152)]"
      : status?.tone === "bad"
        ? "text-[oklch(0.62_0.2_22)]"
        : "text-amber-600";

  return (
    <Card className="p-[18px]">
      <div className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-muted">{label}</div>
      <div className="mt-2 text-[30px] font-extrabold text-navy tracking-[-0.02em] leading-none tabular-nums">
        {value}
        {suffix ? <small className="text-base font-bold">{suffix}</small> : null}
      </div>
      {status ? (
        <div className={`mt-1.5 text-[13px] font-bold ${statusColor}`}>
          {status.label}
          {status.hint ? <span className="ml-1 font-normal text-muted">{status.hint}</span> : null}
        </div>
      ) : delta !== null && delta !== undefined ? (
        <div
          className={`mt-1.5 text-[13px] font-bold ${
            good ? "text-[oklch(0.45_0.13_152)]" : "text-[oklch(0.62_0.2_22)]"
          }`}
        >
          {up ? "▲" : "▼"} {deltaAbs}
          {deltaSuffix}
          {deltaHint ? <span className="ml-1 font-normal text-muted">{deltaHint}</span> : null}
        </div>
      ) : sub ? (
        <div className="mt-1.5 text-[13px] text-muted">{sub}</div>
      ) : null}
      <div className="mt-2.5 h-[26px]">
        {spark && spark.length >= 2 ? <Sparkline data={spark} color={sparkColor} /> : null}
      </div>
    </Card>
  );
}
