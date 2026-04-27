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
        name: "Invoice Review Web App",
        category: "Automation",
        description: "Full-stack web application for Account Managers to review invoices online. Features admin dashboard, PIN authentication, review/dispute workflow, and automated email distribution with clear HTML templates.",
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
        before: "Excel files emailed back and forth — no tracking, no visibility, manual follow-up",
        after: "Web portal with PIN auth → AM reviews online → Admin dashboard with real-time tracking → Clear HTML email reports via Resend",
        flow: "CSV → NocoDB Import → AM Name Canonicalization → Resend Email + PIN → AM Web Portal → Admin Dashboard → Summary Email",
        aiModels: [],
        impact: "Full-stack web app with auth. Replaced email-based invoice review",
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
            "faq-schema-generator"
        ],
        monthlyVolume: "900+ backlinks + 30+ blog posts",
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
            "Proposal"
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
            "Blog Upload"
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
            "FAQ Schema Generator"
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
"[project]/app/automation-projects/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AutomationProjectsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-rsc] (ecmascript)");
;
;
;
function AutomationProjectsPage() {
    const projects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAutomationProjects"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-slate-900",
                                children: "Automation Projects"
                            }, void 0, false, {
                                fileName: "[project]/app/automation-projects/page.tsx",
                                lineNumber: 11,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-600 mt-1",
                                children: "End-to-end automated pipelines replacing manual processes with reliable, monitored systems"
                            }, void 0, false, {
                                fileName: "[project]/app/automation-projects/page.tsx",
                                lineNumber: 14,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/automation-projects/page.tsx",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "text-sm font-medium text-blue-600 hover:text-blue-700",
                        children: "← Back to Overview"
                    }, void 0, false, {
                        fileName: "[project]/app/automation-projects/page.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/automation-projects/page.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: `/projects/${project.slug}`,
                        className: "block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700",
                                        children: "Automation"
                                    }, void 0, false, {
                                        fileName: "[project]/app/automation-projects/page.tsx",
                                        lineNumber: 35,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700",
                                        children: project.status
                                    }, void 0, false, {
                                        fileName: "[project]/app/automation-projects/page.tsx",
                                        lineNumber: 38,
                                        columnNumber: 15
                                    }, this),
                                    project.uptime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700",
                                        children: project.uptime
                                    }, void 0, false, {
                                        fileName: "[project]/app/automation-projects/page.tsx",
                                        lineNumber: 42,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/automation-projects/page.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-semibold text-slate-900 mb-2",
                                children: project.name
                            }, void 0, false, {
                                fileName: "[project]/app/automation-projects/page.tsx",
                                lineNumber: 47,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-600 mb-4",
                                children: project.description
                            }, void 0, false, {
                                fileName: "[project]/app/automation-projects/page.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            project.hoursSavedPerMonth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "💰"
                                    }, void 0, false, {
                                        fileName: "[project]/app/automation-projects/page.tsx",
                                        lineNumber: 56,
                                        columnNumber: 17
                                    }, this),
                                    project.hoursSavedPerMonth,
                                    "h saved/mo · $",
                                    project.costSavedPerMonth?.toLocaleString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/automation-projects/page.tsx",
                                lineNumber: 55,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-1",
                                children: [
                                    project.integrations.slice(0, 3).map((int)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs px-2 py-1 bg-slate-50 rounded text-slate-600",
                                            children: int
                                        }, int, false, {
                                            fileName: "[project]/app/automation-projects/page.tsx",
                                            lineNumber: 64,
                                            columnNumber: 17
                                        }, this)),
                                    project.integrations.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$4_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs px-2 py-1 bg-slate-50 rounded text-slate-400",
                                        children: [
                                            "+",
                                            project.integrations.length - 3
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/automation-projects/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/automation-projects/page.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this)
                        ]
                    }, project.slug, true, {
                        fileName: "[project]/app/automation-projects/page.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/automation-projects/page.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/automation-projects/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/automation-projects/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/automation-projects/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0yees7d._.js.map