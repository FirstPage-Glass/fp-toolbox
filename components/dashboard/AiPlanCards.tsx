import AiPlanList from "./AiPlanList";
import type { AiPlans } from "@/lib/ai-plans";

interface AiPlanCardsProps {
  /**
   * Shared promise for BOTH zones' AI plans — one LLM call feeds both
   * sections, so the cards fill in together after both zones' data is ready.
   */
  plansP: Promise<AiPlans | null>;
  zone: "website" | "sales";
}

/** Zone-scoped view of the shared AI plans promise. Renders nothing when unavailable. */
export default async function AiPlanCards({ plansP, zone }: AiPlanCardsProps) {
  const plans = await plansP;
  if (!plans) return null;
  return <AiPlanList plans={zone === "website" ? plans.website : plans.sales} />;
}
