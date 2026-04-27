# FirstPage Hong Kong — AI & Automation Portfolio Dashboard

A static dashboard built with Next.js + TypeScript + Tailwind CSS to present AI & Automation initiatives to stakeholders.

## Quick Start

```bash
# Install dependencies (requires pnpm)
pnpm install

# Development server
pnpm dev

# Build static export
pnpm build

# Serve static files
npx serve dist -l 3000
```

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Executive Summary (homepage)
│   ├── ai-projects/page.tsx      # AI Projects listing
│   ├── automation-projects/      # Automation Projects listing
│   ├── architecture/page.tsx     # Integrations & Architecture
│   └── projects/[slug]/          # Individual project detail pages
├── lib/
│   └── data.ts                   # ALL PROJECT DATA — edit here
├── dist/                         # Static export output
├── next.config.ts                # Static export config
└── package.json
```

## Data Model

All project data lives in `lib/data.ts`. Each project has:

```typescript
interface Project {
  slug: string;           # URL-friendly identifier
  name: string;           # Display name
  category: "AI" | "Automation";
  description: string;    # What it does
  techStack: string[];    # Technologies used
  integrations: string[]; # External services
  status: string;         # Production / Live / Prototype
  url: string | null;     # Live/production URL
  repoUrl: string | null; # GitHub repository URL
  hasWebUi: boolean;      # Has web interface?
  before: string;         # Before automation
  after: string;          # After automation
  flow: string;           # Pipeline description
  aiModels: string[];     # AI models used
  impact: string;         # Business impact summary
}
```

## Current Projects (10 total)

### AI Projects (6)

1. **PBN Content Automation** — 6-step n8n workflow for 180+ WordPress PBN sites
   - 900+ backlinks/month (600 normal + 300 premium)
   - Tech: n8n, NocoDB, Google Sheets, WordPress API, Claude, OpenRouter
   - Status: Production

2. **CX FAQ Paraphrase Pipeline** — AI pipeline for Cathay Pacific FAQ content
   - Tech: Python, Claude Sonnet 4.6, GPT-5.4-mini, OpenRouter
   - Status: Production

3. **FP FAQ Schema Generator** — Public web tool for FAQ structured data
   - Live URL: https://faq-gen.firstpage.com.hk
   - Repo: https://github.com/FirstPage-Glass/fp-faq-schema-generator
   - Tech: Next.js 16, React 19, Gemini 2.5
   - Status: Live

4. **Lovable Landing Page Workflow** — Multi-stage AI pipeline for landing pages
   - Repo: https://github.com/FirstPage-Glass/lovable-landing-page-workflow
   - Tech: Python, Claude, Brandfetch, Jina AI
   - Status: Internal Tool

5. **CX FAQ n8n Workflows** — Visual workflow orchestration
   - Tech: n8n, OpenRouter, NocoDB
   - Status: Production

6. **Proposal Advisory System** — AI proposal coaching for sales team
   - Repo: https://github.com/FirstPage-Glass/Proposal-Advisory-System
   - Tech: React 19, Express 5, Claude Sonnet 4.6
   - Status: Prototype (In Use)

### Automation Projects (4)

7. **Blog Upload Automation** — Parse Google Docs → CMS (WP/Wix/Shopify)
   - Tech: Python, Google Docs API, Resend
   - Status: Production

8. **Invoice Review Web App** — Full-stack invoice review system
   - Repo: https://github.com/FirstPage-Glass/invoice-review-system
   - Tech: FastAPI, SvelteKit, NocoDB, Resend
   - Status: Production

9. **Overdue Invoice Reports** — Weekly AR aging report automation
   - Repo: https://github.com/FirstPage-Glass/overdue-invoice-reports
   - Tech: Python, openpyxl, Resend
   - Status: Production

10. **Invoice Review Email Flow** — Commission eligibility + email distribution
    - Tech: Python, openpyxl, Resend
    - Status: Production

## Team Impact

| Team | Projects | Monthly Volume |
|------|----------|----------------|
| **SEO / Link Building** | PBN, Blog Upload, FAQ Schema | 900+ backlinks + 30+ blog posts |
| **Accounts & Finance** | Invoice Review, Overdue Reports, Email Flow | 800+ invoices tracked |
| **Sales / Proposals** | Proposal Advisory, Lovable Landing Page | 20+ proposals + 10+ landing pages |
| **Content / CX (Cathay)** | FAQ Pipeline, n8n Workflows | 50+ FAQ items/batch |

## Architecture Overview

Key integrations:
- **NocoDB** — Database (PBN, FAQ, Blog, Invoice)
- **OpenRouter** — AI Gateway (Claude, GPT)
- **Resend** — Email API (all invoice/report flows)
- **Google APIs** — Docs, Sheets, Drive
- **WordPress API** — 180+ PBN sites + client CMS
- **Claude/Gemini** — AI models

## Context & Background

This dashboard was built for presenting AI & Automation work to an Australian stakeholder (老板娘/boss). Key requirements:

1. **Visual presentation** — Stakeholder wants to see visual things, not just terminal outputs
2. **Business impact focus** — Hours saved, volume processed, cost reduction
3. **Professional appearance** — Clean, modern UI suitable for executive presentation
4. **Individual project pages** — Each project has its own page with full details

### Discovery Process

Explored local projects in `/home/glasschan/`:
- `dennis-hermes/` — FirstPage HK projects
- `makesnoco-hermes/` — Side projects (Publish Helper, Playhouse HK)

Found 11 total projects, filtered to 10 FirstPage-related ones (removed personal projects).

### Volume Metrics (Estimated)

| Pipeline | Monthly Volume | Before | After |
|----------|---------------|---------|-------|
| PBN Content | 900+ backlinks | ~20 min/backlink | ~5 min/batch |
| Blog Upload | ~30 posts | ~30 min/post | ~2 min/post |
| Invoice Review | ~400 invoices/cycle | 10 min/invoice | 1 min/invoice |
| Overdue Reports | ~200 invoices/week | 2 hours/week | 5 min/week |
| FAQ Pipeline | ~50 items/batch | 15 min/item | 1 min/item |
| Proposal Advisory | ~20 proposals | 3 hours/proposal | 1 min/proposal |

## What's Already Done

✅ Next.js 16 project with TypeScript + Tailwind CSS  
✅ All 10 projects with complete data  
✅ Executive Summary page with KPIs  
✅ Team Impact section  
✅ AI Projects listing page  
✅ Automation Projects listing page  
✅ Architecture & Integrations page  
✅ Individual project detail pages (10 pages)  
✅ Static export configured  
✅ GitHub repo links added  
✅ Live URLs added where available  

## What Still Needs Work

1. **PBN Flow Diagram** — Currently text-only. Consider adding:
   - Visual flowchart (Mermaid or SVG)
   - Screenshots of n8n workflows
   - Domain authority metrics visualization

2. **Screenshots** — Add actual screenshots of:
   - Invoice Review Web App (admin dashboard)
   - Overdue Report emails (color-coded HTML)
   - Proposal Advisory System UI
   - FAQ Schema Generator interface
   - n8n workflow editor

3. **Metrics Charts** — Add visualizations:
   - Monthly volume trends
   - Hours saved per pipeline
   - Before/After comparison charts
   - Team workload distribution

4. **Volume Data Accuracy** — Current numbers are estimates:
   - Verify actual monthly volumes with team leads
   - Get real processing times
   - Calculate actual cost savings

5. **Additional Projects** — User mentioned these are being developed:
   - WordPress content upload automation (in development)
   - Proposal Advisory System is prototype but in active use
   - May have other n8n flows not yet documented

6. **Styling Polish** — Current Tailwind styling is basic:
   - Consider custom color scheme matching FirstPage brand
   - Add animations/transitions
   - Mobile responsiveness review
   - Dark mode option

7. **Missing GitHub Repos** — Some projects have no public repo:
   - PBN Content Automation (private n8n flows)
   - CX FAQ Pipeline (private Python scripts)
   - Blog Upload Automation
   - Invoice Email Flow
   - Consider creating repos or documenting why private

## How to Add a New Project

1. Edit `lib/data.ts`
2. Add project to `projects` array
3. Add to appropriate team in `teamImpact`
4. Rebuild: `pnpm build`

## Deployment

Static export in `dist/` folder can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

```bash
# Build for deployment
pnpm build

# Deploy dist/ folder
```

## Files to Move

This entire folder is self-contained. Just move:
```
demo-dashboard-next/
```

All dependencies are in `node_modules/` and `package.json`. No external services required for the dashboard itself (all data is static).
