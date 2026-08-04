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
| `/` | Server | Yes | Postgres usage stats |
| `/toolbox` | Server | No | `lib/registry.ts` (code) |
| `/tools/pitch-deck` | Client | Yes | OpenRouter + PSI + Ahrefs |
| `/tools/proposal` | Client | Yes | OpenRouter + PSI + Ahrefs |
| `/presentation` | Server | Yes | Postgres usage stats |
| `/login` | Client | No | — |
| `/api/login`, `/api/logout` | API | No | `AUTH_USERS` env |
| `/api/tools/<slug>` | API | Yes (cookie) | GET = history list, POST = generate/refine |
| `/api/hubspot/recent-leads` | API | Yes (cookie) | HubSpot contacts, spam-filtered + 1h cache |

- Server components are the default; mark `"use client"` only when state, effects, or browser APIs are required.
- **Never put API keys in client components** — OpenRouter/Ahrefs keys are server-side only (`lib/`).
- `NavBar` renders a minimal placeholder until mount (`mounted === false`) to avoid hydration mismatch from reading `document.cookie`. Preserve this pattern.
- Auth flow: `/login` → `POST /api/login` → `fp-auth=<username>` cookie (1-week, `sameSite: strict`, `httpOnly: false` so NavBar can read it) → `proxy.ts` redirects unauthenticated users to `/toolbox`. `/toolbox`, `/login`, `/api/*` stay public.
- Adding a new tool: create `app/tools/<slug>/` (manifest + page) and register it in `lib/registry.ts`. See root AGENTS.md "Adding a New Tool".

## Work Guidance

- Layout max-width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Cards: `bg-white rounded-xl shadow-sm border border-slate-200`; hover: `hover:shadow-md hover:border-fp-300 transition-all`.
- Status badges: `bg-{color}-100 text-{color}-700`. Brand colors: `--color-fp-50` … `--color-fp-950` in `globals.css` (Tailwind v4 `@theme inline` — do not create a `tailwind.config.js`).
- Emoji icons as lightweight indicators; no icon library dependency.
- Helper functions for parsing NocoDB string fields (`parseTech`, `getStatusBadge`, `getCategoryColor`) are duplicated across page files — if you modify one, update all copies.
- `images.unoptimized: true` must stay in `next.config.ts`; build output goes to `dist/`, not `.next/`.

## Verification

- `pnpm build` — must pass (TypeScript strict + lint).
- `pnpm lint` — ESLint 9, `eslint-config-next`.
- No test framework exists.

## Child DOX Index

- No child AGENTS.md files under `app/`.
