# app/ — App Router surface

## Purpose

Next.js App Router surface of the toolbox platform: pages, API routes, tool UIs, root layout, global styles, and the per-tool folders.

## Ownership

- Owns: `app/page.tsx` (metrics dashboard), `app/layout.tsx`, `app/globals.css`, route folders (`login/`, `toolbox/`, `usage/`, `api/login/`, `api/logout/`, `api/tools/`), `app/tools/<slug>/` (tool folders: `tool.ts` manifest + `page.tsx`), `app/components/NavBar.tsx`, `app/favicon.ico`.
- Root owns: `proxy.ts` (auth guard; formerly `middleware.ts`, renamed in Next.js 16).
- Data fetching lives here, but data sources live in `lib/` (see `lib/AGENTS.md`).

## Local Contracts

Routing map:

| Route | Type | Auth | Data source |
|-------|------|------|-------------|
| `/` | Server | Yes | `lib/dashboard.ts` (`getWebsiteData` + `getSalesData` — HubSpot leads/deals/pipeline + usage events + firstpage MCP GA4/GSC/PSI + Ahrefs; independent fetches parallel) + `lib/uptime.ts` (Site status) + `lib/ai-plans.ts` (AI-suggested action plans via OpenRouter, memoized 1h, one shared call) + `lib/hubspot.ts` `getSpamReport(30)` (Lead Quality zone, memoized 10 min). **Streamed**: page shell (banner + sticky `SectionNav`) renders instantly; each zone streams in under its own `<Suspense>` (`ZoneSkeleton` fallback) as data arrives — zone fetchers are kicked off before the shell finishes; zone anchors (`#website`/`#sales`/`#lead-quality`) live outside the Suspense boundaries so `SectionNav` scrollspy keeps working while loading; the shared AI-plans promise (`AiPlanCards`) fills both zones' cards together; the pagehead portfolio line (`getClientsInventory`) streams in separately. Pagehead banner per `dashboard.html` (title + sub/submeta + `?days=` range picker), three sections (Website / Sales / Lead Quality); `?days=7|30|90` range picker (default 30) |
| `/toolbox` | Server shell + client view | No | `lib/registry.ts` (code); client `ToolboxView` (components/toolbox/) handles search + category via `?q=&cat=` |
| `/tools/<slug>` | Client | Yes | per-tool API route; 25 tools across SEO Research / SEO Technical / Sales / Content / Operations (see Child DOX below) |
| `/tools/onsite-audit` | Client | Yes | full-site audit: POST starts a background job → `jobId`, GET `?jobId=` polls progress → result, GET `?outputId=` loads a past saved run (+ its manual-action states), bare GET lists run history. Crawl via self-hosted browserless (`lib/onsite-audit/`) + GSC/GA4/PSI/Ahrefs + LLM summary; every run persists to `tool_outputs`. Manual actions are interactive (status select + notes) via `/api/tools/onsite-audit/actions` (POST upsert / GET by domain), keyed per client domain. Page follows its dedicated mockup `docs/design-ref/onsite-audit.html` (hero + run-card + progress + result stats/summary + manual checklist + verdict filters + collapsible sections + history) — not the generic tool-page header |
| `/usage` | Server | Yes | `lib/usage.ts` — tool runs / active users / LLM cost + per-tool run grid |
| `/login` | Client | No | — |
| `/api/login`, `/api/logout` | API | No | `AUTH_USERS` env |
| `/api/tools/<slug>` | API | Yes (cookie) | GET = picker options (data tools) or history list (LLM tools); POST = run / refine |
| `/api/hubspot/recent-leads` | API | Yes (cookie) | HubSpot contacts, spam-filtered + 1h cache |

- Server components are the default; mark `"use client"` only when state, effects, or browser APIs are required.
- **Never put API keys in client components** — OpenRouter/Ahrefs keys are server-side only (`lib/`).
- `NavBar` renders a minimal placeholder until mount (`mounted === false`) to avoid hydration mismatch from reading `document.cookie`. Preserve this pattern.
- Auth flow: `/login` → `POST /api/login` → `fp-auth=<username>` cookie (1-week, `sameSite: strict`, `httpOnly: false` so NavBar can read it) → `proxy.ts` redirects unauthenticated users to `/toolbox`. `/toolbox`, `/login`, `/api/*` stay public.
- Tool pages are thin: form + `useToolApi` + `ResultView` (data tools) or custom render + refine bar + `OutputHistory` (LLM tools). Cross-tool links use `prefillUrl` (`?url= ?domain= ?keyword= ?site= ?property= ?client=`) — see `components/AGENTS.md`.
- Adding a new tool: create `app/tools/<slug>/` (manifest + page), API route `app/api/tools/<slug>/route.ts`, and register the manifest in `lib/registry.ts`. Data tools call `runQuery`; LLM tools call `runLlmTool`. Job-based tools (long-running, e.g. `onsite-audit`) use a background job registry + client polling instead. See root AGENTS.md "Adding a New Tool".

## Work Guidance

- Layout max-width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Build from `components/ui/` atoms: `Card` (white/slate), `StatCard` (KPI, fp tones for emphasis), `PageHeader` (full-width blue-gradient banner; `ToolPageHeader` in `lib/tool-icons.tsx` for tool pages — SVG tile + meta chips), `Badge` (static color map), `Button`/`Input` (client forms). Extend `components/ui/` rather than hand-copying card classes.
- Tool icons are stroke SVGs from `lib/tool-icons.tsx` (`ToolIcon`); category colors via `categoryColorClass`/`categoryBgClass`/`categoryBarClass`. Brand tokens in `globals.css` (`@theme inline`): `navy`/`coral`/`blue`/`surface`/`muted`/`border` + `--grad-cta`/`--grad-banner`, plus the `fp-*` blue scale. Font is Open Sans (`--font-open-sans`). Tailwind v4 — do not create a `tailwind.config.js`.
- `images.unoptimized: true` must stay in `next.config.ts`; build output goes to `dist/`, not `.next/`.

## Verification

- `pnpm build` — must pass (TypeScript strict + lint).
- `pnpm lint` — ESLint 9, `eslint-config-next`.
- No test framework exists.

## Child DOX Index

- No child AGENTS.md files under `app/`.
