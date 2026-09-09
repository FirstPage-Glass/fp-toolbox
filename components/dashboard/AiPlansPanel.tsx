"use client";

import { AiPlanSkeleton } from "./DashboardSkeleton";
import AiPlanList from "./AiPlanList";
import type { AiPlans } from "@/lib/ai-plans";
import { usePanels } from "./panels-client";

/**
 * AI Suggested Action Plan panel — client-filled after the shell hydrates, so
 * the (up-to-15s, memoized) LLM call never pins the page's document/hydration.
 */
export default function AiPlansPanel({ days, zone }: { days: number; zone: "website" | "sales" }) {
  const panels = usePanels(days);
  if (panels === null) return <AiPlanSkeleton />;
  const plans: AiPlans | null = panels.plans;
  if (!plans) return null;
  return <AiPlanList plans={zone === "website" ? plans.website : plans.sales} />;
}