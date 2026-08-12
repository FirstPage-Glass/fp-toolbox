# lib/ — Data layer

## Purpose

All data access and tool logic: tool registry, LLM + data-source clients, Postgres usage metrics, and content loading.

## Ownership

- `lib/registry.ts` — static tool registry (code = source of truth). Add a tool manifest here. `externalLink` marks standalone tools without an `app/tools/<slug>/` page (toolbox card links out).
- `lib/tool-icons.tsx` — tool **stroke-SVG icon map** keyed by tool name (ported from `docs/design-ref/`), `ToolIcon` renderer, category color/bg/bar class helpers (`categoryColorClass`/`categoryBgClass`/`categoryBarClass`, `categoryColorValue` for inline styles), and the `ToolPageHeader` banner component used by every tool page.
- `lib/llm.ts` — OpenRouter client (`OPENROUTER_API`), default model `deepseek/deepseek-v4-flash-0731`.
- `lib/generator.ts` — shared Pitch Deck / Proposal generation pipeline (brief → prompt → LLM → structured output).
- `lib/psi.ts` — **deleted (2026-08)**: Google's public PageSpeed Insights REST API v5 was decommissioned (404). All PSI data now comes from `getMcpPsi` (firstpage MCP, own key) — see `lib/mcp.ts`.
- `lib/ahrefs.ts` — Ahrefs API v3 wrapper (`AHREFS_API_KEY`): `getCompetitorKeywords()` + `getAiVisibility()` (AI-search citations per platform, 15 units/platform/call — dashboard memoizes 6h).
- `lib/pdf.ts` — server-side HTML→PDF via browserless `/pdf` (`htmlToPdf(html, {landscape, format, margins})`). `POST /api/tools/pdf` is the shared endpoint; client side uses `components/tools/downloadPdf.ts` + `components/tools/pdfRenderers.ts` (inline-styled per-tool renderers — browserless renders standalone HTML, no Tailwind).
- `lib/screenshot.ts` — page screenshots via browserless `/screenshot` (`captureScreenshot(url, {width, height, fullPage})` → base64 PNG dataUrl). Used by the `page-screenshot` tool.
- `lib/render-diff.ts` — raw-fetch HTML vs browserless-rendered DOM comparison (`renderDiff(url)`) — title/meta/canonical/H1/text-length diff for JS-rendering SEO diagnosis. Used by the `render-diff` tool.
- `lib/db.ts` — Postgres pool (`DATABASE_URL`).
- `lib/usage.ts` — `logUsage()` + `getUsageStats(days?)` for the `usage_events` table (optional window; no arg = all-time for the `/usage` page).
- `lib/dashboard.ts` — aggregation for the `/` dashboard page, split per zone so the page streams each section independently: `getWebsiteData(days)` (PSI/GA4/GSC via firstpage MCP + Ahrefs keywords/AI visibility + website deltas) and `getSalesData(days)` (HubSpot leads + spam metrics, deals/pipeline, engagement, usage events + sales deltas) return the zone subsets `WebsiteData`/`SalesData`; `getClientsInventory()` (client portfolio counts) feeds the pagehead line. Range-parameterised (7/30/90, cache keys include the window). **Independent fetches run in parallel (`Promise.all`)** — GSC current/daily/previous windows and GA4 current/previous are fetched together, not serially. Deltas vs the previous window: **sum metrics (GSC clicks/impressions, spam, deals, usage) use exact non-overlapping windows; unique-user metrics (GA4 activeUsers, leads) fetch the previous window explicitly** — unique counts don't add across windows. GSC windows are exactly `days` calendar days each (`dataStartDate(days−1)` … `dataEndDate()` and `dataStartDate(2·days−1)` … `dataStartDate(days)`), fetched with `row_limit` 1000 so totals are site-wide, not top-25; spam-rate delta uses exact rates on both sides (not the rounded `spamRatePct`). `gsc.daily` (group_by=date, best-effort, memoized) feeds the Organic clicks KPI sparkline. External calls memoized 1h (Postgres-backed TTL cache via `lib/cache.ts`); every zone degrades to `configured:false`/`error` instead of throwing. Targets from `DASHBOARD_TARGET_URL` / `DASHBOARD_TARGET_DOMAIN` / `DASHBOARD_GSC_SITE` / `DASHBOARD_GA4_PROPERTY`.
- `lib/hubspot-deals.ts` — HubSpot deals/pipeline client (`HUBSPOT_SERVICE_KEY`): `getDealsReport(days)` fetches deals created + closed in the window (with `hubspot_owner_id`), `aggregateDeals()` computes pipeline value / closed-won / funnel / per-owner leaderboard rows (unassigned → "Unassigned"). Fails soft on missing `deals.read` scope. Outcome uses `hs_is_closed` (not `hs_is_closed_won`, which is `"false"` for open deals too).
- `lib/hubspot-engagement.ts` — lead-quality cross-check: `getEngagementReport(days)` treats contacts with a window-created deal as real leads and lists those the static spam filter still flags (misclassified) + the patterns behind them. Notes were rejected as a signal: this env's notes are ~100% system templates ("Lead Assignment Report"). Fails soft; memoized 1h by the dashboard.
- `lib/insights.ts` — rule-driven dashboard takeaways (no LLM): `buildWebsiteInsights(web)` / `buildSalesInsights(sales)` emit 0–4 bullets (traffic/clicks/PSI deltas, spam rate, top sales rep) for the zone headers.
- `lib/ai-plans.ts` — AI-suggested actionable plans for the dashboard: `buildAiPlans(web, sales)` feeds `lib/llm.ts` a compact real-data snapshot (`buildDashboardSummary`) and parses a strict-JSON `{website, sales}` plan list (action/why/impact), memoized 1h via `lib/cache.ts`. **ONE shared call feeds both zones** — the page combines both zone promises into a single `plansP`. Returns `null` (page falls back to rule-driven insights) when `OPENROUTER_API` is unset or the LLM/parse fails.
- `lib/cache.ts` — shared TTL cache (`cached()`, default 1h, per-call TTL override) used by `dashboard.ts`/`mcp.ts`/`ai-plans.ts`/admin: in-memory Map short-circuit + **Postgres `cache_store` persistence** (survives dev-server restarts / HMR / multi-instance), failures memoized 60s (`{__error}`) so a refresh storm can't re-hit a rate-limited API; DB outage degrades to memory-only.
- `lib/mcp.ts` — firstpage MCP JSON-RPC client (`FP_MCP_API_KEY`, server-side only): `mcpCall` + typed helpers `getMcpPsi(url, strategy?)` (mobile default; desktop opt-in; returns all 4 Lighthouse categories performance/accessibility/best-practices/seo + LCP/CLS/TBT/FCP) / `getMcpGsc` (row_limit 1000 default — site-wide totals, not top-25; optional `groupBy` for per-day series) / `getMcpGa4` / `getMcpUrlInspection` (index status + mobile usability + rich results) / `getMcpInventory`. GA4 `property_id` is the bare numeric id; GSC needs YYYY-MM-DD.
- `lib/uptime.ts` — site-alive checker: `runUptimeCheck()` (HEAD, 15s timeout) + `getUptimeStats()` for the `uptime_checks` table; dashboard Site status panel.
- `lib/uptime-scheduler.ts` — background loop (probe on boot, then every 5 min) started by root `instrumentation.ts`; single-instance assumption, HMR-safe guard.
- `lib/content.ts` — loads brand guide + case studies from `content/` as markdown.
- `lib/auth.ts` — `AUTH_USERS` env parsing + credential validation; `isAdminUser()` reads `ADMIN_USERS` (gateway admins).
- `lib/gateway/` — DeepSeek team-key gateway (OpenRouter BYOK hybrid: OpenRouter enforces per-key monthly limits, fp-toolbox manages teams/champions/alerting):
  - `db.ts` — `deepseek_teams` (name/champion/limit_usd/key_hash — **single active key per team** so per-key limit === team pool), `deepseek_usage_snapshots` (hourly BYOK spend), `deepseek_alerts_log` (dedupe UNIQUE(team_id, level, date_trunc('month', sent_at))); CREATE TABLE IF NOT EXISTS, same pattern as `lib/usage.ts`. Tables also mirrored in `db/init.sql`.
  - `openrouter.ts` — Management API client (`OPENROUTER_MANAGEMENT_KEY`): `createKey` (POST + PATCH `include_byok_in_limit: true`, `limit_reset: "monthly"` — BYOK spend counts against the key limit), `listKeys` (paginated; `byok_usage_monthly` is the spend source), `getKey`, `updateKey`, `deleteKey`. Plaintext key returned once, never stored.
  - `service.ts` — role checks (champion = `team.champion === username`, admin = `ADMIN_USERS`), `getTeamsView`, `issueTeamKey` (issues new + best-effort deletes previous), `revokeTeamKey`.
  - `alert-scheduler.ts` — hourly poll (`GATEWAY_POLL_MINUTES`, default 60) started by root `instrumentation.ts`: snapshot usage, push 80%/100% alerts to `SLACK_WEBHOOK_URL` + `deepseek_alerts_log` (in-app), deduped per team/level/month.
- `lib/hubspot.ts` — HubSpot recent-leads client (`HUBSPOT_SERVICE_KEY`), spam filter (email domain must match website domain), paginated fetch, Postgres cache (1h TTL) via `getRecentLeads()` (cache reads are filtered by the requested day window); `fetchRecentLeads(days, sinceDaysAgo?)` supports an explicit previous-window fetch for deltas.
- `lib/outputs.ts` — `tool_outputs` persistence: saveOutput / listOutputs / getOutput.
- `lib/tool-runtime.ts` — shared tool API path for pitch-deck/proposal: client-data enrichment (via `getClientData`) + generate + logUsage + saveOutput + refine resolution.
- `lib/tool-api.ts` — shared tool API helpers for the ~20 tools: `runQuery()` (data-tool path: cookie attribution + logUsage, rethrows), `runLlmTool()` (LLM path: caller-supplied data → generate → logUsage → saveOutput → outputId), `getGscSites()` / `getGa4Properties()` (memoized portfolio pickers, tolerant `[]` on failure). Generate closures return `ToolLlmGenerate` (no outputId — runLlmTool attaches it).
- `lib/client-data.ts` — shared client data aggregator: `getClientData(url)` collects GSC (30d totals + top-8 queries) + GA4 (30d totals + trend) + PSI + Ahrefs keywords + AI visibility in one tolerant, portfolio-matched (hostname/display-name), memoized 1h call. Never throws. Used by meeting-prep, monthly-report and pitch-deck/proposal.
- `lib/onsite-audit/` — full-site SEO audit engine (owns the "onsite-audit" tool):
  - `config.ts` — `BROWSERLESS_URL` / `BROWSERLESS_TOKEN` (self-hosted browserless), `ONSITE_MAX_PAGES` (default 50 — key pages only, 30-50 is enough), `ONSITE_CRAWL_CONCURRENCY` (default 8), crawl depth cap.
  - `crawler.ts` — BFS site crawl via browserless `/content` (plain `{url}` body — this version rejects `options`; don't add them) for JS-rendered HTML, plus Node fetch with `redirect: manual` for exact status codes + redirect chains. Falls back to raw fetch when `BROWSERLESS_URL` is unset. Returns pages (title/meta/H1/images/canonical/robots/json-ld/internal+external links), robots.txt + sitemap text.
  - `checklist.ts` — the full SEO Implementation Checklist as a data model; items tagged `auto` / `semi-auto` (LLM) / `manual`.
  - `collectors.ts` — `aggregateOnpage()` (titles/desc/H1/canonical/mixed-content/URL rules/status/schema/robots/sitemap signals) + `collectGsc` / `collectGa4` / `collectPsi` / `collectAhrefs` (all tolerant, null on failure). GSC/GA4 resolution (`resolveGscSite` / `resolveGa4Property`) matches the portfolio pickers by hostname; displayName may be a bare brand name (fallback: normalized first label, e.g. "Seafoodfriday" → seafoodfriday.hk). **Sites not in the MCP portfolio are skipped (verdict `n-a`), never a manual action.** hostnameOf handles `sc-domain:` prefixes and returns "" for unparseable hosts — never match an empty hostname (that caused wrong-site GSC/GA4 matches).
  - `engine.ts` — `runAudit(target, jobId, callbacks)` orchestrates crawl → collectors → verdict mapping → semi-auto LLM review → LLM summary; emits `AuditProgress` via callback. **Fails fast when the site is unreachable/blocking the crawler** (no 2xx page and no rendered content — e.g. 403) instead of emitting a meaningless audit. The `AuditResult` is self-contained (sections + summary + manualActions + llmSummary); the tool page renders it and builds the downloadable Markdown/JSON report client-side.
  - `jobs.ts` — in-memory job registry (`startAuditJob` / `getAuditJob`) for the long-running audit; single-instance assumption (same as `uptime-scheduler`), jobs don't survive restarts, **but every completed run is persisted to `tool_outputs`** (compact result via `compactResult()` — crawl detail omitted) so history survives restarts. `GET ?outputId=` loads a saved run; bare `GET` lists history.
  - `actions.ts` — manual-action tracking, **keyed by client domain** (`onsite_audit_actions` table, UNIQUE(domain, item_id)) so progress survives re-runs of the same site — one checklist per client, shared across users (user_name = last updater). Statuses: `pending | in-progress | done | n-a` (server-validated). `setAction()` upserts, `getActions(domain)` lists. Persisted alongside the run in the `GET ?outputId=` response.
- `lib/nocodb.ts`, `lib/unified-tools.ts`, `lib/data.ts` — **legacy, retired**. No live page reads them; kept for reference only.

## Local Contracts

- **Code is the source of truth.** The tool registry is a static index of `app/tools/<slug>/tool.ts` manifests — no external DB for tool metadata, so the directory can never drift.
- **Postgres is the runtime store.** Usage events + gateway tables. `CREATE TABLE IF NOT EXISTS` on first use — no migration framework (ponytail: fine at this scale).
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
