# components/ — Reusable UI components

## Purpose

Shared UI layers for the whole site: design-language atoms (`ui/`), the toolbox page (`toolbox/`), tool-page domain components (`tools/`), and dashboard widgets (`dashboard/`).

## Ownership

- `components/ui/` — **shared design-language atoms, consumed by every page.** `PageHeader.tsx` (full-width blue-gradient banner: white title + count pill + description + trailing), `Card.tsx` (white/slate tones, `hover` lift, `noPadding` + `className`), `Badge.tsx` (static color map: fp/slate/emerald/blue/amber/rose/violet), `StatCard.tsx` (white / fp-800/700/600 tones, `size` md/lg), `SectionTitle.tsx` (heading + optional count), `EmptyState.tsx` (dashed empty block), `Button.tsx` (primary = coral gradient / secondary / brand, sm/md/lg), `Input.tsx` (labeled input), `Select.tsx` (labeled select), `Textarea.tsx` (labeled textarea), `ErrorBanner.tsx` (red error banner, `role="alert"`). Extend this layer instead of hand-copying card/badge/control classes into new pages.
- `components/toolbox/` — toolbox page: `ToolboxView.tsx` (client container: search + category filter, `?q=&cat=` URL sync — initial state from server props, writes via `router.replace`, back/forward via `popstate`; sticky controls bar, grouped sections in `CATEGORY_ORDER` with color-bar headers, single results grid when searching), `ToolCard.tsx` (SVG icon tile in category colors; `externalLink` tools render an External badge and link out with `target="_blank"`), `ToolSearch.tsx` (controlled search input), `CategoryFilter.tsx` (All + category chips, `aria-pressed`).
- `components/tools/` — tool-page domain components, shared by the tool pages (which all build on `components/ui/` atoms): `BriefForm.tsx` (client-brief form), `ResultView.tsx` (generic JSON renderer: rows → tables, scalars → stat cards, nested → sections; copy/download via Button), `OutputHistory.tsx` (saved-output history rail), `HubSpotLeads.tsx` (right-rail lead picker, prefill), `useToolApi.ts` (POST hook), `usePrefill.ts` (cross-tool link prefill), `downloadPdf.ts` (server-side PDF export helper → `POST /api/tools/pdf`), `pdfRenderers.ts` (per-tool output→inline-HTML renderers for PDF).
- `components/dashboard/` — `/` dashboard widgets, following the `docs/design-ref/dashboard.html` layout: `MetricCard.tsx` (KPI: value + delta/status line + `Sparkline`), `SectionHeader.tsx` (zonehead: accent bar + title + tag pill + "Last 30 days" takeaways), `SectionNav.tsx` (Website / Sales / Lead Quality pills), `RangePicker.tsx`, `InsightList.tsx`, `AiPlanList.tsx`, `UnconfiguredNotice.tsx`, `LeadQualitySection.tsx` (full admin.html Lead Quality report zone), `CardHead.tsx` (card header + "Source:" label), `StatMini.tsx` (label/value row), `HBarRow.tsx` (horizontal bar), `Legend.tsx` (chart legend), `TwoCol.tsx` (two-column card body), `WebsiteSection.tsx` / `SalesSection.tsx` (server; consume the zone subsets `WebsiteData`/`SalesData` and a shared `plansP` promise), `AiPlanCards.tsx` (zone-scoped view of the shared AI-plans promise — one LLM call feeds both zones, fills in under its own secondary Suspense), `DashboardSkeleton.tsx` (`ZoneSkeleton` + `AiPlanSkeleton` loading fallbacks for the streamed zones), recharts charts (client, pure props).
- `components/gateway/` — DeepSeek team-key gateway UI (used by `/gateway`): `GatewayClient.tsx` (client; consumes `TeamsView` from `lib/gateway/service` — three role views: admin (all teams, edit credit/max_keys, create-team form, alerts), champion (own team: issue keys with limit + 1–2 members, revoke/assign, plaintext key shown once), member (own key card + usage bar only); static bar-color map, `@/components/ui/` atoms only).
- Page-local components (e.g. `NavBar`) live next to their pages in `app/`, not here.

## Local Contracts

- Import via the `@/*` alias (`@/components/ui/Card`, `@/components/toolbox/ToolCard`).
- Mixed rendering: `components/ui/` is server-safe (no hooks — usable from server and client trees; `Button`/`Input` are event-driven so only used in client components). `components/toolbox/ToolCard` is server-safe; `ToolboxView`/`ToolSearch`/`CategoryFilter` are `"use client"`. `components/tools/` are client components. `components/dashboard/` widgets are server components (recharts charts are the `"use client"` exception). Keep server components the default per `app/AGENTS.md`.
- No icon library — tool icons are stroke SVGs from `lib/tool-icons.tsx` (`ToolIcon`), category colors from the static helper maps.

## Work Guidance

- Tailwind v4 only (no `tailwind.config.js`). Build from the `ui/` atoms: `Card` (tone white/slate, default `p-6`), `Badge` (static color map — never build dynamic class strings), `PageHeader` (banner) for page titles, `ToolPageHeader` (`lib/tool-icons.tsx`) for tool-page banners, `StatCard` for KPI numbers. Design tokens (navy/coral/blue/surface/muted/border, `--grad-cta`/`--grad-banner`, category colors) live in `globals.css` `@theme inline`.
- Dynamic Tailwind classes must come from static `Record<…, string>` maps — never string-concatenate class names (Tailwind can't see them).

## Verification

- `pnpm build` — must pass.
- No test framework exists.

## Child DOX Index

- No child AGENTS.md files under `components/`.
