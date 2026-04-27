export interface Project {
  slug: string;
  name: string;
  category: "AI" | "Automation";
  description: string;
  techStack: string[];
  integrations: string[];
  status: string;
  url: string | null;
  repoUrl: string | null;
  hasWebUi: boolean;
  before: string;
  after: string;
  flow: string;
  aiModels: string[];
  impact: string;
  tagline: string;
  coverImage?: string | null;
  hoursSavedPerMonth?: number;
  costSavedPerMonth?: number;
  volumePerMonth?: string;
  uptime?: string;
  since?: string;
}

export type ToolCategory = "AI" | "Automation" | "Internal" | "Analytics";

export interface Tool {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  techStack: string[];
  tags: string[];
  status: string;
  url: string | null;
  repoUrl: string | null;
  hasWebUi: boolean;
  impact: string;
  quickAccess: boolean;
  lastUsed: string | null;
  favorite: boolean;
}

export type ToolFilter = {
  search?: string;
  category?: ToolCategory | "All";
  tags?: string[];
  hasWebUi?: boolean;
};

export const projects: Project[] = [
  {
    slug: "pbn-content-automation",
    name: "PBN Content Automation",
    category: "AI",
    description: "6-step n8n workflow pipeline for automated PBN content generation and backlink deployment. Manages 180+ WordPress PBN sites with domain authority filtering, AI content generation, automated uploading, and live link verification. Currently generating 600+ normal and 300+ premium backlinks per month.",
    techStack: ["n8n", "NocoDB", "Google Sheets", "WordPress API", "Claude", "OpenRouter", "HTTP Request"],
    integrations: ["NocoDB", "Google Sheets", "WordPress API (180+ sites)"],
    status: "Production",
    url: null,
    repoUrl: null,
    hasWebUi: false,
    before: "Manual content creation and upload to 180+ PBN sites — ~20 min per backlink, inconsistent quality",
    after: "Automated 6-step pipeline: brief intake → AI content gen → domain selection → auto-upload → link check → sync. ~5 min setup per batch of 15.",
    flow: "Google Sheets → NocoDB → AI Content Gen (Claude) → Domain Selection (DA/DR) → Auto Upload (WP API) → Link Check → Sync",
    aiModels: ["Claude"],
    impact: "900+ backlinks/month across 180+ PBN sites",
    tagline: "900+ backlinks/month across 180+ PBN sites — fully automated, zero manual uploads",
    coverImage: null,
    hoursSavedPerMonth: 280,
    costSavedPerMonth: 8400,
    volumePerMonth: "900+ backlinks",
    uptime: "99.2%",
    since: "Oct 2025",
  },
  {
    slug: "cx-faq-paraphrase",
    name: "CX FAQ Paraphrase Pipeline",
    category: "AI",
    description: "End-to-end AI pipeline that paraphrases Cathay Pacific FAQ content using Claude Sonnet, with automated QA via GPT. Replaces manual copywriting with a 6-step automated workflow.",
    techStack: ["Python", "Claude Sonnet 4.6", "GPT-5.4-mini", "OpenRouter", "NocoDB", "Google Sheets API", "Google Drive API"],
    integrations: ["OpenRouter", "NocoDB", "Google Sheets", "Google Drive"],
    status: "Production",
    url: null,
    repoUrl: null,
    hasWebUi: false,
    before: "Manual copywriting and editing of each FAQ item — ~15 min per item",
    after: "Fully automated paraphrase + QA pipeline — batch processing with scoring",
    flow: "NocoDB → Python Pipeline → Claude Sonnet → QA Check (GPT) → Score ≥ 7.0? → Auto-fix → Google Drive",
    aiModels: ["Claude Sonnet 4.6", "GPT-5.4-mini"],
    impact: "Eliminated manual FAQ rewriting for CX team",
    tagline: "AI rewrites Cathay Pacific FAQs with QA scoring — no copywriter needed",
    coverImage: null,
    hoursSavedPerMonth: 35,
    costSavedPerMonth: 1050,
    volumePerMonth: "~50 items",
    uptime: "100%",
    since: "Jan 2026",
  },
  {
    slug: "faq-schema-generator",
    name: "FP FAQ Schema Generator",
    category: "AI",
    description: "Public web tool that uses Gemini AI to automatically extract FAQ structured data from any URL. Generates validated JSON-LD schema for SEO professionals.",
    techStack: ["Next.js 16", "React 19", "TypeScript", "Google Gemini 2.5", "Jina AI", "SQLite", "Tailwind CSS 4"],
    integrations: ["Google Gemini API", "Jina AI"],
    status: "Live",
    url: "https://faq-gen.firstpage.com.hk",
    repoUrl: "https://github.com/FirstPage-Glass/fp-faq-schema-generator",
    hasWebUi: true,
    before: "Manual FAQ schema creation — tedious JSON-LD authoring",
    after: "Paste URL → AI extracts FAQs → Validated schema in seconds",
    flow: "User URL → Jina AI (extraction) → Gemini 2.5 (FAQ extract) → JSON-LD → Validation → Output",
    aiModels: ["Google Gemini 2.5"],
    impact: "Reduces FAQ schema creation from 30 min to under 10 seconds",
    tagline: "Paste any URL → SEO-ready FAQ schema in 10 seconds",
    coverImage: null,
    hoursSavedPerMonth: 20,
    costSavedPerMonth: 600,
    volumePerMonth: "~40 schemas",
    uptime: "99.9%",
    since: "Mar 2026",
  },
  {
    slug: "lovable-landing-page",
    name: "Lovable Landing Page Workflow",
    category: "AI",
    description: "Multi-stage AI pipeline that takes a client URL and produces a complete Lovable AI landing page package: creative brief, AI prompt, brand assets (logo, colors, fonts), and optimized images.",
    techStack: ["Python", "Claude Code Skills", "OpenRouter", "Brandfetch API", "Jina AI", "Firecrawl", "DuckDuckGo", "Pillow", "Sharp"],
    integrations: ["OpenRouter", "Brandfetch", "Jina AI", "Firecrawl"],
    status: "Internal Tool",
    url: null,
    repoUrl: "https://github.com/FirstPage-Glass/lovable-landing-page-workflow",
    hasWebUi: false,
    before: "Manual research + asset gathering for each client landing page — 2-3 hours",
    after: "One URL in → Complete landing page package out in ~85 seconds",
    flow: "Client URL → Site Discovery → Content Fetching → AI Classification → Brand Asset Extraction → Image Optimization → AI Prompt → Package",
    aiModels: ["Claude (via OpenRouter)"],
    impact: "Reduced landing page setup from hours to ~85 seconds",
    tagline: "One client URL → complete landing page package in 85 seconds",
    coverImage: null,
    hoursSavedPerMonth: 50,
    costSavedPerMonth: 1500,
    volumePerMonth: "~10 pages",
    uptime: "N/A",
    since: "Feb 2026",
  },
  {
    slug: "cx-faq-n8n",
    name: "CX FAQ n8n Workflows",
    category: "AI",
    description: "Visual no-code workflows in n8n orchestrating the CX FAQ paraphrase pipeline. 9 workflow files covering Steps 1-6 plus QA subflow with NocoDB, OpenRouter, and Google Drive integration.",
    techStack: ["n8n", "OpenRouter", "NocoDB", "Google Drive", "Google Sheets"],
    integrations: ["OpenRouter", "NocoDB", "Google Drive", "Google Sheets"],
    status: "Production",
    url: null,
    repoUrl: null,
    hasWebUi: false,
    before: "No orchestration layer — manual trigger of each step",
    after: "Visual node-based workflow with automated scheduling and error handling",
    flow: "NocoDB Trigger → Fetch Rules → LLM Paraphrase → QA Validation → Google Drive Export → Status Update",
    aiModels: ["Claude (via OpenRouter)"],
    impact: "Visual workflow orchestration for non-technical team members",
    tagline: "Visual no-code workflows orchestrating AI FAQ processing at scale",
    coverImage: null,
    hoursSavedPerMonth: 15,
    costSavedPerMonth: 450,
    volumePerMonth: "~50 items",
    uptime: "100%",
    since: "Jan 2026",
  },
  {
    slug: "proposal-advisory",
    name: "Proposal Advisory System",
    category: "AI",
    description: "AI-powered proposal coaching tool for FirstPage Digital's proposal team. Submit a client brief (text + PDF) and get structured strategic guidance. Supports follow-up revisions, history with search/filter, and HTML/PDF export.",
    techStack: ["React 19", "Express 5", "Vite", "SQLite", "Claude Sonnet 4.6", "OpenRouter", "Docker"],
    integrations: ["OpenRouter"],
    status: "Prototype (In Use)",
    url: null,
    repoUrl: "https://github.com/FirstPage-Glass/Proposal-Advisory-System",
    hasWebUi: true,
    before: "Proposal team writes proposals from scratch with no structured guidance — inconsistent quality, missed red flags, 2-3 hours per proposal",
    after: "Brief intake form → AI generates 4-step strategic advisory in ~60 seconds. Sales team can iterate with follow-ups.",
    flow: "Brief Intake → PDF Upload → Express Backend → Claude Sonnet → Structured Advisory → Follow-up Revisions → History + Export",
    aiModels: ["Claude Sonnet 4.6"],
    impact: "Provides consistent, structured proposal guidance across the sales team",
    tagline: "Turns blank proposals into structured strategic advice in 60 seconds",
    coverImage: null,
    hoursSavedPerMonth: 60,
    costSavedPerMonth: 1800,
    volumePerMonth: "~20 proposals",
    uptime: "N/A",
    since: "Apr 2026",
  },
  {
    slug: "blog-upload",
    name: "Blog Upload Automation",
    category: "Automation",
    description: "End-to-end pipeline that parses Google Docs blog articles and pushes them as drafts to WordPress, Wix, and Shopify CMS platforms. Sends styled email reports after processing.",
    techStack: ["Python", "Google Docs API", "Google Drive API", "NocoDB API", "Resend", "WordPress REST API", "Wix API", "Shopify API"],
    integrations: ["Google Docs", "Google Drive", "NocoDB", "Resend", "WordPress", "Wix", "Shopify"],
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
    since: "Nov 2025",
  },
  {
    slug: "invoice-review",
    name: "Invoice Review System",
    category: "Automation",
    description: "Started as an automated email flow sending review requests to 16 Account Managers. After Finance team feedback that emails were still too much work, evolved into a full-stack web app with PIN auth, admin dashboard, review/dispute workflow, and automated HTML email distribution.",
    techStack: ["FastAPI", "SvelteKit", "Svelte 5", "TypeScript", "NocoDB", "Resend", "HMAC Auth"],
    integrations: ["NocoDB", "Resend"],
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
    since: "Dec 2025",
  },
  {
    slug: "overdue-reports",
    name: "Overdue Invoice Reports",
    category: "Automation",
    description: "Weekly AR aging report automation. Parses Excel files from finance, groups by Account Manager, categorizes by overdue age, and sends clear color-coded HTML emails to each AM every Monday.",
    techStack: ["Python", "openpyxl", "Resend", "pytest"],
    integrations: ["Resend"],
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
    since: "Sep 2025",
  },
  {
    slug: "invoice-email",
    name: "Invoice Review Email Flow",
    category: "Automation",
    description: "Twice-monthly automation processing invoice lists, calculating commission eligibility based on client retention rates (96.5% threshold), and sending personalized clear HTML emails to each Account Manager.",
    techStack: ["Python", "openpyxl", "Resend", "python-dotenv"],
    integrations: ["Resend"],
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
    since: "Oct 2025",
  },
  {
    slug: "content-brief-generate",
    name: "Content Brief Generate",
    category: "Automation",
    description: "38-node n8n workflow: form submission or sheet trigger → SERP data via Serper → competitor analysis with Cloudflare bypass → search intent classification → AI brief generation using minimax-m2, haiku-4.5, sonnet-4.5, and Gemini 2.5 Flash → Google Doc created from template → status tracking in Sheets.",
    techStack: ["n8n", "Serper API", "OpenRouter", "Google Sheets", "Google Docs", "Google Drive", "HTTP Request"],
    integrations: ["Serper API", "OpenRouter", "Google Sheets", "Google Docs", "Google Drive"],
    status: "Production",
    url: null,
    repoUrl: null,
    hasWebUi: false,
    before: "Manual competitor research + content brief writing — 1-2 hours per brief, inconsistent quality",
    after: "Form submission → SERP + competitor analysis + AI brief generation → Google Doc output in minutes",
    flow: "Form Trigger → Google Sheets → Serper SERP → Split Competitors → Call Competitors Analysis Flow → Merge → Search Intent (LLM) → Brief Agent (LLM) → Google Doc Template → Update Sheets",
    aiModels: ["minimax-m2", "haiku-4.5", "sonnet-4.5", "Gemini 2.5 Flash"],
    impact: "Automated content brief generation with multi-model AI pipeline",
    tagline: "SERP + competitor analysis + AI brief → Google Doc in minutes",
    coverImage: null,
    hoursSavedPerMonth: 40,
    costSavedPerMonth: 1200,
    volumePerMonth: "~20 briefs",
    uptime: "99.5%",
    since: "Mar 2026",
  },
  {
    slug: "td-generator-mvp",
    name: "TD Generator MVP",
    category: "Automation",
    description: "33-node n8n workflow system: form submission → Google Sheets → Jina Reader content scraping → CAPTCHA detection → TD Writer sub-workflow generates meta title and description via Google Gemini + OpenRouter → length validation with iterative shortening → writes back to Sheets with status tracking.",
    techStack: ["n8n", "Jina Reader", "Google Gemini", "OpenRouter", "Google Sheets", "HTTP Request"],
    integrations: ["Jina Reader", "Google Gemini", "OpenRouter", "Google Sheets"],
    status: "Production",
    url: null,
    repoUrl: null,
    hasWebUi: false,
    before: "Manual meta title and description writing for each page — inconsistent length, no SEO validation",
    after: "URL input → Auto-scrape → AI-generated title + description → Length-validated → Auto-write to Sheets",
    flow: "Form Trigger → Google Sheets → Jina Reader → CAPTCHA Check → Call TD Writer → Gemini/OpeRouter Title+Desc → Length Check → Iterative Shorten → Update Sheets",
    aiModels: ["Google Gemini", "OpenRouter"],
    impact: "Automated TD (title/description) generation with length validation and iterative refinement",
    tagline: "Auto-generates SEO title/description with length validation",
    coverImage: null,
    hoursSavedPerMonth: 30,
    costSavedPerMonth: 900,
    volumePerMonth: "~30 pages",
    uptime: "99.5%",
    since: "Apr 2026",
  },
];

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const getAiProjects = () => projects.filter((p) => p.category === "AI");
export const getAutomationProjects = () => projects.filter((p) => p.category === "Automation");

export const getTotalHoursSaved = () =>
  projects.reduce((sum, p) => sum + (p.hoursSavedPerMonth || 0), 0);

export const getTotalCostSaved = () =>
  projects.reduce((sum, p) => sum + (p.costSavedPerMonth || 0), 0);

export const getProductionCount = () =>
  projects.filter((p) => p.status === "Production" || p.status === "Live").length;

export const teamImpact = {
  "SEO / Link Building": {
    projects: ["pbn-content-automation", "blog-upload", "faq-schema-generator", "content-brief-generate", "td-generator-mvp"],
    monthlyVolume: "900+ backlinks + 30+ blog posts + 50+ TDs/briefs",
    keyMetrics: [
      { label: "PBN Sites Managed", value: "180+" },
      { label: "Backlinks/Month", value: "900+" },
      { label: "Blog Posts/Month", value: "~30" },
      { label: "CMS Platforms", value: "3" },
    ],
  },
  "Accounts & Finance": {
    projects: ["invoice-review", "overdue-reports", "invoice-email"],
    monthlyVolume: "800+ invoices tracked + weekly aging reports",
    keyMetrics: [
      { label: "Invoices/Cycle", value: "~400" },
      { label: "AMs Covered", value: "16" },
      { label: "Report Frequency", value: "Weekly + Bi-Monthly" },
      { label: "Email Delivery", value: "Resend HTML" },
    ],
  },
  "Sales / Proposals": {
    projects: ["proposal-advisory", "lovable-landing-page"],
    monthlyVolume: "20+ proposals guided + 10+ landing pages",
    keyMetrics: [
      { label: "Proposals/Month", value: "~20" },
      { label: "Landing Pages/Month", value: "~10" },
      { label: "AI Model", value: "Claude Sonnet 4.6" },
      { label: "Package Time", value: "~85 seconds" },
    ],
  },
  "Content / CX (Cathay)": {
    projects: ["cx-faq-paraphrase", "cx-faq-n8n"],
    monthlyVolume: "50+ FAQ items/batch with QA scoring",
    keyMetrics: [
      { label: "Items/Batch", value: "~50" },
      { label: "QA Threshold", value: "7.0/10" },
      { label: "AI Models", value: "Claude + GPT" },
      { label: "Workflow Steps", value: "9 (n8n)" },
    ],
  },
};

export const integrations = [
  { name: "NocoDB", type: "Database", usedBy: ["PBN", "CX FAQ", "Blog Upload", "Invoice Review"] },
  { name: "OpenRouter", type: "AI Gateway", usedBy: ["PBN", "CX FAQ", "Lovable", "Proposal", "Content Brief", "TD Generator"] },
  { name: "Resend", type: "Email API", usedBy: ["Blog Upload", "Invoice Review", "Overdue Reports"] },
  { name: "Google APIs", type: "Data Source", usedBy: ["PBN", "CX FAQ", "Blog Upload", "Content Brief", "TD Generator"] },
  { name: "WordPress API", type: "CMS/PBN", usedBy: ["PBN (180+ sites)", "Blog Upload"] },
  { name: "Claude", type: "AI Model", usedBy: ["PBN", "CX FAQ", "Proposal"] },
  { name: "Gemini", type: "AI Model", usedBy: ["FAQ Schema Generator", "TD Generator"] },
  { name: "Serper API", type: "SERP Data", usedBy: ["Content Brief"] },
  { name: "Jina Reader", type: "Web Scraper", usedBy: ["TD Generator"] },
];

// ===== Toolbox Data & Helpers =====

export const isToolCategory = (category: string): category is ToolCategory => {
  return ["AI", "Automation", "Internal", "Analytics"].includes(category);
};

export const projectToTool = (project: Project): Tool => ({
  slug: project.slug,
  name: project.name,
  category: isToolCategory(project.category) ? project.category : "Internal",
  description: project.description,
  techStack: project.techStack,
  tags: [
    project.category,
    ...(project.status === "Live" ? [] : [project.status]),
    ...(project.hasWebUi ? ["Web UI"] : []),
    ...(project.aiModels.length > 0 ? ["AI Powered"] : []),
    ...(project.url ? ["Live"] : []),
    ...(project.hoursSavedPerMonth ? [`${project.hoursSavedPerMonth}h saved/mo`] : []),
  ].filter(Boolean),
  status: project.status,
  url: project.url,
  repoUrl: project.repoUrl,
  hasWebUi: project.hasWebUi,
  impact: project.impact,
  quickAccess: project.hasWebUi,
  lastUsed: null,
  favorite: false,
});

export const getAllTools = (): Tool[] => projects.map(projectToTool);

export const getToolsByCategory = (category: ToolCategory | "All"): Tool[] => {
  const all = getAllTools();
  return category === "All" ? all : all.filter((t) => t.category === category);
};

export const filterTools = (filters: ToolFilter, tools?: Tool[]): Tool[] => {
  let results = tools || getAllTools();
  if (filters.search) {
    const searchLower = filters.search.toLowerCase().trim();
    if (searchLower) {
      results = results.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.techStack.some((tech) => tech.toLowerCase().includes(searchLower)) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
  }
  if (filters.category && filters.category !== "All") {
    results = results.filter((t) => t.category === filters.category);
  }
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((t) =>
      filters.tags!.some((tag) => t.tags.includes(tag))
    );
  }
  if (filters.hasWebUi !== undefined) {
    results = results.filter((t) => t.hasWebUi === filters.hasWebUi);
  }
  return results;
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  getAllTools().forEach((tool) => tool.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
};
