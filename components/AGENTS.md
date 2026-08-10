# components/ — Reusable UI components

## Purpose

Shared UI layers for the whole site: design-language atoms (`ui/`), the toolbox page (`toolbox/`), tool-page domain components (`tools/`), and dashboard widgets (`dashboard/`).

## Ownership

- `components/ui/` — **shared design-language atoms, consumed by every page.** `PageHeader.tsx` (title + count pill + description + trailing), `Card.tsx` (white/slate tones, `hover` lift, `noPadding` + `className`), `Badge.tsx` (static color map: fp/slate/emerald/blue/amber/rose/violet), `StatCard.tsx` (white / fp-800/700/600 tones, `size` md/lg), `SectionTitle.tsx` (heading + optional count), `EmptyState.tsx` (dashed empty block), `Button.tsx` (primary/secondary/brand, sm/md/lg), `Input.tsx` (labeled input), `Select.tsx` (labeled select), `Textarea.tsx` (labeled textarea), `ErrorBanner.tsx` (red error banner, `role="alert"`). Extend this layer instead of hand-copying card/badge/control classes into new pages.
- `components/toolbox/` — toolbox page: `ToolboxView.tsx` (client container: search + category filter, `?q=&cat=` URL sync — initial state from server props, writes via `router.replace`, back/forward via `popstate`; grouped sections in `CATEGORY_ORDER`, single results grid when searching), `ToolCard.tsx` (accent emoji tile; `externalLink` tools render an External badge and link out with `target="_blank"`), `ToolSearch.tsx` (controlled search input), `CategoryFilter.tsx` (All + category chips, `aria-pressed`).
- `components/tools/` — tool-page domain components, shared by the ~22 tool pages (which all build on `components/ui/` atoms): `BriefForm.tsx` (client-brief form), `ResultView.tsx` (generic JSON renderer: rows → tables, scalars → stat cards, nested → sections; copy/download via Button), `OutputHistory.tsx` (saved-output history rail), `HubSpotLeads.tsx` (right-rail lead picker, prefill), `useToolApi.ts` (POST hook), `usePrefill.ts` (cross-tool link prefill).
- `components/dashboard/` — `/` dashboard widgets: `MetricCard.tsx` (KPI + `DeltaBadge`), `SectionHeader.tsx`, `SectionNav.tsx`, `RangePicker.tsx`, `InsightList.tsx`, `AiPlanList.tsx`, `UnconfiguredNotice.tsx`, `WebsiteSection.tsx` / `SalesSection.tsx` (server), recharts charts (client, pure props).
- Page-local components (e.g. `NavBar`) live next to their pages in `app/`, not here.

## Local Contracts

- Import via the `@/*` alias (`@/components/ui/Card`, `@/components/toolbox/ToolCard`).
- Mixed rendering: `components/ui/` is server-safe (no hooks — usable from server and client trees; `Button`/`Input` are event-driven so only used in client components). `components/toolbox/ToolCard` is server-safe; `ToolboxView`/`ToolSearch`/`CategoryFilter` are `"use client"`. `components/tools/` are client components. `components/dashboard/` widgets are server components (recharts charts are the `"use client"` exception). Keep server components the default per `app/AGENTS.md`.
- No icon library — emoji icons are the convention.

## Work Guidance

- Tailwind v4 only (no `tailwind.config.js`). Build from the `ui/` atoms: `Card` (tone white/slate, default `p-6`), `Badge` (static color map — never build dynamic class strings), `PageHeader` for page titles, `StatCard` for KPI numbers.
- Dynamic Tailwind classes must come from static `Record<…, string>` maps — never string-concatenate class names (Tailwind can't see them).

## Verification

- `pnpm build` — must pass.
- No test framework exists.

## Child DOX Index

- No child AGENTS.md files under `components/`.
