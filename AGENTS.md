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
| Package Manager | pnpm | **enforced — npm/yarn/bun blocked** |
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

### Two Data Sources

1. **NocoDB (primary, live)** — `lib/nocodb.ts`
   - Fetches tool/system records from a NocoDB instance at build time and runtime
   - Data is cached with `next: { revalidate: 300 }` (5-minute ISR-like revalidation)
   - Homepage (`page.tsx`), Systems, Toolbox, Architecture, and project detail pages all consume this
   - Schema fields: `name`, `description`, `category`, `status`, `tech_stack`, `slug`, `live_link`, `gh_link`, `tagline`, `before`, `after`, `flow`, `impact`, `hours_saved_per_month`, `cost_saved_per_month`, `volume_per_month`, `uptime`, `since`, `ai_models`, `serve`, `cover_image`, `owner`, `priority`, `type`, etc.

2. **Static TypeScript (legacy / reference)** — `lib/data.ts`
   - Contains hardcoded `Project` objects with similar schema
   - Still used by the old `ai-projects` / `automation-projects` pages (kept for backwards compatibility)
   - **CRITICAL**: `lib/data.ts` is NOT the source of truth. All live pages (Overview, Systems, Toolbox, Architecture, Detail pages) read from NocoDB. When adding or updating systems, always update NocoDB first. Only update `lib/data.ts` if you explicitly need static fallback data.

### NocoDB Environment Variables

| Variable | Purpose |
|----------|---------|
| `NOCODB_URL` | NocoDB instance URL (default: `https://nocodb.firstpage.com.hk`) |
| `NOCODB_API_TOKEN` | API token for authentication |
| `NOCODB_TOOLS_BASE_ID` | Base ID for the tools database |
| `NOCODB_TOOLS_TABLE_ID` | Table ID for the tools table |

All variables fall back to `NEXT_PUBLIC_*` variants if the direct ones are not set.

---

## Authentication

### How It Works

The app uses **simple cookie-based authentication** with two views:

- **Toolbox View** (`/toolbox`, `/login`, `/api/*`) — always public, no login required
- **System View** (`/`, `/systems`, `/architecture`, `/projects/*`) — requires login

### Auth Flow

1. User submits credentials on `/login` → `POST /api/login`
2. Server validates against `AUTH_USER` / `AUTH_PASS` env vars
3. On success, sets `fp-auth=authenticated` cookie (1-week expiry, `sameSite: strict`)
4. `middleware.ts` checks the cookie on every request
5. Unauthenticated users hitting protected routes are redirected to `/toolbox`
6. Logout clears the cookie via `POST /api/logout`

### Auth Environment Variables

| Variable | Default |
|----------|---------|
| `AUTH_USER` | `firstpage` |
| `AUTH_PASS` | `TYRRs61MwW7vWR1M2i6EFJB9HCL7t5Eu` |

**Security note**: This is a simple hardcoded credential scheme suitable for internal stakeholder demos. It is NOT a robust authentication system. Do not expose sensitive internal tools behind this auth alone.

---

## Routing & Pages

| Route | Type | Auth Required | Data Source |
|-------|------|---------------|-------------|
| `/` | Server | Yes | NocoDB |
| `/toolbox` | Client | No | NocoDB (client-side fetch) |
| `/systems` | Client | Yes | NocoDB (client-side fetch) |
| `/architecture` | Server | Yes | NocoDB |
| `/projects/[slug]` | Server | Yes | NocoDB |
| `/login` | Client | No | — |
| `/ai-projects` | Server | Yes | `lib/data.ts` (static) |
| `/automation-projects` | Server | Yes | `lib/data.ts` (static) |
| `/api/login` | API | No | — |
| `/api/logout` | API | No | — |

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
- `NOCODB_URL`
- `NOCODB_API_TOKEN`
- `NOCODB_TOOLS_BASE_ID`
- `NOCODB_TOOLS_TABLE_ID`
- `AUTH_USER` (optional, has default)
- `AUTH_PASS` (optional, has default)

---

## Security Considerations

1. **Hardcoded fallback credentials**: `app/api/login/route.ts` has a fallback password in source code. Override with `AUTH_PASS` env var in production.
2. **NocoDB API token exposure**: The token is used in server-side fetches. Do NOT pass it to client components.
3. **Cookie is not httpOnly in client-side NavBar**: The auth cookie is read by client-side JavaScript in `NavBar.tsx` to show/hide navigation. The `httpOnly` flag is set to `false` in the login route to allow this.
4. **No HTTPS enforcement**: The auth cookie sets `secure: true` only in production (`NODE_ENV === 'production'`). Ensure production deployments use HTTPS.
5. **Server deployment required**: This app requires a Next.js server. Do not deploy to pure static hosts (GitHub Pages, S3 static hosting) — middleware, API routes, and auth will not work. Use Vercel, a Node.js server, or Docker.

---

## Adding a New System

### Preferred method (NocoDB)

1. Add the new record to the NocoDB `Tools` table with all fields populated
2. Ensure `slug` is URL-friendly and unique
3. No code changes needed — detail page auto-generates from slug
4. Rebuild: `pnpm build`

### Legacy method (static data)

1. Edit `lib/data.ts`
2. Add a new `Project` object to the `projects` array
3. Update `teamImpact` if applicable
4. Rebuild: `pnpm build`

---

## Package Manager

**pnpm is the only allowed package manager.** Do not use `npm`, `yarn`, or `bun` — they are blocked by a `preinstall` hook and will fail. All install, add, remove, and run commands must go through `pnpm`.

## Key Dependencies & Compatibility

- **Next.js 16** requires React 19. Do not downgrade React to 18.
- **Tailwind CSS v4** uses a new configuration style (`@import "tailwindcss"`, `@theme inline`) — do not use the old `tailwind.config.js` format.

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
