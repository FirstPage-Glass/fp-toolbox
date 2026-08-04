# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

When the user requests a durable behavior change, record it here or in the relevant child AGENTS.md

## Child DOX Index

- `app/AGENTS.md` — App Router surface: pages, API routes, routing/auth rules. Owns everything under `app/`.
- `lib/AGENTS.md` — Data layer: NocoDB client, unified-tools adapter, static data. Owns everything under `lib/`.
- `components/AGENTS.md` — Reusable toolbox UI components. Owns everything under `components/`.
- Root-owned: `middleware.ts`, config files (`next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`), `public/`, `README.md`, `.env` / `.env.local` (secrets, not committed), `.opencode/`.

---

# AGENTS.md — FirstPage HK AI & Automation Portfolio Dashboard

This file contains project-specific context for AI coding agents. Read this before making any changes.

---

## Project Overview

This is the **FirstPage Hong Kong AI & Automation Portfolio Dashboard** — an internal stakeholder-facing web application that showcases the team's production AI pipelines and automation systems.

It serves two primary audiences:
- **External stakeholders / executives** (the "boss view") — sees high-level ROI metrics, business impact, and architecture overview
- **Internal team** (the "system view") — sees full system inventory, live tool directory, tech stack breakdown, and individual project detail pages

The app is a Next.js server-rendered application that fetches live data from NocoDB at build time (ISR) and runtime. It requires a Next.js server to run (not a static export) because it uses middleware, API routes, and cookie-based authentication.

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.4 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 (v4 with `@import "tailwindcss"`) |
| Build Tool | PostCSS with `@tailwindcss/postcss` | ^4 |
| Package Manager | pnpm | (workspace declared in `pnpm-workspace.yaml`) |
| Linter | ESLint | ^9 with `eslint-config-next` |

---

## Project Structure

```
.
├── app/                          # Next.js App Router (all pages + API routes)
│   ├── page.tsx                  # Homepage / Executive Overview (live NocoDB metrics)
│   ├── layout.tsx                # Root layout with header, footer, NavBar
│   ├── globals.css               # Tailwind import + FirstPage brand color theme
│   ├── login/page.tsx            # Login form (client component)
│   ├── toolbox/page.tsx          # Live tool directory (client component, fetches NocoDB)
│   ├── systems/page.tsx          # Full system inventory grid (client component, fetches NocoDB)
│   ├── architecture/page.tsx     # Tech stack aggregation page (server component, fetches NocoDB)
│   ├── projects/[slug]/page.tsx  # Dynamic project detail pages (server component, fetches NocoDB)
│   ├── ai-projects/page.tsx      # AI project listing (static data from lib/data.ts)
│   ├── automation-projects/page.tsx  # Automation project listing (static data)
│   ├── api/login/route.ts        # POST /api/login — cookie-based auth
│   ├── api/logout/route.ts       # POST /api/logout — clears auth cookie
│   └── components/NavBar.tsx     # Auth-aware navigation (client component)
│
├── components/toolbox/           # Reusable toolbox UI components
│   ├── ToolSearch.tsx            # Search input with icon
│   ├── ToolCard.tsx              # Individual tool card with cover image, badges, links
│   ├── ToolGrid.tsx              # Responsive grid layout with empty state
│   └── CategoryFilter.tsx        # Horizontal category filter buttons
│
├── lib/                          # Data layer and utilities
│   ├── data.ts                   # STATIC project data + types + helper functions
│   ├── nocodb.ts                 # NocoDB API client — primary live data source
│   └── unified-tools.ts          # Adapter layer: normalizes NocoDB records into UnifiedTool objects
│
├── middleware.ts                 # Route-level auth guard (cookie check + redirects)
├── next.config.ts                # distDir: 'dist', images.unoptimized: true
├── postcss.config.mjs            # @tailwindcss/postcss plugin
├── eslint.config.mjs             # Next.js core-web-vitals + typescript rules
└── .env.local                    # Secrets (NocoDB tokens, auth credentials)
```

### Important Path Alias

`@/*` maps to `./*` in `tsconfig.json`. Use `@/lib/nocodb`, `@/components/toolbox/ToolCard`, etc.

---

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production (output goes to dist/)
pnpm build

# Start production server
pnpm start
# OR serve the dist/ folder with a Next.js-compatible host

# Run linter
pnpm lint
```

### Build Output

The project uses a **custom build directory**: `dist/` (not `.next/`). This is configured in `next.config.ts`.

The `dist/` folder contains a Next.js server build (not a static export). Deploy it to a host that supports Next.js server rendering: Vercel, Node.js server, Docker, etc.

`images.unoptimized: true` is set to avoid dependency on the Next.js Image Optimization API.

---

## Data Architecture

### Data Sources (current)

1. **Code = source of truth** — tool registry (`lib/registry.ts`) is a static index of `app/tools/<slug>/tool.ts` manifests. Adding a tool = one folder + one import line. No drift possible.
2. **Postgres** — runtime data: `usage_events` table (user, tool, tokens, cost) via `lib/usage.ts` / `lib/db.ts`. `DATABASE_URL` env. Dev: podman `postgres:18-alpine`.
3. **External APIs** — OpenRouter (`lib/llm.ts`, `OPENROUTER_API`), PageSpeed Insights (`lib/psi.ts`, free), Ahrefs (`lib/ahrefs.ts`, `AHREFS_API_KEY`).
4. **Content** — brand guide + case studies as markdown in `content/` (`lib/content.ts`), fed into the deck/proposal generation.
5. **NocoDB (legacy, retired)** — `lib/nocodb.ts` and `lib/data.ts` remain for reference only; no live page reads them. NocoDB is no longer the source of truth.

---

## Authentication

### How It Works

The app uses **per-user cookie authentication**:

- **Public**: `/toolbox`, `/login`, `/api/*` — no login required
- **Protected**: `/`, `/presentation`, `/tools/*` — requires login

### Auth Flow

1. User submits credentials on `/login` → `POST /api/login`
2. Server validates against `AUTH_USERS` env (comma-separated `name:password` pairs)
3. On success, sets `fp-auth=<username>` cookie (1-week expiry, `sameSite: strict`)
4. `middleware.ts` checks the cookie on every request
5. Unauthenticated users hitting protected routes are redirected to `/toolbox`
6. Logout clears the cookie via `POST /api/logout`
7. The cookie value is the username — used for usage attribution in `usage_events`

### Auth Environment Variables

| Variable | Example |
|----------|---------|
| `AUTH_USERS` | `glass:pass,wing:pass2` |

**Security note**: Simple credential scheme for an internal team. Not robust auth — do not expose sensitive tools behind it alone.

---

## Routing & Pages

| Route | Type | Auth Required | Data Source |
|-------|------|---------------|-------------|
| `/` | Server | Yes | Postgres usage stats |
| `/toolbox` | Server | No | `lib/registry.ts` (code) |
| `/tools/pitch-deck` | Client | Yes | OpenRouter + PSI + Ahrefs |
| `/tools/proposal` | Client | Yes | OpenRouter + PSI + Ahrefs |
| `/presentation` | Server | Yes | Postgres usage stats |
| `/login` | Client | No | — |
| `/api/login` | API | No | `AUTH_USERS` env |
| `/api/logout` | API | No | — |
| `/api/tools/pitch-deck` | API | Yes (cookie) | generator + data |
| `/api/tools/proposal` | API | Yes (cookie) | generator + data |

---

## Code Style Guidelines

### TypeScript
- Strict mode is enabled (`"strict": true` in `tsconfig.json`)
- Use explicit return types on exported functions in `lib/`
- React components use `Readonly<Props>` where applicable

### React Conventions
- Server components are the default; mark client components with `"use client"` only when needed (state, effects, browser APIs)
- `NavBar`, `ToolSearch`, `ToolGrid`, `ToolCard`, `CategoryFilter`, `LoginPage`, `ToolboxPage`, and `SystemsPage` are all client components
- `page.tsx` (home), `architecture/page.tsx`, and `projects/[slug]/page.tsx` are server components that fetch data directly

### Styling
- Tailwind CSS v4 with inline theme configuration in `globals.css`
- FirstPage brand colors are defined as `--color-fp-50` through `--color-fp-950`
- Common patterns:
  - Cards: `bg-white rounded-xl shadow-sm border border-slate-200`
  - Status badges: color-coded with `bg-{color}-100 text-{color}-700`
  - Hover effects: `hover:shadow-md hover:border-fp-300 transition-all`
  - Layout max-width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Component Patterns
- Helper functions for parsing NocoDB string fields are duplicated across files (e.g., `parseTech`, `getStatusBadge`, `getCategoryColor`). If you modify one, check if others need updating too.
- Emoji icons are used as lightweight visual indicators (no icon library dependency).

---

## Testing

**There are currently no tests in this project.** No test runner (Jest, Vitest, Playwright, Cypress) is installed or configured.

If you add tests:
- Install a test runner as a dev dependency
- Add test scripts to `package.json`
- Create `__tests__/` directories or `*.test.ts` / `*.spec.ts` files alongside source files

---

## CI/CD & Deployment

**There is no CI/CD configuration.** No `.github/workflows/`, `Dockerfile`, or other automation exists.

### Manual Deployment Process

1. Ensure `.env.local` has the correct NocoDB and auth credentials
2. Run `pnpm build`
3. Deploy the `dist/` folder to a Next.js-compatible host (Vercel, Node.js server, Docker)

### Environment Variables for Production

Make sure these are set in your hosting environment:
- `AUTH_USERS` — per-user credentials (`name:pass,name2:pass2`)
- `DATABASE_URL` — Postgres connection (usage events + tool outputs + leads cache)
- `OPENROUTER_API` — OpenRouter key for deck/proposal generation
- `AHREFS_API_KEY` — competitor data for the deck pipeline
- `HUBSPOT_SERVICE_KEY` — HubSpot private app token for recent-leads import
- A Postgres service must be provisioned (Coolify container; schema auto-creates on first use)

---

## Security Considerations

1. **Hardcoded fallback credentials**: `app/api/login/route.ts` has a fallback password in source code. Override with `AUTH_PASS` env var in production.
2. **NocoDB API token exposure**: The token is used in server-side fetches. Do NOT pass it to client components.
3. **Cookie is not httpOnly in client-side NavBar**: The auth cookie is read by client-side JavaScript in `NavBar.tsx` to show/hide navigation. The `httpOnly` flag is set to `false` in the login route to allow this.
4. **No HTTPS enforcement**: The auth cookie sets `secure: true` only in production (`NODE_ENV === 'production'`). Ensure production deployments use HTTPS.
5. **Server deployment required**: This app requires a Next.js server. Do not deploy to pure static hosts (GitHub Pages, S3 static hosting) — middleware, API routes, and auth will not work. Use Vercel, a Node.js server, or Docker.

---

## Adding a New Tool

1. Create `app/tools/<slug>/tool.ts` with a `ToolManifest` (slug, name, description, category, owner, status, icon)
2. Add the manifest to the static index in `lib/registry.ts` (one import + array entry)
3. Add `app/tools/<slug>/page.tsx` (the UI) and `app/api/tools/<slug>/route.ts` (server work — call `logUsage()` on every run)
4. Rebuild: `pnpm build` — the tool appears in `/toolbox` automatically

Content (case studies, brand guide) lives in `content/` as markdown — edit those to change deck/proposal material.

---

## Key Dependencies & Compatibility

- **Next.js 16** requires React 19. Do not downgrade React to 18.
- **Tailwind CSS v4** uses a new configuration style (`@import "tailwindcss"`, `@theme inline`) — do not use the old `tailwind.config.js` format.
- The project uses **pnpm**. Using npm or yarn may produce lockfile conflicts.

---

## Common Pitfalls

1. **Build fails with image optimization error**: Make sure `images.unoptimized: true` stays in `next.config.ts`.
2. **NocoDB fetch returns empty array**: Check that `NOCODB_API_TOKEN` and base/table IDs are correct. The client silently returns `[]` on error.
3. **Auth redirect loops**: If middleware redirects infinitely, check that `/toolbox` and `/login` are listed as public paths in `middleware.ts`.
4. **Hydration mismatch in NavBar**: `NavBar` renders a minimal placeholder on the server (`mounted === false`) to prevent hydration mismatches because it reads `document.cookie`.
5. **Dynamic project pages 404 at runtime**: The `generateStaticParams()` in `projects/[slug]/page.tsx` fetches slugs from NocoDB at build time, with `revalidate: 300` (5-minute ISR). New slugs added to NocoDB will be picked up automatically within 5 minutes in production. In dev mode, restart the server to see new slugs.

---

## OpenCode / ECC Integration

This project includes an **Everything Claude Code (ECC)** plugin configuration for OpenCode.

### Configuration

- **Config file**: `.opencode/opencode.json`
- **Plugins**: `.opencode/plugins/` (hook-based automations)
- **Agents**: `.opencode/prompts/agents/` (specialized subagents)
- **Commands**: `.opencode/commands/` (slash command templates)

### Available Commands

| Command | Description | Agent |
|---------|-------------|-------|
| `/plan` | Create implementation plan | planner |
| `/tdd` | TDD workflow (80%+ coverage) | tdd-guide |
| `/code-review` | Review code quality | code-reviewer |
| `/security` | Security audit | security-reviewer |
| `/build-fix` | Fix TypeScript/build errors | build-error-resolver |
| `/e2e` | Generate/run E2E tests | e2e-runner |
| `/refactor-clean` | Remove dead code | refactor-cleaner |
| `/update-docs` | Update documentation | doc-updater |

### Referenced Skills (External)

The following ECC skills are referenced from the external ECC installation:

- **coding-standards** — Naming, immutability, error handling, code quality
- **frontend-patterns** — React 19, Next.js, hooks, state management
- **security-review** — Auth, input validation, secrets management
- **tdd-workflow** — Test-driven development, 80%+ coverage
- **api-design** — REST conventions, response formats, error handling

### Setup

No additional setup required. The `.opencode/` directory is self-contained (324KB). Skills are loaded from the external ECC installation at `/home/glasschan/everything-claude-code/skills/`.


## Agent skills

### Issue tracker

Issues and PRDs live as GitHub issues in this repo. Use the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical labels map by name: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
