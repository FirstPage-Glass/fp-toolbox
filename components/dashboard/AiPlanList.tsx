import type { AiPlan } from "@/lib/ai-plans";

interface AiPlanListProps {
  plans: AiPlan[] | null | undefined;
}

const IMPACT_STYLES: Record<AiPlan["impact"], string> = {
  high: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

/** AI-suggested actionable plans for one dashboard section. Renders nothing when unavailable. */
export default function AiPlanList({ plans }: AiPlanListProps) {
  if (!plans || plans.length === 0) return null;
  return (
    <div className="mt-4 rounded-xl border border-fp-200 bg-fp-50/60 p-5">
      <div className="flex items-center gap-2">
        <span className="text-base" aria-hidden>✨</span>
        <p className="text-sm font-semibold text-fp-800">AI Suggested Action Plan</p>
      </div>
      <ul className="mt-3 space-y-3">
        {plans.map((plan, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fp-500 text-[11px] font-bold text-white">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{plan.action}</p>
              <p className="mt-0.5 text-xs text-slate-500">{plan.why}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${IMPACT_STYLES[plan.impact]}`}
            >
              {plan.impact}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
