"use client";

/**
 * Top-level error boundary. Every dashboard zone already degrades to inline
 * errors, but a real throw (DB outage, regression) previously rendered Next's
 * raw error overlay — this keeps a page failure a readable, retryable screen.
 */
export default function RootError({ reset }: { reset: () => void }) {
  return (
    <div className="flex-1 grid place-items-center px-6 py-16">
      <div className="max-w-[480px] text-center">
        <div className="w-14 h-14 rounded-[14px] bg-grad-banner grid place-items-center text-white font-extrabold text-xl tracking-widest mb-5 mx-auto">
          FP
        </div>
        <h1 className="text-[22px] font-extrabold text-navy">Something went wrong</h1>
        <p className="mt-2 text-muted text-sm">
          The dashboard hit an unexpected error. It may be a temporary database
          or external-API issue.
        </p>
        <button
          onClick={reset}
          className="mt-6 px-5 py-2.5 rounded-lg text-[13.5px] font-bold text-white bg-grad-cta shadow-sm hover:brightness-105 cursor-pointer transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}