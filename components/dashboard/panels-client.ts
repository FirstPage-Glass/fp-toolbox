"use client";

import { useEffect, useState } from "react";
import type { WebsitePsi } from "@/lib/dashboard";
import type { AiPlans } from "@/lib/ai-plans";

export interface DashboardPanels {
  psi: WebsitePsi;
  plans: AiPlans | null;
}

// One in-flight fetch per days window, shared by every panel on the page, so
// the PSI card, PSI detail and both AI-plan cards make exactly one request.
const inflight = new Map<number, Promise<DashboardPanels>>();

function fetchPanels(days: number): Promise<DashboardPanels> {
  const existing = inflight.get(days);
  if (existing) return existing;
  const p = fetch(`/api/dashboard/panels?days=${days}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((d: DashboardPanels | null) => {
      if (!d) throw new Error("dashboard panels unavailable");
      return d;
    })
    .finally(() => inflight.delete(days));
  inflight.set(days, p);
  return p;
}

/**
 * Shared client state for the slow dashboard panels (PSI + AI plans). The page
 * shell renders a skeleton immediately (no server suspense → hydration isn't
 * blocked), and this fills in as soon as the server memoized values arrive.
 */
export function usePanels(days: number): DashboardPanels | null {
  const [panels, setPanels] = useState<DashboardPanels | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPanels(days)
      .then((d) => {
        if (!cancelled) setPanels(d);
      })
      .catch(() => {
        // Leave the skeleton — a transient 401/network blip shouldn't flash errors.
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  return panels;
}