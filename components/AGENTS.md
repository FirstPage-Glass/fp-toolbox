# components/ — Reusable UI components

## Purpose

Reusable toolbox UI components shared by the client-side pages.

## Ownership

- `components/toolbox/ToolSearch.tsx` — search input with icon.
- `components/toolbox/ToolCard.tsx` — tool card: cover image, badges, links.
- `components/toolbox/ToolGrid.tsx` — responsive grid with empty state.
- `components/toolbox/CategoryFilter.tsx` — horizontal category filter buttons.
- `components/tools/BriefForm.tsx` — shared client-brief form used by Pitch Deck and Proposal tools.
- Page-local components (e.g. `NavBar`) live next to their pages in `app/`, not here.

## Local Contracts

- Import via the `@/*` alias (`@/components/toolbox/ToolCard`).
- All current components are client components (`"use client"`); keep server components the default elsewhere per `app/AGENTS.md`.
- No icon library — emoji icons are the convention.

## Work Guidance

- Tailwind v4 only (no `tailwind.config.js`). Card pattern: `bg-white rounded-xl shadow-sm border border-slate-200`; hover: `hover:shadow-md hover:border-fp-300 transition-all`; status badges: `bg-{color}-100 text-{color}-700`.

## Verification

- `pnpm build` — must pass.
- No test framework exists.

## Child DOX Index

- No child AGENTS.md files under `components/`.
