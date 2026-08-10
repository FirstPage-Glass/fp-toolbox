import { cookies } from "next/headers";
import { logUsage } from "./usage";
import { saveOutput, getOutput, listOutputs } from "./outputs";
import { getClientData } from "./client-data";
import type { ClientBrief, GenerationData, RefineInput } from "./generator";

export interface ToolGenerateResult {
  output: unknown;
  model: string;
  costUsd: number;
  promptTokens: number;
  completionTokens: number;
}

/** Load the previous output for a refine request — only the owner can refine their own. */
export async function resolveRefine(
  body: Record<string, unknown>
): Promise<RefineInput | undefined> {
  const refineOutputId = body.refineOutputId;
  const instruction = body.refineInstruction;
  if (!refineOutputId || typeof instruction !== "string" || !instruction.trim()) {
    return undefined;
  }
  const user = (await cookies()).get("fp-auth")?.value || "unknown";
  const prev = await getOutput(Number(refineOutputId));
  if (!prev || prev.userName !== user) {
    throw new Error("Previous output not found");
  }
  return { instruction: instruction.trim(), previous: prev.output };
}

/**
 * Shared run path for tool API routes: enrich with the full client-data
 * snapshot (GSC + GA4 + PSI + Ahrefs via getClientData — tolerant, matched to
 * the portfolio, memoized 1h), generate, log usage, persist output.
 * Returns the saved output id.
 */
export async function runTool(opts: {
  toolSlug: string;
  brief: ClientBrief;
  refine?: RefineInput;
  generate: (brief: ClientBrief, data: GenerationData, refine?: RefineInput) => Promise<ToolGenerateResult>;
}): Promise<ToolGenerateResult & { outputId: number }> {
  const user = (await cookies()).get("fp-auth")?.value || "unknown";
  const started = Date.now();

  const client = opts.brief.website ? await getClientData(opts.brief.website) : null;
  const data: GenerationData = {
    psi: client?.psi ?? null,
    competitors: client?.ahrefs ?? null,
    gsc: client?.gsc ?? null,
    ga4: client?.ga4 ?? null,
    aiVisibility: client?.aiVisibility ?? null,
  };

  const result = await opts.generate(opts.brief, data, opts.refine);

  await logUsage({
    user,
    toolSlug: opts.toolSlug,
    action: opts.refine ? "refine" : "generate",
    durationMs: Date.now() - started,
    promptTokens: result.promptTokens,
    completionTokens: result.completionTokens,
    costUsd: result.costUsd,
  });

  const outputId = await saveOutput({
    user,
    toolSlug: opts.toolSlug,
    brief: opts.brief as unknown as Record<string, unknown>,
    output: result.output,
    model: result.model,
    costUsd: result.costUsd,
  });

  return { ...result, outputId };
}

/** List a user's saved outputs for a tool (GET handler). */
export async function listUserOutputs(toolSlug: string) {
  const user = (await cookies()).get("fp-auth")?.value;
  if (!user) return null;
  return listOutputs(user, toolSlug);
}
