import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateDeck } from "@/lib/generator";
import { getPsiScore } from "@/lib/psi";
import { getCompetitorKeywords } from "@/lib/ahrefs";
import { logUsage } from "@/lib/usage";

export async function POST(request: Request) {
  const body = await request.json();
  const brief = {
    clientName: String(body.clientName || ""),
    industry: String(body.industry || ""),
    objective: String(body.objective || ""),
    targetMarket: String(body.targetMarket || ""),
    budget: String(body.budget || ""),
    website: String(body.website || ""),
    notes: String(body.notes || ""),
  };
  if (!brief.clientName || !brief.industry || !brief.objective) {
    return NextResponse.json({ error: "clientName, industry and objective are required" }, { status: 400 });
  }

  const user = (await cookies()).get("fp-auth")?.value || "unknown";
  const started = Date.now();

  // Data enrichment — tolerate failures (deck still generates without them)
  const psi = brief.website
    ? await getPsiScore(brief.website).catch(() => null)
    : null;
  const competitors = brief.website
    ? await getCompetitorKeywords(brief.website, { limit: 5 }).catch(() => null)
    : null;

  const result = await generateDeck(brief, { psi, competitors });

  await logUsage({
    user,
    toolSlug: "pitch-deck",
    action: "generate",
    durationMs: Date.now() - started,
    promptTokens: result.promptTokens,
    completionTokens: result.completionTokens,
    costUsd: result.costUsd,
  });

  return NextResponse.json({
    deck: result.deck,
    meta: { model: result.model, costUsd: result.costUsd },
    data: { psi, competitors },
  });
}
