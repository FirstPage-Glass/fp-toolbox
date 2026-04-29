"use client";

import { useState, useEffect } from "react";

interface ShowcaseItem {
  Id: number;
  title?: string | null;
  imageUrl: string | null;
}

export default function ShowcaseSection({ showcases }: { showcases: ShowcaseItem[] }) {
  const [lightbox, setLightbox] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  if (!showcases || showcases.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Showcase</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcases.map((showcase) =>
          showcase.imageUrl ? (
            <button
              key={showcase.Id}
              type="button"
              onClick={() => setLightbox(showcase)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={showcase.imageUrl}
                  alt={showcase.title || "Showcase image"}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{showcase.title || "Untitled"}</h3>
              </div>
            </button>
          ) : (
            <div
              key={showcase.Id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{showcase.title || "Untitled"}</h3>
              </div>
            </div>
          )
        )}
      </div>

      {lightbox && lightbox.imageUrl && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl mx-auto min-h-full flex flex-col items-center justify-start pt-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              Close ✕
            </button>
            <img
              src={lightbox.imageUrl}
              alt={lightbox.title || "Showcase image"}
              className="w-full rounded-xl shadow-2xl"
            />
            {lightbox.title && (
              <p className="text-white/80 text-sm mt-3 text-center mb-8">{lightbox.title}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
