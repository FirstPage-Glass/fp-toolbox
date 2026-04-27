import Link from "next/link";
import { teamImpact } from "@/lib/data";
import { fetchAllTools, fetchToolBySlug, getCoverImageUrl } from "@/lib/nocodb";

export async function generateStaticParams() {
  const tools = await fetchAllTools();
  return tools
    .filter((t) => t.slug)
    .map((tool) => ({ slug: tool.slug! }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Helpers ──────────────────────────────────────────────────────────

function getCategoryGradient(category: string) {
  const map: Record<string, string> = {
    AI: "from-violet-500 via-purple-600 to-fp-600",
    Automation: "from-emerald-500 via-teal-600 to-fp-600",
    System: "from-slate-600 via-slate-700 to-fp-700",
    Reporting: "from-amber-500 via-orange-600 to-fp-600",
    Content: "from-fp-400 via-fp-500 to-violet-600",
    Utility: "from-purple-500 via-violet-600 to-fp-600",
  };
  return map[category] || "from-violet-500 via-purple-600 to-fp-600";
}

function getCategoryIcon(category: string) {
  const map: Record<string, string> = {
    AI: "🤖",
    Automation: "⚡",
    System: "🖥️",
    Reporting: "📊",
    Content: "📝",
    Utility: "🛠️",
  };
  return map[category] || "🚀";
}

function getCategoryBg(category: string) {
  const map: Record<string, string> = {
    AI: "bg-purple-100 text-purple-700",
    Automation: "bg-emerald-100 text-emerald-700",
    System: "bg-slate-100 text-slate-700",
    Reporting: "bg-amber-100 text-amber-700",
    Content: "bg-fp-100 text-fp-700",
    Utility: "bg-purple-100 text-purple-700",
  };
  return map[category] || "bg-slate-100 text-slate-700";
}

function getStatusBadge(status: string) {
  if (status === "Production" || status === "Live" || status === "Active")
    return "bg-green-100 text-green-700";
  if (status === "Prototype (In Use)" || status === "Prototype")
    return "bg-amber-100 text-amber-700";
  if (status === "Building") return "bg-fp-100 text-fp-700";
  if (status === "Refactoring") return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-700";
}

function parseFlow(flow: string): string[] {
  return flow.split(/[→]|(->)/).map((s) => s?.trim()).filter(Boolean);
}

function parseTechStack(ts?: string | null): string[] {
  if (!ts) return [];
  return ts.split(/[+&,]/).map((t) => t.trim()).filter(Boolean);
}

function parseAiModels(am?: string | null): string[] {
  if (!am) return [];
  return am.split(",").map((m) => m.trim()).filter(Boolean);
}

function findTeamForProject(slug: string): string | null {
  for (const [team, data] of Object.entries(teamImpact)) {
    if (data.projects.includes(slug)) return team;
  }
  return null;
}

// ── Components ───────────────────────────────────────────────────────

function CoverImage({
  name,
  category,
  coverImage,
}: {
  name: string;
  category: string;
  coverImage?: string | null;
}) {
  if (coverImage) {
    return (
      <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg">
        <img src={coverImage} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  const gradient = getCategoryGradient(category);
  const icon = getCategoryIcon(category);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-white/30 mb-3">
          {icon}
        </div>
        <span className="text-white/90 font-bold text-4xl tracking-tight drop-shadow-lg">{initial}</span>
      </div>
    </div>
  );
}

function RoiCard({
  value,
  label,
  color,
  icon,
}: {
  value: string;
  label: string;
  color: "green" | "fp" | "violet" | "slate" | "amber";
  icon: string;
}) {
  const colorMap = {
    green: "bg-green-50 text-green-700 border-green-200",
    fp: "bg-fp-50 text-fp-700 border-fp-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border p-5 ${colorMap[color]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-current opacity-5" />
    </div>
  );
}

function StoryCard({
  type,
  title,
  content,
}: {
  type: "problem" | "solution" | "proof";
  title: string;
  content: string;
}) {
  const styles = {
    problem: { wrapper: "bg-red-50/80 border-red-200", accent: "bg-red-500", icon: "❌", title: "text-red-800", text: "text-red-700" },
    solution: { wrapper: "bg-green-50/80 border-green-200", accent: "bg-green-500", icon: "✅", title: "text-green-800", text: "text-green-700" },
    proof: { wrapper: "bg-fp-50/80 border-fp-200", accent: "bg-fp-500", icon: "📊", title: "text-fp-800", text: "text-fp-700" },
  };
  const s = styles[type];
  return (
    <div className={`relative rounded-xl border p-6 ${s.wrapper}`}>
      <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${s.accent}`} />
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{s.icon}</span>
        <h3 className={`text-lg font-bold ${s.title}`}>{title}</h3>
      </div>
      <p className={`text-base leading-relaxed ${s.text}`}>{content}</p>
    </div>
  );
}

function FlowStep({ step, index, total }: { step: string; index: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-lg bg-fp-500 text-white flex items-center justify-center font-bold text-sm shadow-md">{index + 1}</div>
          {index < total - 1 && <div className="absolute left-1/2 -translate-x-1/2 top-full h-4 w-0.5 bg-fp-200 md:hidden" />}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-slate-800 truncate">{step}</p>
        </div>
      </div>
      {index < total - 1 && (
        <div className="hidden md:flex flex-shrink-0 items-center justify-center w-8">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-fp-400">
            <path d="M4 10H16M16 10L12 6M16 10L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

function TechTag({ name, variant }: { name: string; variant: "tech" | "integration" | "ai" }) {
  const styles = {
    tech: "bg-slate-100 text-slate-700 border-slate-200",
    integration: "bg-fp-50 text-fp-700 border-fp-200",
    ai: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${styles[variant]}`}>
      {variant === "ai" && <span className="mr-1.5">🤖</span>}
      {variant === "integration" && <span className="mr-1.5">🔗</span>}
      {name}
    </span>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const tool = await fetchToolBySlug(slug);

  if (!tool || !tool.slug) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">System Not Found</h1>
        <p className="text-slate-500 mb-6">This system doesn&apos;t exist in NocoDB.</p>
        <Link href="/systems" className="text-fp-500 font-medium hover:underline">← Back to Our Systems</Link>
      </div>
    );
  }

  // All data from NocoDB
  const name = tool.name;
  const category = tool.category || "Utility";
  const status = tool.status || "Unknown";
  const type = tool.type || [];
  const description = tool.description || "";
  const tagline = tool.tagline || description;
  const url = tool.live_link || null;
  const repoUrl = tool.gh_link || null;
  const hasWebUi = Boolean(url);
  const coverImage = tool.cover_image && tool.cover_image.length > 0 ? getCoverImageUrl(tool.cover_image[0]) : null;

  // Rich content from NocoDB
  const before = tool.before || null;
  const after = tool.after || null;
  const impact = tool.impact || null;
  const flow = tool.flow || null;
  const hoursSaved = tool.hours_saved_per_month || null;
  const costSaved = tool.cost_saved_per_month || null;
  const volume = tool.volume_per_month || null;
  const uptime = tool.uptime || null;
  const since = tool.since || null;
  const techStack = parseTechStack(tool.tech_stack);
  const aiModels = parseAiModels(tool.ai_models);

  const flowSteps = flow ? parseFlow(flow) : [];
  const teamName = findTeamForProject(slug);

  // ROI cards
  const roiCards: { value: string; label: string; color: Parameters<typeof RoiCard>[0]["color"]; icon: string }[] = [];
  if (costSaved) roiCards.push({ value: `HK$${costSaved.toLocaleString()}`, label: "Value / Month", color: "fp", icon: "💰" });
  if (hoursSaved) roiCards.push({ value: `${hoursSaved}h`, label: "Hours Saved / Month", color: "green", icon: "⏱️" });
  if (volume) roiCards.push({ value: volume, label: "Monthly Volume", color: "violet", icon: "📈" });
  if (uptime) roiCards.push({ value: uptime, label: "Uptime", color: "slate", icon: "🟢" });
  else if (since) roiCards.push({ value: since, label: "Running Since", color: "amber", icon: "📅" });

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-fp-500 transition-colors">Home</Link>
        <span className="text-slate-300">/</span>
        <Link href="/systems" className="hover:text-fp-500 transition-colors">Our Systems</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-medium">{name}</span>
      </nav>

      {/* Hero */}
      <section className="space-y-5">
        <CoverImage name={name} category={category} coverImage={coverImage} />

        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getCategoryBg(category)}`}>{category}</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(status)}`}>{status}</span>
          {type.map((t) => (
            <span key={t} className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">{t}</span>
          ))}
          {hasWebUi && <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-fp-100 text-fp-700">Web UI</span>}
          {teamName && <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-600">{teamName}</span>}
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{name}</h1>
          <p className="mt-3 text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl">{tagline}</p>
        </div>
      </section>

      {/* ROI */}
      {roiCards.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Business Impact at a Glance</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {roiCards.map((card, i) => <RoiCard key={i} {...card} />)}
          </div>
        </section>
      )}

      {/* Story */}
      {before && after && impact && (
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">The Story</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <StoryCard type="problem" title="The Problem" content={before} />
            <StoryCard type="solution" title="The Solution" content={after} />
            <StoryCard type="proof" title="The Proof" content={impact} />
          </div>
        </section>
      )}

      {/* Flow */}
      {flowSteps.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><span>🔀</span> How It Works</h2>
          <div className="space-y-3">
            {flowSteps.map((step, i) => <FlowStep key={i} step={step} index={i} total={flowSteps.length} />)}
          </div>
        </section>
      )}

      {/* Tech */}
      {(techStack.length > 0 || aiModels.length > 0) && (
        <section className="grid md:grid-cols-2 gap-6">
          {techStack.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><span>🛠️</span> Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => <TechTag key={tech} name={tech} variant="tech" />)}
              </div>
            </div>
          )}
          {aiModels.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><span>🧠</span> AI Models</h2>
              <div className="flex flex-wrap gap-2">
                {aiModels.map((model) => <TechTag key={model} name={model} variant="ai" />)}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Links */}
      <section className="flex flex-wrap gap-4">
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-fp-500 text-white rounded-xl font-semibold hover:bg-fp-600 transition-all shadow-lg shadow-fp-500/25 hover:shadow-fp-500/40 hover:-translate-y-0.5">
            <span>🌐</span> Open Live Tool
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-70"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        )}
        {repoUrl && (
          <a href={repoUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-all shadow-lg shadow-slate-800/25 hover:shadow-slate-800/40 hover:-translate-y-0.5">
            <span>📁</span> View Source Code
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-70"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        )}
      </section>
    </div>
  );
}
