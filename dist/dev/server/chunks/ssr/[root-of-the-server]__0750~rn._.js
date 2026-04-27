module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.0x3dzn~oxb6tn.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[project]/lib/data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "filterTools",
    ()=>filterTools,
    "getAiProjects",
    ()=>getAiProjects,
    "getAllTags",
    ()=>getAllTags,
    "getAllTools",
    ()=>getAllTools,
    "getAutomationProjects",
    ()=>getAutomationProjects,
    "getProductionCount",
    ()=>getProductionCount,
    "getProjectBySlug",
    ()=>getProjectBySlug,
    "getToolsByCategory",
    ()=>getToolsByCategory,
    "getTotalCostSaved",
    ()=>getTotalCostSaved,
    "getTotalHoursSaved",
    ()=>getTotalHoursSaved,
    "integrations",
    ()=>integrations,
    "isToolCategory",
    ()=>isToolCategory,
    "projectToTool",
    ()=>projectToTool,
    "projects",
    ()=>projects,
    "teamImpact",
    ()=>teamImpact
]);
const projects = [
    {
        slug: "pbn-content-automation",
        name: "PBN Content Automation",
        category: "AI",
        description: "6-step n8n workflow pipeline for automated PBN content generation and backlink deployment. Manages 180+ WordPress PBN sites with domain authority filtering, AI content generation, automated uploading, and live link verification. Currently generating 600+ normal and 300+ premium backlinks per month.",
        techStack: [
            "n8n",
            "NocoDB",
            "Google Sheets",
            "WordPress API",
            "Claude",
            "OpenRouter",
            "HTTP Request"
        ],
        integrations: [
            "NocoDB",
            "Google Sheets",
            "WordPress API (180+ sites)"
        ],
        status: "Production",
        url: null,
        repoUrl: null,
        hasWebUi: false,
        before: "Manual content creation and upload to 180+ PBN sites — ~20 min per backlink, inconsistent quality",
        after: "Automated 6-step pipeline: brief intake → AI content gen → domain selection → auto-upload → link check → sync. ~5 min setup per batch of 15.",
        flow: "Google Sheets → NocoDB → AI Content Gen (Claude) → Domain Selection (DA/DR) → Auto Upload (WP API) → Link Check → Sync",
        aiModels: [
            "Claude"
        ],
        impact: "900+ backlinks/month across 180+ PBN sites",
        tagline: "900+ backlinks/month across 180+ PBN sites — fully automated, zero manual uploads",
        coverImage: null,
        hoursSavedPerMonth: 280,
        costSavedPerMonth: 8400,
        volumePerMonth: "900+ backlinks",
        uptime: "99.2%",
        since: "Oct 2025"
    },
    {
        slug: "cx-faq-paraphrase",
        name: "CX FAQ Paraphrase Pipeline",
        category: "AI",
        description: "End-to-end AI pipeline that paraphrases Cathay Pacific FAQ content using Claude Sonnet, with automated QA via GPT. Replaces manual copywriting with a 6-step automated workflow.",
        techStack: [
            "Python",
            "Claude Sonnet 4.6",
            "GPT-5.4-mini",
            "OpenRouter",
            "NocoDB",
            "Google Sheets API",
            "Google Drive API"
        ],
        integrations: [
            "OpenRouter",
            "NocoDB",
            "Google Sheets",
            "Google Drive"
        ],
        status: "Production",
        url: null,
        repoUrl: null,
        hasWebUi: false,
        before: "Manual copywriting and editing of each FAQ item — ~15 min per item",
        after: "Fully automated paraphrase + QA pipeline — batch processing with scoring",
        flow: "NocoDB → Python Pipeline → Claude Sonnet → QA Check (GPT) → Score ≥ 7.0? → Auto-fix → Google Drive",
        aiModels: [
            "Claude Sonnet 4.6",
            "GPT-5.4-mini"
        ],
        impact: "Eliminated manual FAQ rewriting for CX team",
        tagline: "AI rewrites Cathay Pacific FAQs with QA scoring — no copywriter needed",
        coverImage: null,
        hoursSavedPerMonth: 35,
        costSavedPerMonth: 1050,
        volumePerMonth: "~50 items",
        uptime: "100%",
        since: "Jan 2026"
    },
    {
        slug: "faq-schema-generator",
        name: "FP FAQ Schema Generator",
        category: "AI",
        description: "Public web tool that uses Gemini AI to automatically extract FAQ structured data from any URL. Generates validated JSON-LD schema for SEO professionals.",
        techStack: [
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Google Gemini 2.5",
            "Jina AI",
            "SQLite",
            "Tailwind CSS 4"
        ],
        integrations: [
            "Google Gemini API",
            "Jina AI"
        ],
        status: "Live",
        url: "https://faq-gen.firstpage.com.hk",
        repoUrl: "https://github.com/FirstPage-Glass/fp-faq-schema-generator",
        hasWebUi: true,
        before: "Manual FAQ schema creation — tedious JSON-LD authoring",
        after: "Paste URL → AI extracts FAQs → Validated schema in seconds",
        flow: "User URL → Jina AI (extraction) → Gemini 2.5 (FAQ extract) → JSON-LD → Validation → Output",
        aiModels: [
            "Google Gemini 2.5"
        ],
        impact: "Reduces FAQ schema creation from 30 min to under 10 seconds",
        tagline: "Paste any URL → SEO-ready FAQ schema in 10 seconds",
        coverImage: null,
        hoursSavedPerMonth: 20,
        costSavedPerMonth: 600,
        volumePerMonth: "~40 schemas",
        uptime: "99.9%",
        since: "Mar 2026"
    },
    {
        slug: "lovable-landing-page",
        name: "Lovable Landing Page Workflow",
        category: "AI",
        description: "Multi-stage AI pipeline that takes a client URL and produces a complete Lovable AI landing page package: creative brief, AI prompt, brand assets (logo, colors, fonts), and optimized images.",
        techStack: [
            "Python",
            "Claude Code Skills",
            "OpenRouter",
            "Brandfetch API",
            "Jina AI",
            "Firecrawl",
            "DuckDuckGo",
            "Pillow",
            "Sharp"
        ],
        integrations: [
            "OpenRouter",
            "Brandfetch",
            "Jina AI",
            "Firecrawl"
        ],
        status: "Internal Tool",
        url: null,
        repoUrl: "https://github.com/FirstPage-Glass/lovable-landing-page-workflow",
        hasWebUi: false,
        before: "Manual research + asset gathering for each client landing page — 2-3 hours",
        after: "One URL in → Complete landing page package out in ~85 seconds",
        flow: "Client URL → Site Discovery → Content Fetching → AI Classification → Brand Asset Extraction → Image Optimization → AI Prompt → Package",
        aiModels: [
            "Claude (via OpenRouter)"
        ],
        impact: "Reduced landing page setup from hours to ~85 seconds",
        tagline: "One client URL → complete landing page package in 85 seconds",
        coverImage: null,
        hoursSavedPerMonth: 50,
        costSavedPerMonth: 1500,
        volumePerMonth: "~10 pages",
        uptime: "N/A",
        since: "Feb 2026"
    },
    {
        slug: "cx-faq-n8n",
        name: "CX FAQ n8n Workflows",
        category: "AI",
        description: "Visual no-code workflows in n8n orchestrating the CX FAQ paraphrase pipeline. 9 workflow files covering Steps 1-6 plus QA subflow with NocoDB, OpenRouter, and Google Drive integration.",
        techStack: [
            "n8n",
            "OpenRouter",
            "NocoDB",
            "Google Drive",
            "Google Sheets"
        ],
        integrations: [
            "OpenRouter",
            "NocoDB",
            "Google Drive",
            "Google Sheets"
        ],
        status: "Production",
        url: null,
        repoUrl: null,
        hasWebUi: false,
        before: "No orchestration layer — manual trigger of each step",
        after: "Visual node-based workflow with automated scheduling and error handling",
        flow: "NocoDB Trigger → Fetch Rules → LLM Paraphrase → QA Validation → Google Drive Export → Status Update",
        aiModels: [
            "Claude (via OpenRouter)"
        ],
        impact: "Visual workflow orchestration for non-technical team members",
        tagline: "Visual no-code workflows orchestrating AI FAQ processing at scale",
        coverImage: null,
        hoursSavedPerMonth: 15,
        costSavedPerMonth: 450,
        volumePerMonth: "~50 items",
        uptime: "100%",
        since: "Jan 2026"
    },
    {
        slug: "proposal-advisory",
        name: "Proposal Advisory System",
        category: "AI",
        description: "AI-powered proposal coaching tool for FirstPage Digital's proposal team. Submit a client brief (text + PDF) and get structured strategic guidance. Supports follow-up revisions, history with search/filter, and HTML/PDF export.",
        techStack: [
            "React 19",
            "Express 5",
            "Vite",
            "SQLite",
            "Claude Sonnet 4.6",
            "OpenRouter",
            "Docker"
        ],
        integrations: [
            "OpenRouter"
        ],
        status: "Prototype (In Use)",
        url: null,
        repoUrl: "https://github.com/FirstPage-Glass/Proposal-Advisory-System",
        hasWebUi: true,
        before: "Proposal team writes proposals from scratch with no structured guidance — inconsistent quality, missed red flags, 2-3 hours per proposal",
        after: "Brief intake form → AI generates 4-step strategic advisory in ~60 seconds. Sales team can iterate with follow-ups.",
        flow: "Brief Intake → PDF Upload → Express Backend → Claude Sonnet → Structured Advisory → Follow-up Revisions → History + Export",
        aiModels: [
            "Claude Sonnet 4.6"
        ],
        impact: "Provides consistent, structured proposal guidance across the sales team",
        tagline: "Turns blank proposals into structured strategic advice in 60 seconds",
        coverImage: null,
        hoursSavedPerMonth: 60,
        costSavedPerMonth: 1800,
        volumePerMonth: "~20 proposals",
        uptime: "N/A",
        since: "Apr 2026"
    },
    {
        slug: "blog-upload",
        name: "Blog Upload Automation",
        category: "Automation",
        description: "End-to-end pipeline that parses Google Docs blog articles and pushes them as drafts to WordPress, Wix, and Shopify CMS platforms. Sends styled email reports after processing.",
        techStack: [
            "Python",
            "Google Docs API",
            "Google Drive API",
            "NocoDB API",
            "Resend",
            "WordPress REST API",
            "Wix API",
            "Shopify API"
        ],
        integrations: [
            "Google Docs",
            "Google Drive",
            "NocoDB",
            "Resend",
            "WordPress",
            "Wix",
            "Shopify"
        ],
        status: "Production",
        url: null,
        repoUrl: null,
        hasWebUi: false,
        before: "Manual copy-paste from Google Docs to CMS — ~30 min per post, frequent formatting errors",
        after: "Google Doc URL → Automated parsing → Draft in CMS → Email report with edit link",
        flow: "NocoDB Queue → Google Docs API → SEO Metadata Extract → CMS Platform? → WP/Wix/Shopify → Resend Email Report",
        aiModels: [],
        impact: "3 CMS platforms supported. Eliminated manual blog posting",
        tagline: "Google Doc → WordPress/Wix/Shopify draft in one click",
        coverImage: null,
        hoursSavedPerMonth: 45,
        costSavedPerMonth: 1350,
        volumePerMonth: "~30 posts",
        uptime: "99.5%",
        since: "Nov 2025"
    },
    {
        slug: "invoice-review",
        name: "Invoice Review System",
        category: "Automation",
        description: "Started as an automated email flow sending review requests to 16 Account Managers. After Finance team feedback that emails were still too much work, evolved into a full-stack web app with PIN auth, admin dashboard, review/dispute workflow, and automated HTML email distribution.",
        techStack: [
            "FastAPI",
            "SvelteKit",
            "Svelte 5",
            "TypeScript",
            "NocoDB",
            "Resend",
            "HMAC Auth"
        ],
        integrations: [
            "NocoDB",
            "Resend"
        ],
        status: "Production",
        url: null,
        repoUrl: "https://github.com/FirstPage-Glass/invoice-review-system",
        hasWebUi: true,
        before: "Started with automated email flow to 16 AMs. Finance team feedback: emails still too much manual work.",
        after: "Evolved into full web portal: PIN auth → AM reviews online → Admin dashboard with real-time tracking → Clear HTML email reports via Resend",
        flow: "CSV → NocoDB Import → AM Name Canonicalization → Resend Email + PIN → AM Web Portal → Admin Dashboard → Summary Email",
        aiModels: [],
        impact: "V1: Email flow. V2: Full-stack web app with auth, built from team feedback. Replaced manual invoice review entirely.",
        tagline: "Full invoice review portal for 16 AMs — evolved from email to web app based on team feedback",
        coverImage: null,
        hoursSavedPerMonth: 120,
        costSavedPerMonth: 3600,
        volumePerMonth: "~400 invoices",
        uptime: "99.8%",
        since: "Dec 2025"
    },
    {
        slug: "overdue-reports",
        name: "Overdue Invoice Reports",
        category: "Automation",
        description: "Weekly AR aging report automation. Parses Excel files from finance, groups by Account Manager, categorizes by overdue age, and sends clear color-coded HTML emails to each AM every Monday.",
        techStack: [
            "Python",
            "openpyxl",
            "Resend",
            "pytest"
        ],
        integrations: [
            "Resend"
        ],
        status: "Production",
        url: null,
        repoUrl: "https://github.com/FirstPage-Glass/overdue-invoice-reports",
        hasWebUi: false,
        before: "Finance manually sorted overdue invoices every Monday — hours of work, inconsistent formatting",
        after: "Drop Excel → Auto-parse → Color-coded HTML emails to each AM by Monday 12pm with clear action reminders",
        flow: "Weekly XLSX → openpyxl Parse → AM Grouping → Age Categorization → Color-coded HTML Email → Auto Archive",
        aiModels: [],
        impact: "Weekly automated reporting with color-coded urgency levels",
        tagline: "Monday AR reports auto-delivered to every AM, color-coded by urgency",
        coverImage: null,
        hoursSavedPerMonth: 32,
        costSavedPerMonth: 960,
        volumePerMonth: "~200 invoices",
        uptime: "100%",
        since: "Sep 2025"
    },
    {
        slug: "invoice-email",
        name: "Invoice Review Email Flow",
        category: "Automation",
        description: "Twice-monthly automation processing invoice lists, calculating commission eligibility based on client retention rates (96.5% threshold), and sending personalized clear HTML emails to each Account Manager.",
        techStack: [
            "Python",
            "openpyxl",
            "Resend",
            "python-dotenv"
        ],
        integrations: [
            "Resend"
        ],
        status: "Production",
        url: null,
        repoUrl: null,
        hasWebUi: false,
        before: "Manual commission calculation and invoice distribution — error-prone, inconsistent formatting",
        after: "Drop XLSX → Auto-calculate retention + commission → Personalized clear HTML email per AM",
        flow: "XLSX Invoice List → openpyxl Parse → AM Grouping → Retention Rate Check (96.5%) → Commission Flag → Styled HTML Email",
        aiModels: [],
        impact: "Automated commission eligibility with 96.5% retention threshold",
        tagline: "Automated commission checks with 96.5% retention threshold — no spreadsheet errors",
        coverImage: null,
        hoursSavedPerMonth: 24,
        costSavedPerMonth: 720,
        volumePerMonth: "~400 invoices",
        uptime: "100%",
        since: "Oct 2025"
    },
    {
        slug: "content-brief-generate",
        name: "Content Brief Generate",
        category: "Automation",
        description: "38-node n8n workflow: form submission or sheet trigger → SERP data via Serper → competitor analysis with Cloudflare bypass → search intent classification → AI brief generation using minimax-m2, haiku-4.5, sonnet-4.5, and Gemini 2.5 Flash → Google Doc created from template → status tracking in Sheets.",
        techStack: [
            "n8n",
            "Serper API",
            "OpenRouter",
            "Google Sheets",
            "Google Docs",
            "Google Drive",
            "HTTP Request"
        ],
        integrations: [
            "Serper API",
            "OpenRouter",
            "Google Sheets",
            "Google Docs",
            "Google Drive"
        ],
        status: "Production",
        url: null,
        repoUrl: null,
        hasWebUi: false,
        before: "Manual competitor research + content brief writing — 1-2 hours per brief, inconsistent quality",
        after: "Form submission → SERP + competitor analysis + AI brief generation → Google Doc output in minutes",
        flow: "Form Trigger → Google Sheets → Serper SERP → Split Competitors → Call Competitors Analysis Flow → Merge → Search Intent (LLM) → Brief Agent (LLM) → Google Doc Template → Update Sheets",
        aiModels: [
            "minimax-m2",
            "haiku-4.5",
            "sonnet-4.5",
            "Gemini 2.5 Flash"
        ],
        impact: "Automated content brief generation with multi-model AI pipeline",
        tagline: "SERP + competitor analysis + AI brief → Google Doc in minutes",
        coverImage: null,
        hoursSavedPerMonth: 40,
        costSavedPerMonth: 1200,
        volumePerMonth: "~20 briefs",
        uptime: "99.5%",
        since: "Mar 2026"
    },
    {
        slug: "td-generator-mvp",
        name: "TD Generator MVP",
        category: "Automation",
        description: "33-node n8n workflow system: form submission → Google Sheets → Jina Reader content scraping → CAPTCHA detection → TD Writer sub-workflow generates meta title and description via Google Gemini + OpenRouter → length validation with iterative shortening → writes back to Sheets with status tracking.",
        techStack: [
            "n8n",
            "Jina Reader",
            "Google Gemini",
            "OpenRouter",
            "Google Sheets",
            "HTTP Request"
        ],
        integrations: [
            "Jina Reader",
            "Google Gemini",
            "OpenRouter",
            "Google Sheets"
        ],
        status: "Production",
        url: null,
        repoUrl: null,
        hasWebUi: false,
        before: "Manual meta title and description writing for each page — inconsistent length, no SEO validation",
        after: "URL input → Auto-scrape → AI-generated title + description → Length-validated → Auto-write to Sheets",
        flow: "Form Trigger → Google Sheets → Jina Reader → CAPTCHA Check → Call TD Writer → Gemini/OpeRouter Title+Desc → Length Check → Iterative Shorten → Update Sheets",
        aiModels: [
            "Google Gemini",
            "OpenRouter"
        ],
        impact: "Automated TD (title/description) generation with length validation and iterative refinement",
        tagline: "Auto-generates SEO title/description with length validation",
        coverImage: null,
        hoursSavedPerMonth: 30,
        costSavedPerMonth: 900,
        volumePerMonth: "~30 pages",
        uptime: "99.5%",
        since: "Apr 2026"
    }
];
const getProjectBySlug = (slug)=>projects.find((p)=>p.slug === slug);
const getAiProjects = ()=>projects.filter((p)=>p.category === "AI");
const getAutomationProjects = ()=>projects.filter((p)=>p.category === "Automation");
const getTotalHoursSaved = ()=>projects.reduce((sum, p)=>sum + (p.hoursSavedPerMonth || 0), 0);
const getTotalCostSaved = ()=>projects.reduce((sum, p)=>sum + (p.costSavedPerMonth || 0), 0);
const getProductionCount = ()=>projects.filter((p)=>p.status === "Production" || p.status === "Live").length;
const teamImpact = {
    "SEO / Link Building": {
        projects: [
            "pbn-content-automation",
            "blog-upload",
            "faq-schema-generator",
            "content-brief-generate",
            "td-generator-mvp"
        ],
        monthlyVolume: "900+ backlinks + 30+ blog posts + 50+ TDs/briefs",
        keyMetrics: [
            {
                label: "PBN Sites Managed",
                value: "180+"
            },
            {
                label: "Backlinks/Month",
                value: "900+"
            },
            {
                label: "Blog Posts/Month",
                value: "~30"
            },
            {
                label: "CMS Platforms",
                value: "3"
            }
        ]
    },
    "Accounts & Finance": {
        projects: [
            "invoice-review",
            "overdue-reports",
            "invoice-email"
        ],
        monthlyVolume: "800+ invoices tracked + weekly aging reports",
        keyMetrics: [
            {
                label: "Invoices/Cycle",
                value: "~400"
            },
            {
                label: "AMs Covered",
                value: "16"
            },
            {
                label: "Report Frequency",
                value: "Weekly + Bi-Monthly"
            },
            {
                label: "Email Delivery",
                value: "Resend HTML"
            }
        ]
    },
    "Sales / Proposals": {
        projects: [
            "proposal-advisory",
            "lovable-landing-page"
        ],
        monthlyVolume: "20+ proposals guided + 10+ landing pages",
        keyMetrics: [
            {
                label: "Proposals/Month",
                value: "~20"
            },
            {
                label: "Landing Pages/Month",
                value: "~10"
            },
            {
                label: "AI Model",
                value: "Claude Sonnet 4.6"
            },
            {
                label: "Package Time",
                value: "~85 seconds"
            }
        ]
    },
    "Content / CX (Cathay)": {
        projects: [
            "cx-faq-paraphrase",
            "cx-faq-n8n"
        ],
        monthlyVolume: "50+ FAQ items/batch with QA scoring",
        keyMetrics: [
            {
                label: "Items/Batch",
                value: "~50"
            },
            {
                label: "QA Threshold",
                value: "7.0/10"
            },
            {
                label: "AI Models",
                value: "Claude + GPT"
            },
            {
                label: "Workflow Steps",
                value: "9 (n8n)"
            }
        ]
    }
};
const integrations = [
    {
        name: "NocoDB",
        type: "Database",
        usedBy: [
            "PBN",
            "CX FAQ",
            "Blog Upload",
            "Invoice Review"
        ]
    },
    {
        name: "OpenRouter",
        type: "AI Gateway",
        usedBy: [
            "PBN",
            "CX FAQ",
            "Lovable",
            "Proposal",
            "Content Brief",
            "TD Generator"
        ]
    },
    {
        name: "Resend",
        type: "Email API",
        usedBy: [
            "Blog Upload",
            "Invoice Review",
            "Overdue Reports"
        ]
    },
    {
        name: "Google APIs",
        type: "Data Source",
        usedBy: [
            "PBN",
            "CX FAQ",
            "Blog Upload",
            "Content Brief",
            "TD Generator"
        ]
    },
    {
        name: "WordPress API",
        type: "CMS/PBN",
        usedBy: [
            "PBN (180+ sites)",
            "Blog Upload"
        ]
    },
    {
        name: "Claude",
        type: "AI Model",
        usedBy: [
            "PBN",
            "CX FAQ",
            "Proposal"
        ]
    },
    {
        name: "Gemini",
        type: "AI Model",
        usedBy: [
            "FAQ Schema Generator",
            "TD Generator"
        ]
    },
    {
        name: "Serper API",
        type: "SERP Data",
        usedBy: [
            "Content Brief"
        ]
    },
    {
        name: "Jina Reader",
        type: "Web Scraper",
        usedBy: [
            "TD Generator"
        ]
    }
];
const isToolCategory = (category)=>{
    return [
        "AI",
        "Automation",
        "Internal",
        "Analytics"
    ].includes(category);
};
const projectToTool = (project)=>({
        slug: project.slug,
        name: project.name,
        category: isToolCategory(project.category) ? project.category : "Internal",
        description: project.description,
        techStack: project.techStack,
        tags: [
            project.category,
            ...project.status === "Live" ? [] : [
                project.status
            ],
            ...project.hasWebUi ? [
                "Web UI"
            ] : [],
            ...project.aiModels.length > 0 ? [
                "AI Powered"
            ] : [],
            ...project.url ? [
                "Live"
            ] : [],
            ...project.hoursSavedPerMonth ? [
                `${project.hoursSavedPerMonth}h saved/mo`
            ] : []
        ].filter(Boolean),
        status: project.status,
        url: project.url,
        repoUrl: project.repoUrl,
        hasWebUi: project.hasWebUi,
        impact: project.impact,
        quickAccess: project.hasWebUi,
        lastUsed: null,
        favorite: false
    });
const getAllTools = ()=>projects.map(projectToTool);
const getToolsByCategory = (category)=>{
    const all = getAllTools();
    return category === "All" ? all : all.filter((t)=>t.category === category);
};
const filterTools = (filters, tools)=>{
    let results = tools || getAllTools();
    if (filters.search) {
        const searchLower = filters.search.toLowerCase().trim();
        if (searchLower) {
            results = results.filter((tool)=>tool.name.toLowerCase().includes(searchLower) || tool.description.toLowerCase().includes(searchLower) || tool.techStack.some((tech)=>tech.toLowerCase().includes(searchLower)) || tool.tags.some((tag)=>tag.toLowerCase().includes(searchLower)));
        }
    }
    if (filters.category && filters.category !== "All") {
        results = results.filter((t)=>t.category === filters.category);
    }
    if (filters.tags && filters.tags.length > 0) {
        results = results.filter((t)=>filters.tags.some((tag)=>t.tags.includes(tag)));
    }
    if (filters.hasWebUi !== undefined) {
        results = results.filter((t)=>t.hasWebUi === filters.hasWebUi);
    }
    return results;
};
const getAllTags = ()=>{
    const tags = new Set();
    getAllTools().forEach((tool)=>tool.tags.forEach((tag)=>tags.add(tag)));
    return Array.from(tags).sort();
};
}),
"[project]/lib/nocodb.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAllTools",
    ()=>fetchAllTools,
    "fetchToolById",
    ()=>fetchToolById,
    "fetchToolBySlug",
    ()=>fetchToolBySlug,
    "getCoverImageUrl",
    ()=>getCoverImageUrl
]);
const NOCODB_URL = process.env.NOCODB_URL || ("TURBOPACK compile-time value", "https://nocodb.firstpage.com.hk") || "https://nocodb.firstpage.com.hk";
const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN || ("TURBOPACK compile-time value", "MDiFJ2RI1KvBPNTl80K0StMxjgrTKIqYjF6FSR66") || "";
const NOCODB_TOOLS_BASE_ID = process.env.NOCODB_TOOLS_BASE_ID || ("TURBOPACK compile-time value", "p9ri10dzcq5d71l") || "p9ri10dzcq5d71l";
const NOCODB_TOOLS_TABLE_ID = process.env.NOCODB_TOOLS_TABLE_ID || ("TURBOPACK compile-time value", "m84ca9736466jfm") || "m84ca9736466jfm";
async function fetchAllTools() {
    try {
        const url = `${NOCODB_URL}/api/v3/data/${NOCODB_TOOLS_BASE_ID}/${NOCODB_TOOLS_TABLE_ID}/records?pageSize=100`;
        const response = await fetch(url, {
            headers: {
                "xc-token": NOCODB_API_TOKEN,
                "Content-Type": "application/json"
            },
            next: {
                revalidate: 300
            }
        });
        if (!response.ok) {
            throw new Error(`NocoDB API error: ${response.status}`);
        }
        const data = await response.json();
        return data.records.map((record)=>({
                Id: record.id,
                ...record.fields
            }));
    } catch (error) {
        console.error("Failed to fetch tools from NocoDB:", error);
        return [];
    }
}
async function fetchToolById(id) {
    try {
        const url = `${NOCODB_URL}/api/v3/data/${NOCODB_TOOLS_BASE_ID}/${NOCODB_TOOLS_TABLE_ID}/records/${id}`;
        const response = await fetch(url, {
            headers: {
                "xc-token": NOCODB_API_TOKEN,
                "Content-Type": "application/json"
            },
            next: {
                revalidate: 300
            }
        });
        if (!response.ok) {
            throw new Error(`NocoDB API error: ${response.status}`);
        }
        const data = await response.json();
        return {
            Id: data.id,
            ...data.fields
        };
    } catch (error) {
        console.error("Failed to fetch tool from NocoDB:", error);
        return null;
    }
}
async function fetchToolBySlug(slug) {
    try {
        const url = `${NOCODB_URL}/api/v3/data/${NOCODB_TOOLS_BASE_ID}/${NOCODB_TOOLS_TABLE_ID}/records?pageSize=1&where=(slug,eq,${encodeURIComponent(slug)})`;
        const response = await fetch(url, {
            headers: {
                "xc-token": NOCODB_API_TOKEN,
                "Content-Type": "application/json"
            },
            next: {
                revalidate: 300
            }
        });
        if (!response.ok) {
            throw new Error(`NocoDB API error: ${response.status}`);
        }
        const data = await response.json();
        if (!data.records || data.records.length === 0) return null;
        const record = data.records[0];
        return {
            Id: record.id_fields?.Id ?? record.id,
            ...record.fields
        };
    } catch (error) {
        console.error("Failed to fetch tool by slug from NocoDB:", error);
        return null;
    }
}
function getCoverImageUrl(attachment) {
    if (!attachment) return null;
    if (attachment.thumbnails?.card_cover?.signedPath) {
        return `${NOCODB_URL}/${attachment.thumbnails.card_cover.signedPath}`;
    }
    if (attachment.signedPath) {
        return `${NOCODB_URL}/${attachment.signedPath}`;
    }
    return null;
}
}),
"[project]/app/projects/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectPage,
    "generateStaticParams",
    ()=>generateStaticParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/nocodb.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
;
;
function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].map((project)=>({
            slug: project.slug
        }));
}
// ── Helpers ──────────────────────────────────────────────────────────
function getCategoryGradient(category) {
    const map = {
        AI: "from-violet-500 via-purple-600 to-fp-600",
        Automation: "from-emerald-500 via-teal-600 to-fp-600",
        System: "from-slate-600 via-slate-700 to-fp-700",
        Reporting: "from-amber-500 via-orange-600 to-fp-600",
        Content: "from-fp-400 via-fp-500 to-violet-600",
        Utility: "from-purple-500 via-violet-600 to-fp-600"
    };
    return map[category] || map.AI;
}
function getCategoryIcon(category) {
    const map = {
        AI: "🤖",
        Automation: "⚡",
        System: "🖥️",
        Reporting: "📊",
        Content: "📝",
        Utility: "🛠️"
    };
    return map[category] || "🚀";
}
function getCategoryBg(category) {
    const map = {
        AI: "bg-purple-100 text-purple-700",
        Automation: "bg-emerald-100 text-emerald-700",
        System: "bg-slate-100 text-slate-700",
        Reporting: "bg-amber-100 text-amber-700",
        Content: "bg-fp-100 text-fp-700",
        Utility: "bg-purple-100 text-purple-700"
    };
    return map[category] || "bg-slate-100 text-slate-700";
}
function getStatusBadge(status) {
    if (status === "Production" || status === "Live" || status === "Active") return "bg-green-100 text-green-700";
    if (status === "Prototype (In Use)" || status === "Prototype") return "bg-amber-100 text-amber-700";
    if (status === "Building") return "bg-fp-100 text-fp-700";
    if (status === "Refactoring") return "bg-violet-100 text-violet-700";
    return "bg-slate-100 text-slate-700";
}
function parseFlow(flow) {
    return flow.split(/[→]|(->)/).map((s)=>s?.trim()).filter(Boolean);
}
function findTeamForProject(slug) {
    for (const [team, data] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["teamImpact"])){
        if (data.projects.includes(slug)) return team;
    }
    return null;
}
// ── Components ───────────────────────────────────────────────────────
function CoverImage({ project }) {
    if (project.coverImage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: project.coverImage,
                    alt: project.name,
                    className: "w-full h-full object-cover"
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/projects/[slug]/page.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this);
    }
    const gradient = getCategoryGradient(project.category);
    const icon = getCategoryIcon(project.category);
    const initial = project.name.charAt(0).toUpperCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${gradient}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "100%",
                    height: "100%",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                                id: "grid",
                                width: "40",
                                height: "40",
                                patternUnits: "userSpaceOnUse",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M 40 0 L 0 0 0 40",
                                    fill: "none",
                                    stroke: "white",
                                    strokeWidth: "1"
                                }, void 0, false, {
                                    fileName: "[project]/app/projects/[slug]/page.tsx",
                                    lineNumber: 120,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/projects/[slug]/page.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            width: "100%",
                            height: "100%",
                            fill: "url(#grid)"
                        }, void 0, false, {
                            fileName: "[project]/app/projects/[slug]/page.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-white/30 mb-3",
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white/90 font-bold text-4xl tracking-tight drop-shadow-lg",
                        children: initial
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
function RoiCard({ value, label, color, icon }) {
    const colorMap = {
        green: "bg-green-50 text-green-700 border-green-200",
        fp: "bg-fp-50 text-fp-700 border-fp-200",
        violet: "bg-violet-50 text-violet-700 border-violet-200",
        slate: "bg-slate-50 text-slate-700 border-slate-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative overflow-hidden rounded-xl border p-5 ${colorMap[color]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-2xl mb-2",
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-3xl font-extrabold tracking-tight",
                children: value
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm font-medium opacity-80 mt-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -top-2 -right-2 w-12 h-12 rounded-full bg-current opacity-5"
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, this);
}
function StoryCard({ type, title, content }) {
    const styles = {
        problem: {
            wrapper: "bg-red-50/80 border-red-200",
            accent: "bg-red-500",
            icon: "❌",
            title: "text-red-800",
            text: "text-red-700"
        },
        solution: {
            wrapper: "bg-green-50/80 border-green-200",
            accent: "bg-green-500",
            icon: "✅",
            title: "text-green-800",
            text: "text-green-700"
        },
        proof: {
            wrapper: "bg-fp-50/80 border-fp-200",
            accent: "bg-fp-500",
            icon: "📊",
            title: "text-fp-800",
            text: "text-fp-700"
        }
    };
    const s = styles[type];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative rounded-xl border p-6 ${s.wrapper}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${s.accent}`
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl",
                        children: s.icon
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: `text-lg font-bold ${s.title}`,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `text-base leading-relaxed ${s.text}`,
                children: content
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, this);
}
function FlowStep({ step, index, total }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 rounded-lg bg-fp-500 text-white flex items-center justify-center font-bold text-sm shadow-md",
                            children: index + 1
                        }, void 0, false, {
                            fileName: "[project]/app/projects/[slug]/page.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this),
                        index < total - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute left-1/2 -translate-x-1/2 top-full h-4 w-0.5 bg-fp-200 md:hidden"
                        }, void 0, false, {
                            fileName: "[project]/app/projects/[slug]/page.tsx",
                            lineNumber: 250,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 245,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg border border-slate-200 px-4 py-3 shadow-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-slate-800 truncate",
                        children: step
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 255,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 254,
                columnNumber: 7
            }, this),
            index < total - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden md:flex flex-shrink-0 items-center justify-center w-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    className: "text-fp-400",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M4 10H16M16 10L12 6M16 10L12 14",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 270,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 263,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 262,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 243,
        columnNumber: 5
    }, this);
}
function TechTag({ name, variant }) {
    const styles = {
        tech: "bg-slate-100 text-slate-700 border-slate-200",
        integration: "bg-fp-50 text-fp-700 border-fp-200",
        ai: "bg-purple-50 text-purple-700 border-purple-200"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${styles[variant]}`,
        children: [
            variant === "ai" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mr-1.5",
                children: "🤖"
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 301,
                columnNumber: 28
            }, this),
            variant === "integration" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mr-1.5",
                children: "🔗"
            }, void 0, false, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 302,
                columnNumber: 37
            }, this),
            name
        ]
    }, void 0, true, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 298,
        columnNumber: 5
    }, this);
}
async function ProjectPage({ params }) {
    const { slug } = await params;
    const staticProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProjectBySlug"])(slug);
    if (!staticProject) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    // Fetch live data from NocoDB for cover image, type, updated category/status
    const nocoTool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchToolBySlug"])(slug);
    // Merge: static data for story/content, NocoDB for live fields
    const coverImage = nocoTool?.cover_image && nocoTool.cover_image.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCoverImageUrl"])(nocoTool.cover_image[0]) : staticProject.coverImage || null;
    const category = nocoTool?.category || staticProject.category;
    const status = nocoTool?.status || staticProject.status;
    const type = nocoTool?.type || [];
    const url = nocoTool?.live_link || staticProject.url;
    const repoUrl = nocoTool?.gh_link || staticProject.repoUrl;
    const project = {
        ...staticProject,
        coverImage,
        category,
        status,
        url,
        repoUrl
    };
    const flowSteps = parseFlow(project.flow);
    const teamName = findTeamForProject(slug);
    // ROI data
    const roiCards = [];
    if (project.costSavedPerMonth) {
        roiCards.push({
            value: `$${project.costSavedPerMonth.toLocaleString()}`,
            label: "Value / Month",
            color: "fp",
            icon: "💰"
        });
    }
    if (project.hoursSavedPerMonth) {
        roiCards.push({
            value: `${project.hoursSavedPerMonth}h`,
            label: "Hours Saved / Month",
            color: "green",
            icon: "⏱️"
        });
    }
    if (project.volumePerMonth) {
        roiCards.push({
            value: project.volumePerMonth,
            label: "Monthly Volume",
            color: "violet",
            icon: "📈"
        });
    }
    if (project.uptime) {
        roiCards.push({
            value: project.uptime,
            label: "Uptime",
            color: "slate",
            icon: "🟢"
        });
    } else if (project.since) {
        roiCards.push({
            value: project.since,
            label: "Running Since",
            color: "amber",
            icon: "📅"
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-5xl mx-auto space-y-10 pb-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex items-center gap-2 text-sm text-slate-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "hover:text-fp-500 transition-colors",
                        children: "Home"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-slate-300",
                        children: "/"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 394,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/systems",
                        className: "hover:text-fp-500 transition-colors",
                        children: "Our Systems"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 395,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-slate-300",
                        children: "/"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 401,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-slate-900 font-medium",
                        children: project.name
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 402,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(CoverImage, {
                        project: project
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 407,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getCategoryBg(project.category)}`,
                                children: project.category
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 410,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(project.status)}`,
                                children: project.status
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 415,
                                columnNumber: 11
                            }, this),
                            type.length > 0 && type.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200",
                                    children: t
                                }, t, false, {
                                    fileName: "[project]/app/projects/[slug]/page.tsx",
                                    lineNumber: 421,
                                    columnNumber: 13
                                }, this)),
                            project.hasWebUi && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-fp-100 text-fp-700",
                                children: "Web UI"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 429,
                                columnNumber: 13
                            }, this),
                            teamName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-600",
                                children: teamName
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 434,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 409,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight",
                                children: project.name
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 441,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl",
                                children: project.tagline
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 444,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 440,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 406,
                columnNumber: 7
            }, this),
            roiCards.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-bold text-slate-400 uppercase tracking-widest mb-4",
                        children: "Business Impact at a Glance"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 453,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                        children: roiCards.map((card, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(RoiCard, {
                                ...card
                            }, i, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 458,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 456,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 452,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-bold text-slate-400 uppercase tracking-widest",
                        children: "The Story"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 466,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StoryCard, {
                                type: "problem",
                                title: "The Problem",
                                content: project.before
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 470,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StoryCard, {
                                type: "solution",
                                title: "The Solution",
                                content: project.after
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StoryCard, {
                                type: "proof",
                                title: "The Proof",
                                content: project.impact
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 480,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 469,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 465,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-slate-900 mb-6 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "🔀"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 491,
                                columnNumber: 11
                            }, this),
                            " How It Works"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 490,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: flowSteps.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(FlowStep, {
                                step: step,
                                index: i,
                                total: flowSteps.length
                            }, i, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 495,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 493,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 489,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "grid md:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🛠️"
                                    }, void 0, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 510,
                                        columnNumber: 13
                                    }, this),
                                    " Tech Stack"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 509,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: project.techStack.map((tech)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(TechTag, {
                                        name: tech,
                                        variant: "tech"
                                    }, tech, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 512,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 508,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🔗"
                                    }, void 0, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 522,
                                        columnNumber: 13
                                    }, this),
                                    " Integrations"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 521,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: project.integrations.map((integration)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(TechTag, {
                                        name: integration,
                                        variant: "integration"
                                    }, integration, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 526,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 524,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 520,
                        columnNumber: 9
                    }, this),
                    project.aiModels.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm md:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🧠"
                                    }, void 0, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 539,
                                        columnNumber: 15
                                    }, this),
                                    " AI Models"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 538,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: project.aiModels.map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(TechTag, {
                                        name: model,
                                        variant: "ai"
                                    }, model, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 543,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 541,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 537,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 506,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex flex-wrap gap-4",
                children: [
                    project.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: project.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center gap-2 px-6 py-3 bg-fp-500 text-white rounded-xl font-semibold hover:bg-fp-600 transition-all shadow-lg shadow-fp-500/25 hover:shadow-fp-500/40 hover:-translate-y-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "🌐"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 559,
                                columnNumber: 13
                            }, this),
                            "Open Live Tool",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 16 16",
                                fill: "none",
                                className: "opacity-70",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M6 12L10 8L6 4",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/app/projects/[slug]/page.tsx",
                                    lineNumber: 568,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 561,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 553,
                        columnNumber: 11
                    }, this),
                    project.repoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: project.repoUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-all shadow-lg shadow-slate-800/25 hover:shadow-slate-800/40 hover:-translate-y-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "📁"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 585,
                                columnNumber: 13
                            }, this),
                            "View Source Code",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 16 16",
                                fill: "none",
                                className: "opacity-70",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M6 12L10 8L6 4",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/app/projects/[slug]/page.tsx",
                                    lineNumber: 594,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 587,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 579,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 551,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 388,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/projects/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/projects/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0750~rn._.js.map