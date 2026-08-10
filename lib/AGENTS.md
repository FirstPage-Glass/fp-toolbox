# lib/ — Data layer

## Purpose

All data access and tool logic: tool registry, LLM + data-source clients, Postgres usage metrics, and content loading.

## Ownership

- `lib/registry.ts` — static tool registry (code = source of truth). Add a tool manifest here. `externalLink` marks standalone tools without an `app/tools/<slug>/` page (toolbox card links out).
- `lib/llm.ts` — OpenRouter client (`OPENROUTER_API`), default model `deepseek/deepseek-v4-flash-0731`.
- `lib/generator.ts` — shared Pitch Deck / Proposal generation pipeline (brief → prompt → LLM → structured output).
- `lib/psi.ts` — PageSpeed Insights wrapper (free API).
- `lib/ahrefs.ts` — Ahrefs API v3 wrapper (`AHREFS_API_KEY`): `getCompetitorKeywords()` + `getAiVisibility()` (AI-search citations per platform, 15 units/platform/call — dashboard memoizes 6h).
- `lib/db.ts` — Postgres pool (`DATABASE_URL`).
- `lib/usage.ts` — `logUsage()` + `getUsageStats(days?)` for the `usage_events` table (optional window; no arg = all-time for the presentation page).
- `lib/dashboard.ts` — aggregation for the `/` dashboard page: HubSpot leads + spam metrics, PSI/GA4/GSC via firstpage MCP, Ahrefs keywords + AI visibility, HubSpot deals/pipeline, usage events, client portfolio counts. `getDashboardData(days)` is range-parameterised (7/30/90, cache keys include the window). Deltas vs the previous window: **sum metrics (GSC clicks/impressions, spam, deals, usage) use exact non-overlapping windows; unique-user metrics (GA4 activeUsers, leads) fetch the previous window explicitly** — unique counts don't add across windows. GSC windows are exactly `days` calendar days each (`dataStartDate(days−1)` … `dataEndDate()` and `dataStartDate(2·days−1)` … `dataStartDate(days)`), fetched with `row_limit` 1000 so totals are site-wide, not top-25; spam-rate delta uses exact rates on both sides (not the rounded `spamRatePct`). External calls memoized 1h (Postgres-backed TTL cache via `lib/cache.ts`); every section degrades to `configured:false`/`error` instead of throwing. Targets from `DASHBOARD_TARGET_URL` / `DASHBOARD_TARGET_DOMAIN` / `DASHBOARD_GSC_SITE` / `DASHBOARD_GA4_PROPERTY`.
- `lib/hubspot-deals.ts` — HubSpot deals/pipeline client (`HUBSPOT_SERVICE_KEY`): `getDealsReport(days)` fetches deals created + closed in the window (with `hubspot_owner_id`), `aggregateDeals()` computes pipeline value / closed-won / funnel / per-owner leaderboard rows (unassigned → "Unassigned"). Fails soft on missing `deals.read` scope. Outcome uses `hs_is_closed` (not `hs_is_closed_won`, which is `"false"` for open deals too).
- `lib/hubspot-engagement.ts` — lead-quality cross-check: `getEngagementReport(days)` treats contacts with a window-created deal as real leads and lists those the static spam filter still flags (misclassified) + the patterns behind them. Notes were rejected as a signal: this env's notes are ~100% system templates ("Lead Assignment Report"). Fails soft; memoized 1h by the dashboard.
- `lib/insights.ts` — rule-driven dashboard takeaways (no LLM): `buildInsights(d)` emits 0–4 website + sales bullets (traffic/clicks/PSI deltas, spam rate, top sales rep) for the section headers.
- `lib/ai-plans.ts` — AI-suggested actionable plans for the dashboard: `buildAiPlans(d)` feeds `lib/llm.ts` a compact real-data snapshot (`buildDashboardSummary`) and parses a strict-JSON `{website, sales}` plan list (action/why/impact), memoized 1h via `lib/cache.ts`. Returns `null` (page falls back to rule-driven insights) when `OPENROUTER_API` is unset or the LLM/parse fails.
- `lib/cache.ts` — shared TTL cache (`cached()`, default 1h, per-call TTL override) used by `dashboard.ts`/`mcp.ts`/`ai-plans.ts`/admin: in-memory Map short-circuit + **Postgres `cache_store` persistence** (survives dev-server restarts / HMR / multi-instance), failures memoized 60s (`{__error}`) so a refresh storm can't re-hit a rate-limited API; DB outage degrades to memory-only.
- `lib/mcp.ts` — firstpage MCP JSON-RPC client (`FP_MCP_API_KEY`, server-side only): `mcpCall` + typed helpers `getMcpPsi(url, strategy?)` (mobile default; desktop opt-in) / `getMcpGsc` (row_limit 1000 default — site-wide totals, not top-25) / `getMcpGa4` / `getMcpUrlInspection` (index status + mobile usability + rich results) / `getMcpInventory`. GA4 `property_id` is the bare numeric id; GSC needs YYYY-MM-DD.
- `lib/uptime.ts` — site-alive checker: `runUptimeCheck()` (HEAD, 15s timeout) + `getUptimeStats()` for the `uptime_checks` table; dashboard Site status panel.
- `lib/uptime-scheduler.ts` — background loop (probe on boot, then every 1 min) started by root `instrumentation.ts`; single-instance assumption, HMR-safe guard.
- `lib/content.ts` — loads brand guide + case studies from `content/` as markdown.
- `lib/auth.ts` — `AUTH_USERS` env parsing + credential validation.
- `lib/hubspot.ts` — HubSpot recent-leads client (`HUBSPOT_SERVICE_KEY`), spam filter (email domain must match website domain), paginated fetch, Postgres cache (1h TTL) via `getRecentLeads()` (cache reads are filtered by the requested day window); `fetchRecentLeads(days, sinceDaysAgo?)` supports an explicit previous-window fetch for deltas.
- `lib/outputs.ts` — `tool_outputs` persistence: saveOutput / listOutputs / getOutput.
- `lib/tool-runtime.ts` — shared tool API path for pitch-deck/proposal: client-data enrichment (via `getClientData`) + generate + logUsage + saveOutput + refine resolution.
- `lib/tool-api.ts` — shared tool API helpers for the ~20 tools: `runQuery()` (data-tool path: cookie attribution + logUsage, rethrows), `runLlmTool()` (LLM path: caller-supplied data → generate → logUsage → saveOutput → outputId), `getGscSites()` / `getGa4Properties()` (memoized portfolio pickers, tolerant `[]` on failure). Generate closures return `ToolLlmGenerate` (no outputId — runLlmTool attaches it).
- `lib/client-data.ts` — shared client data aggregator: `getClientData(url)` collects GSC (30d totals + top-8 queries) + GA4 (30d totals + trend) + PSI + Ahrefs keywords + AI visibility in one tolerant, portfolio-matched (hostname/display-name), memoized 1h call. Never throws. Used by meeting-prep, monthly-report and pitch-deck/proposal.
- `lib/nocodb.ts`, `lib/unified-tools.ts`, `lib/data.ts` — **legacy, retired**. No live page reads them; kept for reference only.

## Local Contracts

- **Code is the source of truth.** The tool registry is a static index of `app/tools/<slug>/tool.ts` manifests — no external DB for tool metadata, so the directory can never drift.
- **Postgres is the runtime store.** Usage events only. `CREATE TABLE IF NOT EXISTS` on first use — no migration framework (ponytail: fine at this scale).
- **Metrics are real.** Every tool API route must call `logUsage()` on each run (user from `fp-auth` cookie, tokens, cost). Never hand-claim numbers in dashboards.
- **Every generation is persisted** to `tool_outputs` (brief + output JSON) — history, reload, and refine all read from it. Refine is owner-only.
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
