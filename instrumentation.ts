/**
 * Server bootstrap hook (Next.js instrumentation).
 * Starts the 5-minute uptime checker for the dashboard target.
 * Node runtime only — never runs in the edge runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startUptimeScheduler } = await import("./lib/uptime-scheduler");
    startUptimeScheduler();
  }
}
