"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "website", label: "Website Performance" },
  { id: "sales", label: "Sales Performance" },
] as const;

/**
 * Sticky in-page section nav for the two dashboard halves. Scrollspy via
 * IntersectionObserver: the section crossing the middle band becomes active.
 * Mobile: horizontally scrollable pills.
 */
export default function SectionNav() {
  const [active, setActive] = useState<string>("website");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Band across the middle of the viewport: a section is "current" while
      // it covers the band. Works with the sticky nav + header offsets.
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Dashboard sections"
      className="sticky top-16 z-40 border-b border-slate-200 bg-white/90 backdrop-blur"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-2.5">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-fp-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
