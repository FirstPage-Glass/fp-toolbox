# FirstPage Hong Kong — AI & Automation Portfolio Dashboard

An internal stakeholder-facing dashboard that showcases the HK team's production AI pipelines and automation systems. Built with Next.js 16 + TypeScript + Tailwind CSS v4, backed by NocoDB as the single source of truth.

## Two Views

| View | Access | Pages | Nav |
|------|--------|-------|-----|
| **Toolbox View** (default, no login) | `/toolbox`, `/login` | Live tool directory only | Toolbox · **Login** |
| **System View** (logged in) | All pages | Overview, Systems, Toolbox, Stack, Detail pages | Overview · Toolbox · Our Systems · Stack · **Logout** |

**Credentials:**
```
user: firstpage
pass: TYRRs61MwW7vWR1M2i6EFJB9HCL7t5Eu
```

## Quick Start

```bash
# Install dependencies (requires pnpm)
pnpm install

# Development server
pnpm dev
# → http://localhost:3000

# Production build
pnpm build

# Start production server
pnpm start
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Data | NocoDB (live API) |
| Auth | Cookie-based middleware + API routes |
| Package Manager | pnpm |

## Project Structure

```
├── app/
│   ├── page.tsx                  # Executive Overview (NocoDB-driven)
│   ├── layout.tsx                # Root layout with auth-aware NavBar
│   ├── login/page.tsx            # Login form
│   ├── toolbox/page.tsx          # Live tool directory (client-side NocoDB fetch)
│   ├── systems/page.tsx          # Full system inventory (client-side NocoDB fetch)
│   ├── architecture/page.tsx     # Tech Stack aggregation (server-side NocoDB fetch)
│   ├── projects/[slug]/page.tsx  # Dynamic detail pages (ISR, NocoDB-driven)
│   ├── api/login/route.ts        # Auth endpoint
│   ├── api/logout/route.ts       # Logout endpoint
│   └── components/NavBar.tsx     # Auth-aware navigation
├── lib/
│   ├── nocodb.ts                 # NocoDB API client — PRIMARY DATA SOURCE
│   ├── data.ts                   # Legacy static fallback (do not use for new data)
│   └── unified-tools.ts          # NocoDB → UnifiedTool adapter
├── middleware.ts                 # Route-level auth guard
├── next.config.ts                # distDir: 'dist'
└── .env.local                    # Secrets (NocoDB tokens, auth credentials)
```

## Data Architecture

### NocoDB is the single source of truth

All live pages read from NocoDB. `lib/data.ts` is legacy fallback only — **do not edit it for new systems**.

**NocoDB config:**
- Base: `p9ri10dzcq5d71l`
- Table: `m84ca9736466jfm` (Tools)
- Fields: `name`, `description`, `category`, `status`, `tech_stack`, `slug`, `tagline`, `before`, `after`, `flow`, `impact`, `hours_saved_per_month`, `cost_saved_per_month`, `volume_per_month`, `uptime`, `since`, `ai_models`, `serve`, `cover_image`, `type`, `live_link`, `gh_link`, etc.

### Adding a new system

1. Create a new record in the NocoDB Tools table
2. Set a unique URL-friendly `slug`
3. Fill in all fields (tagline, before/after/flow/impact, metrics, serve, type, etc.)
4. Rebuild: `pnpm build`

No code changes needed — the detail page auto-generates from the slug via `generateStaticParams()`.

## Current Systems (16 total)

### Active / Production

| System | Category | Impact |
|--------|----------|--------|
| Overdue Invoice Reports | Reporting | 3h/mo saved |
| FP FAQ Schema Generator | Utility | 10h/mo, 125 entries in 2 months |
| Lovable Landing Page Pipeline | Automation | 2h/mo |
| Content Brief Generate | Automation | 40h/mo, HK$12,000/mo |
| TD Generator MVP | Automation | 4h/mo |
| PBN Content Automation | System | 8h/mo, 900 links/mo |
| CX FAQ n8n Workflows | Content | 33h/mo, HK$9,900/mo |
| Invoice Review System | System | 1h/mo |
| Proposal Advisory System | Utility | 4h/mo |
| CX OD URLs Generator | Automation | 2h/mo, GSC URL generation |

### Building / Prototype / Refactoring

| System | Status | Notes |
|--------|--------|-------|
| Blog Upload Automation | Building | 180+ WP sites, NocoDB page builder detection |
| Toolbox Dashboard | Building | This app — meta-tool portal |
| Invoice List for AM Review | Prototype | Monthly dedup + AM distribution |
| Invoice List Twice Monthly | Prototype | AM status review |
| CX FAQ Paraphrase Pipeline | Refactoring | Hermes Agent successor to 9 n8n workflows |

## Environment Variables

Copy `.env.local` and fill in:

```bash
# NocoDB
NOCODB_URL=https://nocodb.firstpage.com.hk
NOCODB_API_TOKEN=your_token
NOCODB_TOOLS_BASE_ID=p9ri10dzcq5d71l
NOCODB_TOOLS_TABLE_ID=m84ca9736466jfm

# Auth
AUTH_USER=firstpage
AUTH_PASS=TYRRs61MwW7vWR1M2i6EFJB9HCL7t5Eu
```

## Deployment

This app requires a **Next.js server** — do not deploy to pure static hosts (GitHub Pages, S3 static hosting). Middleware, API routes, and auth will not work.

**Supported hosts:**
- Vercel (recommended)
- Node.js server + Docker
- Any platform with Next.js serverless function support

```bash
pnpm build
# Deploy the dist/ folder
```

## Key Features

- **NocoDB-driven**: All data lives in NocoDB — no code changes needed to add/update systems
- **ISR on detail pages**: `revalidate: 300` — new slugs picked up within 5 minutes
- **Auth middleware**: Cookie-based, two-view access control
- **Tech Stack aggregation**: Automatically parses `tech_stack` from all systems
- **Team coverage**: Dynamic from `serve` MultiSelect field
- **HKD currency**: All monetary values displayed in HK$
