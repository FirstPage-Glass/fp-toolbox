/** Tiny SVG sparkline for KPI cards (design-ref .kpi .spark). Renders nothing for <2 points. */
export default function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 160;
  const H = 26;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - 3 - ((v - min) / range) * (H - 7);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
