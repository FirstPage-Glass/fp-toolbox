"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ────────────────────────────────
   Presentation Deck — Jobs Done
   Keyboard: ← → or Space to advance
   ──────────────────────────────── */

const SLIDES = 9;

export default function PresentationPage() {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = useCallback(
    (n: number) => {
      if (n < 0 || n >= SLIDES) return;
      setDirection(n > slide ? "right" : "left");
      setSlide(n);
    },
    [slide]
  );

  const next = useCallback(() => goTo(slide + 1), [goTo, slide]);
  const prev = useCallback(() => goTo(slide - 1), [goTo, slide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SLIDES - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo]);

  const pct = ((slide + 1) / SLIDES) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Slide Area */}
      <div
        className="flex-1 relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x > rect.width / 2) next();
          else prev();
        }}
      >
        <SlideContent slide={slide} direction={direction} />
      </div>

      {/* Bottom Bar: progress + dots + instructions */}
      <div className="h-14 bg-slate-900/80 backdrop-blur border-t border-slate-800 flex items-center px-6 gap-4 shrink-0 select-none">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-fp-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === slide ? "bg-fp-400 scale-125" : "bg-slate-600 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 font-mono tabular-nums w-12 text-right">
          {slide + 1}/{SLIDES}
        </span>
        <span className="hidden md:inline text-xs text-slate-600">
          ← → Space
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────
   Slide Router
   ──────────────────────────────── */
function SlideContent({
  slide,
  direction,
}: {
  slide: number;
  direction: "left" | "right";
}) {
  const slides = [
    <TitleSlide key="title" />,
    <MissionSlide key="mission" />,
    <PortfolioSlide key="portfolio" />,
    <SystemsSlide key="systems" />,
    <TeamSlide key="team" />,
    <ImpactSlide key="impact" />,
    <TechSlide key="tech" />,
    <RoadmapSlide key="roadmap" />,
    <ClosingSlide key="closing" />,
  ];

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <AnimateSlide direction={direction}>{slides[slide]}</AnimateSlide>
    </div>
  );
}

function AnimateSlide({
  children,
  direction,
}: {
  children: React.ReactNode;
  direction: "left" | "right";
}) {
  const translate = direction === "right" ? "translate-x-8" : "-translate-x-8";
  return (
    <div
      className={`min-h-full flex items-center justify-center p-6 md:p-12 animate-fade-in ${translate} opacity-0`}
      style={{
        animation: "fadeSlideIn 0.45s ease-out forwards",
      }}
    >
      {children}
    </div>
  );
}

/* ───────── Slide 1: Title ───────── */
function TitleSlide() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fp-500/10 border border-fp-500/20 text-fp-300 text-sm font-medium mb-8">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Live Portfolio — April 2026
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
        FirstPage HK
        <br />
        <span className="text-fp-400">AI & Automation</span>
      </h1>
      <p className="text-xl md:text-2xl text-slate-400 mb-10 font-light">
        Jobs Done — Systems Built — Impact Delivered
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
        <span className="flex items-center gap-2">
          <span className="text-lg">👤</span> Glass Chan
        </span>
        <span className="hidden md:inline text-slate-700">|</span>
        <span>25 Systems</span>
        <span className="hidden md:inline text-slate-700">|</span>
        <span>220h Saved/Month</span>
        <span className="hidden md:inline text-slate-700">|</span>
        <span>HK$64,200/mo</span>
      </div>
    </div>
  );
}

/* ───────── Slide 2: Mission ───────── */
function MissionSlide() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">The Mission</h2>
        <p className="text-slate-400 text-lg">
          Turn repetitive work into self-running systems
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            emoji: "⚡",
            title: "Automate First",
            desc: "If a human does it twice, we build a pipeline. No job too small — from invoice emails to 900+ backlinks.",
          },
          {
            emoji: "🤖",
            title: "AI-Native",
            desc: "Every new system starts with AI. Claude, Gemini, GPT — we route to the best model for the job via OpenRouter.",
          },
          {
            emoji: "🌐",
            title: "Self-Service",
            desc: "No tool should need Glass to run it. Every system has docs, a UI, or an n8n workflow the team can trigger.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center hover:border-fp-500/30 transition-colors"
          >
            <div className="text-4xl mb-4">{item.emoji}</div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Slide 3: Portfolio at a Glance ───────── */
function PortfolioSlide() {
  const metrics = [
    { label: "Systems Built", value: "25", sub: "11 Active · 2 Prototype · 1 Building · 1 Refactoring · 10 Planned" },
    { label: "Hours Saved / Month", value: "220h", sub: "Across all active automations" },
    { label: "Cost Reduction / Month", value: "HK$64,200", sub: "At blended labour rates" },
    { label: "Teams Served", value: "7", sub: "Finance · AMs · SEO Tech · Content · Sales · Clients · Everyone" },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Portfolio at a Glance</h2>
        <p className="text-slate-400 text-lg">Every number is production — not a projection</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-fp-500/30 transition-colors"
          >
            <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wider">
              {m.label}
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-fp-400 mb-3">
              {m.value}
            </div>
            <div className="text-sm text-slate-400">{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Slide 4: Systems by Status ───────── */
function SystemsSlide() {
  const rows = [
    { status: "Production / Live", count: 11, color: "bg-green-500", pct: 44 },
    { status: "Building", count: 1, color: "bg-fp-500", pct: 4 },
    { status: "Prototype (In Use)", count: 1, color: "bg-amber-500", pct: 4 },
    { status: "Prototype", count: 1, color: "bg-amber-400", pct: 4 },
    { status: "Refactoring", count: 1, color: "bg-violet-500", pct: 4 },
    { status: "Planned", count: 10, color: "bg-blue-500", pct: 40 },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Systems by Status</h2>
        <p className="text-slate-400 text-lg">
          44% production-ready, 40% in the pipeline
        </p>
      </div>
      <div className="space-y-6">
        {rows.map((r) => (
          <div key={r.status}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-300">{r.status}</span>
              <span className="text-slate-500">
                {r.count} <span className="text-slate-600">({r.pct}%)</span>
              </span>
            </div>
            <div className="h-5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${r.color} rounded-full transition-all duration-1000`}
                style={{ width: `${r.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Slide 5: Team Coverage ───────── */
function TeamSlide() {
  const teams = [
    { name: "SEO / Link Building", emoji: "🔍", tools: 5, impact: "900+ backlinks, 30+ blogs, 50+ briefs/mo" },
    { name: "Accounts & Finance", emoji: "💰", tools: 5, impact: "800+ invoices, weekly aging, 16 AMs" },
    { name: "Sales / Proposals", emoji: "📈", tools: 2, impact: "20+ proposals, 10+ landing pages/mo" },
    { name: "Content / CX (Cathay)", emoji: "✈️", tools: 2, impact: "50+ FAQ items/batch with QA scoring" },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Who We Serve</h2>
        <p className="text-slate-400 text-lg">Every team at FirstPage HK has dedicated automation</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {teams.map((t) => (
          <div
            key={t.name}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-fp-500/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">{t.emoji}</span>
              <div>
                <h3 className="text-xl font-bold">{t.name}</h3>
                <p className="text-sm text-slate-500">{t.tools} systems</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">{t.impact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Slide 6: Before vs After ───────── */
function ImpactSlide() {
  const pairs = [
    { before: "Manual invoice sorting every Monday", after: "Auto email reports at noon — zero work" },
    { before: "Copy-paste blog uploads to 3 CMS platforms", after: "Google Doc URL → published in 2 min" },
    { before: "Proposals written from scratch, 30+ min each", after: "AI advisory in 5 min, consistent every time" },
    { before: "Taobao writers + manual uploads for 900+ backlinks", after: "Fully automated 6-step pipeline" },
    { before: "No central tool directory — ask Glass for links", after: "Self-service portal at toolbox.firstpage.com.hk" },
    { before: "FAQ sections written manually per page", after: "AI FAQ schema generator — 10 seconds" },
    { before: "SEO briefs done ad hoc — guess the structure", after: "SERP + competitor + AI brief in one click" },
    { before: "Tech docs from scratch — hours per client", after: "AI-generated, client-ready in minutes" },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Changed</h2>
        <p className="text-slate-400 text-lg">8 workflows — before and after</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {pairs.map((p, i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-red-400 font-bold text-xs uppercase tracking-wider mt-0.5">Before</span>
              <span className="text-slate-400 text-sm">{p.before}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-xs uppercase tracking-wider mt-0.5">After</span>
              <span className="text-slate-200 text-sm font-medium">{p.after}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Slide 7: Tech Stack ───────── */
function TechSlide() {
  const stacks = [
    {
      title: "Orchestration",
      items: ["n8n (38-node workflows)", "Python (FastAPI + scripts)", "Next.js 16 + React 19"],
      color: "text-fp-400",
    },
    {
      title: "AI Models",
      items: ["Claude Sonnet 4.6", "Google Gemini 2.5", "GPT-5.4-mini", "OpenRouter (routing)"],
      color: "text-violet-400",
    },
    {
      title: "Data & APIs",
      items: ["NocoDB (source of truth)", "Google Sheets / Docs / Drive", "WordPress API (180+ sites)", "Resend (email)"],
      color: "text-amber-400",
    },
    {
      title: "Infrastructure",
      items: ["Docker", "Coolify", "GitHub Actions", "Vercel"],
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Tech Stack</h2>
        <p className="text-slate-400 text-lg">What powers every system</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {stacks.map((s) => (
          <div
            key={s.title}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors"
          >
            <h3 className={`text-lg font-bold mb-4 ${s.color}`}>{s.title}</h3>
            <ul className="space-y-2">
              {s.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Slide 8: Roadmap ───────── */
function RoadmapSlide() {
  const planned = [
    { name: "OCR Invoice Processing", owner: "Rita Lam", desc: "Auto-read scanned invoices into structured data" },
    { name: "Client Onboarding Bot", owner: "Rita Lam", desc: "Slack bot guiding new clients through setup" },
    { name: "SEO Audit Reporter", owner: "Rita Lam", desc: "Automated technical SEO audit with PDF output" },
    { name: "Keyword Gap Analyzer", owner: "Rita Lam", desc: "Compare client vs competitor keyword coverage" },
    { name: "Rank Tracker Alerts", owner: "Rita Lam", desc: "Daily rank change alerts with trend charts" },
    { name: "Content Calendar Bot", owner: "Crystal Chan", desc: "Auto-schedule and assign content from briefs" },
    { name: "Social Media Scheduler", owner: "Crystal Chan", desc: "Queue and post across platforms from Sheets" },
    { name: "Lead Scoring Pipeline", owner: "Crystal Chan", desc: "Auto-score inbound leads by behaviour + data" },
    { name: "Competitor Alert System", owner: "Crystal Chan", desc: "Monitor competitor site changes and pricing" },
    { name: "Internal Wiki Search", owner: "Crystal Chan", desc: "AI-powered search across all FP docs and SOPs" },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">What&apos;s Next</h2>
        <p className="text-slate-400 text-lg">10 planned automations from team questionnaires</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {planned.map((p) => (
          <div
            key={p.name}
            className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-200 text-sm">{p.name}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{p.owner}</span>
            </div>
            <p className="text-slate-500 text-xs">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Slide 9: Closing ───────── */
function ClosingSlide() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-extrabold mb-6">Thank You</h2>
      <p className="text-xl text-slate-400 mb-10">
        25 systems. 220 hours saved every month. HK$64,200 in cost reduction.
        <br />
        And we&apos;re just getting started.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Portfolio", value: "fp-toolbox.com" },
          { label: "Email", value: "glass.c@firstpage.com.hk" },
          { label: "Slack", value: "@glasschan" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
          >
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
            <div className="text-sm font-semibold text-slate-300">{item.value}</div>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-fp-500 hover:bg-fp-600 text-white rounded-xl font-medium transition-colors"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
