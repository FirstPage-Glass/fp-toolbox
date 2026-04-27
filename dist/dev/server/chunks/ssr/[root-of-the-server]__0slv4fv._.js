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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
;
function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].map((project)=>({
            slug: project.slug
        }));
}
async function ProjectPage({ params }) {
    const { slug } = await params;
    const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProjectBySlug"])(slug);
    if (!project) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-sm text-slate-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "hover:text-fp-500",
                        children: "Home"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "/"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: project.category === "AI" ? "/ai-projects" : "/automation-projects",
                        className: "hover:text-fp-500",
                        children: [
                            project.category,
                            " Projects"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "/"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-slate-900",
                        children: project.name
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm border border-slate-200 p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm font-semibold px-3 py-1 rounded-full ${project.category === "AI" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`,
                                children: project.category
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm font-semibold px-3 py-1 rounded-full ${project.status === "Production" || project.status === "Live" ? "bg-green-100 text-green-700" : project.status === "Prototype (In Use)" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`,
                                children: project.status
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            project.hasWebUi && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold px-3 py-1 rounded-full bg-fp-100 text-fp-700",
                                children: "Web UI"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            project.uptime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700",
                                children: [
                                    project.uptime,
                                    " Uptime"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-slate-900 mb-4",
                        children: project.name
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2",
                                        children: "What It Does"
                                    }, void 0, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-700",
                                        children: project.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2",
                                        children: "Business Impact"
                                    }, void 0, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-700",
                                        children: project.impact
                                    }, void 0, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    (project.hoursSavedPerMonth || project.volumePerMonth) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 pt-6 border-t border-slate-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                            children: [
                                project.hoursSavedPerMonth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 bg-green-50 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl font-bold text-green-700",
                                            children: [
                                                project.hoursSavedPerMonth,
                                                "h"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/projects/[slug]/page.tsx",
                                            lineNumber: 105,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-green-600",
                                            children: "Saved/Month"
                                        }, void 0, false, {
                                            fileName: "[project]/app/projects/[slug]/page.tsx",
                                            lineNumber: 108,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/projects/[slug]/page.tsx",
                                    lineNumber: 104,
                                    columnNumber: 17
                                }, this),
                                project.costSavedPerMonth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 bg-fp-50 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl font-bold text-fp-700",
                                            children: [
                                                "$",
                                                project.costSavedPerMonth.toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/projects/[slug]/page.tsx",
                                            lineNumber: 113,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-fp-600",
                                            children: "Value/Month"
                                        }, void 0, false, {
                                            fileName: "[project]/app/projects/[slug]/page.tsx",
                                            lineNumber: 116,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/projects/[slug]/page.tsx",
                                    lineNumber: 112,
                                    columnNumber: 17
                                }, this),
                                project.volumePerMonth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 bg-violet-50 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl font-bold text-violet-700",
                                            children: project.volumePerMonth
                                        }, void 0, false, {
                                            fileName: "[project]/app/projects/[slug]/page.tsx",
                                            lineNumber: 121,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-violet-600",
                                            children: "Volume"
                                        }, void 0, false, {
                                            fileName: "[project]/app/projects/[slug]/page.tsx",
                                            lineNumber: 124,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/projects/[slug]/page.tsx",
                                    lineNumber: 120,
                                    columnNumber: 17
                                }, this),
                                project.since && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 bg-slate-50 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl font-bold text-slate-700",
                                            children: project.since
                                        }, void 0, false, {
                                            fileName: "[project]/app/projects/[slug]/page.tsx",
                                            lineNumber: 129,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-slate-600",
                                            children: "Running Since"
                                        }, void 0, false, {
                                            fileName: "[project]/app/projects/[slug]/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/projects/[slug]/page.tsx",
                                    lineNumber: 128,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/projects/[slug]/page.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100",
                        children: [
                            project.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: project.url,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "inline-flex items-center px-4 py-2 bg-fp-500 text-white rounded-lg text-sm font-medium hover:bg-fp-700 transition-colors",
                                children: "🌐 Live URL →"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            project.repoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: project.repoUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors",
                                children: "📁 GitHub Repo →"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-900 mb-4",
                                children: "🛠️ Tech Stack"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: project.techStack.map((tech)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium",
                                        children: tech
                                    }, tech, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-900 mb-4",
                                children: "🔗 Integrations"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: project.integrations.map((integration)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-3 py-1 bg-fp-50 text-fp-700 rounded-full text-sm font-medium",
                                        children: integration
                                    }, integration, false, {
                                        fileName: "[project]/app/projects/[slug]/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-red-50 border-l-4 border-red-400 rounded-r-xl p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold text-red-800 mb-3",
                                children: "❌ Before"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-700",
                                children: project.before
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-green-50 border-l-4 border-green-400 rounded-r-xl p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold text-green-800 mb-3",
                                children: "✅ After"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-green-700",
                                children: project.after
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            project.aiModels.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-slate-900 mb-4",
                        children: "🤖 AI Models"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: project.aiModels.map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium",
                                children: model
                            }, model, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 220,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-slate-900 mb-4",
                        children: "🔀 Pipeline Flow"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-700 overflow-x-auto",
                        children: project.flow
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/projects/[slug]/page.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/projects/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/projects/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0slv4fv._.js.map