import { NextResponse } from "next/server";
import { currentUsername } from "@/lib/auth";
import { getWebsiteData, getSalesData, getWebsitePsi } from "@/lib/dashboard";
import { buildAiPlans } from "@/lib/ai-plans";

export const dynamic = "force-dynamic";

/**
 * PSI + AI-plan panels, fetched client-side after the shell hydrates — the
 * dashboard document never waits on the slow psi_audit (memoized 6h) or the
 * LLM call (memoized 1h), so skeletons render first and data fills in later.
 * All heavy work here is server-side memoized, so the panel components can
 * each call this endpoint.
 */
export async function GET(request: Request) {
  const user = await currentUsername();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const days = Number(new URL(request.url).searchParams.get("days")) || 30;

  const webP = getWebsiteData(days);
  const salesP = getSalesData(days);
  const [psi, plans] = await Promise.all([
    getWebsitePsi(),
    Promise.all([webP, salesP]).then(([web, sales]) => buildAiPlans(web, sales)),
  ]);
  return NextResponse.json({ psi, plans });
}