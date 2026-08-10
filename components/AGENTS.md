# components/ — Reusable UI components

## Purpose

Reusable toolbox UI components shared by the client-side pages.

## Ownership

- `components/toolbox/ToolSearch.tsx` — search input with icon.
- `components/toolbox/ToolCard.tsx` — tool card: cover image, badges, links.
- `components/toolbox/ToolGrid.tsx` — responsive grid with empty state.
- `components/toolbox/CategoryFilter.tsx` — horizontal category filter buttons.
- `components/tools/BriefForm.tsx` — shared client-brief form used by Pitch Deck and Proposal tools.
- `components/tools/HubSpotLeads.tsx` — right-rail HubSpot lead picker (prefills the brief).
- `components/tools/OutputHistory.tsx` — saved-output history list (reload a previous generation).
- `components/dashboard/` — `/` dashboard widgets: `MetricCard.tsx` (KPI + `DeltaBadge`) + `UnconfiguredNotice.tsx` + `DeltaBadge.tsx` + `InsightList.tsx` + `SectionHeader.tsx` (accent bar + range picker + takeaways) + `AiPlanList.tsx` (AI-suggested action plans; renders nothing when null) + `SectionNav.tsx` (sticky scrollspy nav) + `RangePicker.tsx` (7/30/90d links) + `WebsiteSection.tsx` / `SalesSection.tsx` (the two dashboard halves; server, data from `lib/dashboard.ts` + `lib/ai-plans.ts` via the page), `LeadTrendChart.tsx`, `LeadScoreChart.tsx`, `KeywordBarChart.tsx`, `TrafficTrendChart.tsx` (recharts, `"use client"`, pure props), `SearchPerformanceTable.tsx` (server, GSC top queries).
- Page-local components (e.g. `NavBar`) live next to their pages in `app/`, not here.

## Local Contracts

- Import via the `@/*` alias (`@/components/toolbox/ToolCard`).
- Mixed rendering: `components/dashboard/` widgets are server components (recharts charts are the `"use client"` exception); `components/toolbox/` and `components/tools/` are client components. Keep server components the default per `app/AGENTS.md`.
- No icon library — emoji icons are the convention.

## Work Guidance

- Tailwind v4 only (no `tailwind.config.js`). Card pattern: `bg-white rounded-xl shadow-sm border border-slate-200`; hover: `hover:shadow-md hover:border-fp-300 transition-all`; status badges: `bg-{color}-100 text-{color}-700`.

## Verification

- `pnpm build` — must pass.
- No test framework exists.

## Child DOX Index

- No child AGENTS.md files under `components/`.
