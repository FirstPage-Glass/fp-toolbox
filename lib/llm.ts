const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
export const DEFAULT_MODEL = "deepseek/deepseek-v4-flash-0731";

export interface CompletionResult {
  text: string;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  model: string;
}

// ponytail: prices per 1M tokens, update from OpenRouter dashboard when the key is live.
const PRICES: Record<string, { input: number; output: number }> = {
  "deepseek/deepseek-v4-flash-0731": { input: 0.3, output: 0.6 },
};

function priceFor(model: string) {
  return PRICES[model] ?? { input: 0.3, output: 0.6 };
}

export async function complete(opts: {
  system: string;
  user: string;
  model?: string;
}): Promise<CompletionResult> {
  const model = opts.model || DEFAULT_MODEL;
  const apiKey = process.env.OPENROUTER_API || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API not configured");
  }
  const started = Date.now();
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`OpenRouter error ${res.status}: ${JSON.stringify(data).slice(0, 500)}`);
  }
  const text = data.choices?.[0]?.message?.content ?? "";
  const promptTokens = data.usage?.prompt_tokens ?? 0;
  const completionTokens = data.usage?.completion_tokens ?? 0;
  const p = priceFor(model);
  const costUsd = (promptTokens / 1e6) * p.input + (completionTokens / 1e6) * p.output;
  void started;
  return { text, promptTokens, completionTokens, costUsd, model };
}
