# lib/ — Data layer

## Purpose

All data access and tool logic: tool registry, LLM + data-source clients, Postgres usage metrics, and content loading.

## Ownership

- `lib/registry.ts` — static tool registry (code = source of truth). Add a tool manifest here.
- `lib/llm.ts` — OpenRouter client (`OPENROUTER_API`), default model `deepseek/deepseek-v4-flash-0731`.
- `lib/generator.ts` — shared Pitch Deck / Proposal generation pipeline (brief → prompt → LLM → structured output).
- `lib/psi.ts` — PageSpeed Insights wrapper (free API).
- `lib/ahrefs.ts` — Ahrefs API v3 wrapper (`AHREFS_API_KEY`).
- `lib/db.ts` — Postgres pool (`DATABASE_URL`).
- `lib/usage.ts` — `logUsage()` + `getUsageStats()` for the `usage_events` table.
- `lib/content.ts` — loads brand guide + case studies from `content/` as markdown.
- `lib/auth.ts` — `AUTH_USERS` env parsing + credential validation.
- `lib/nocodb.ts`, `lib/unified-tools.ts`, `lib/data.ts` — **legacy, retired**. No live page reads them; kept for reference only.

## Local Contracts

- **Code is the source of truth.** The tool registry is a static index of `app/tools/<slug>/tool.ts` manifests — no external DB for tool metadata, so the directory can never drift.
- **Postgres is the runtime store.** Usage events only. `CREATE TABLE IF NOT EXISTS` on first use — no migration framework (ponytail: fine at this scale).
- **Metrics are real.** Every tool API route must call `logUsage()` on each run (user from `fp-auth` cookie, tokens, cost). Never hand-claim numbers in dashboards.
- **Secrets stay server-side.** `OPENROUTER_API`, `AHREFS_API_KEY`, `DATABASE_URL` never reach client components.
- **Network calls are tolerant.** PSI/Ahrefs failures degrade gracefully (generation proceeds without them).
- LLM cost estimate uses a static price map in `llm.ts` — update from the OpenRouter dashboard when the key is live.

## Work Guidance

- Strict TypeScript; explicit return types on exported functions.
- New tool? Add manifest to `lib/registry.ts`, UI to `app/tools/<slug>/page.tsx`, API to `app/api/tools/<slug>/route.ts`.

## Verification

- `pnpm build` — must pass.
- No test framework installed yet (repo precedent: Vitest in the retired Proposal-Advisory prototype).

## Child DOX Index

- No child AGENTS.md files under `lib/`.
