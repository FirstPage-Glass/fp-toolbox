# app/ — App Router surface

## Purpose

Next.js App Router surface of the toolbox platform: pages, API routes, tool UIs, root layout, global styles, and the per-tool folders.

## Ownership

- Owns: `app/page.tsx` (metrics dashboard), `app/layout.tsx`, `app/globals.css`, route folders (`login/`, `toolbox/`, `presentation/`, `api/login/`, `api/logout/`, `api/tools/`), `app/tools/<slug>/` (tool folders: `tool.ts` manifest + `page.tsx`), `app/components/NavBar.tsx`, `app/favicon.ico`.
- Root owns: `proxy.ts` (auth guard; formerly `middleware.ts`, renamed in Next.js 16).
- Data fetching lives here, but data sources live in `lib/` (see `lib/AGENTS.md`).

## Local Contracts

Routing map:

| Route | Type | Auth | Data source |
|-------|------|------|-------------|
| `/` | Server | Yes | `lib/dashboard.ts` (HubSpot leads + deals/pipeline + usage events + firstpage MCP GA4/GSC/PSI + Ahrefs) + `lib/uptime.ts` (Site status) + `lib/ai-plans.ts` (AI-suggested action plans via OpenRouter, memoized 1h). Two sections (Website / Sales) with sticky `SectionNav`; `?days=7|30|90` range picker (default 30) |
| `/toolbox` | Server shell + client view | No | `lib/registry.ts` (code); client `ToolboxView` (components/toolbox/) handles search + category via `?q=&cat=` |
| `/tools/<slug>` | Client | Yes | per-tool API route; ~22 tools across SEO Research / SEO Technical / Sales / Content / Operations (see Child DOX below) |
| `/tools/onsite-audit` | Client | Yes | full-site audit: POST starts a background job → `jobId`, GET `?jobId=` polls progress → result, GET `?outputId=` loads a past saved run (+ its manual-action states), bare GET lists run history. Crawl via self-hosted browserless (`lib/onsite-audit/`) + GSC/GA4/PSI/Ahrefs + LLM summary; every run persists to `tool_outputs`. Manual actions are interactive (status select + notes) via `/api/tools/onsite-audit/actions` (POST upsert / GET by domain), keyed per client domain |
| `/presentation` | Server | Yes | Postgres usage stats |
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
- Build from `components/ui/` atoms: `Card` (white/slate), `StatCard` (KPI, fp tones for emphasis), `PageHeader` (page titles), `Badge` (static color map), `Button`/`Input` (client forms). Extend `components/ui/` rather than hand-copying card classes.
- Emoji icons as lightweight indicators; no icon library dependency. Brand colors: `--color-fp-50` … `--color-fp-950` in `globals.css` (Tailwind v4 `@theme inline` — do not create a `tailwind.config.js`).
- `images.unoptimized: true` must stay in `next.config.ts`; build output goes to `dist/`, not `.next/`.

## Verification

- `pnpm build` — must pass (TypeScript strict + lint).
- `pnpm lint` — ESLint 9, `eslint-config-next`.
- No test framework exists.

## Child DOX Index

- No child AGENTS.md files under `app/`.
