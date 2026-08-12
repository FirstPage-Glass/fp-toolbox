"use client";

import { useState } from "react";
import type { TeamsView, TeamView } from "@/lib/gateway/service";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import ErrorBanner from "@/components/ui/ErrorBanner";

interface GatewayClientProps {
  initialView: TeamsView;
  username: string;
}

const BAR_COLOR: Record<"ok" | "warn" | "over", string> = {
  ok: "bg-blue",
  warn: "bg-[oklch(0.72_0.15_75)]",
  over: "bg-[oklch(0.62_0.2_22)]",
};

function usagePct(usage: number | null, limit: number): number {
  if (usage === null || limit <= 0) return 0;
  return Math.min(100, (usage / limit) * 100);
}

function usageLevel(usage: number | null, limit: number): "ok" | "warn" | "over" {
  if (usage === null) return "ok";
  const pct = (usage / limit) * 100;
  if (pct >= 100) return "over";
  if (pct >= 80) return "warn";
  return "ok";
}

function fmtUsd(n: number | null): string {
  return n === null ? "—" : `$${n.toFixed(2)}`;
}

/** Copy-to-clipboard with a tiny fallback (internal tool). */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

export default function GatewayClient({ initialView, username }: GatewayClientProps) {
  const [view, setView] = useState<TeamsView>(initialView);
  const [busyTeam, setBusyTeam] = useState<number | null>(null);
  const [issued, setIssued] = useState<{ teamName: string; key: string; label: string } | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  // Admin create-team form
  const [newName, setNewName] = useState("");
  const [newChampion, setNewChampion] = useState("");
  const [newLimit, setNewLimit] = useState("30");

  const refresh = async (): Promise<void> => {
    const res = await fetch("/api/gateway", { cache: "no-store" });
    if (!res.ok) {
      setError(`Failed to refresh (${res.status})`);
      return;
    }
    setView((await res.json()) as TeamsView);
  };

  const issueKey = async (team: TeamView): Promise<void> => {
    setError("");
    setNotice("");
    setBusyTeam(team.id);
    try {
      const res = await fetch(`/api/gateway/teams/${team.id}/keys`, { method: "POST" });
      const body = (await res.json()) as { key?: string; label?: string; message?: string; error?: string };
      if (!res.ok || !body.key) {
        setError(body.error ?? `Issue failed (${res.status})`);
        return;
      }
      setIssued({ teamName: team.name, key: body.key, label: body.label ?? "" });
      setNotice(body.message ?? "Key issued.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyTeam(null);
    }
  };

  const revokeKey = async (team: TeamView): Promise<void> => {
    if (!window.confirm(`Revoke the key for team "${team.name}"? It stops working immediately.`)) {
      return;
    }
    setError("");
    setNotice("");
    setBusyTeam(team.id);
    try {
      const res = await fetch(`/api/gateway/teams/${team.id}/keys`, { method: "DELETE" });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? `Revoke failed (${res.status})`);
        return;
      }
      setNotice(`Key for "${team.name}" revoked.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyTeam(null);
    }
  };

  const createTeam = async (): Promise<void> => {
    setError("");
    setNotice("");
    if (!newName.trim() || !newChampion.trim()) {
      setError("Team name and champion are required");
      return;
    }
    try {
      const res = await fetch("/api/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), champion: newChampion.trim(), limitUsd: Number(newLimit) || 30 }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? `Create failed (${res.status})`);
        return;
      }
      setNotice(`Team "${newName.trim()}" created.`);
      setNewName("");
      setNewChampion("");
      setNewLimit("30");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const teamName = (id: number): string => view.teams.find((t) => t.id === id)?.name ?? `#${id}`;

  if (view.teams.length === 0 && !view.isAdmin) {
    return (
      <EmptyState
        icon="🔑"
        title={`You (${username}) are not a team champion`}
        description="Ask an admin to assign you a team, or use your team's key as provided by your champion."
      />
    );
  }

  return (
    <div className="space-y-6">
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      {notice ? (
        <div className="rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] text-emerald-800">
          {notice}
        </div>
      ) : null}

      {/* Issued key — shown exactly once */}
      {issued ? (
        <Card className="border-amber-300 bg-amber-50/60">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[15px] font-extrabold text-navy">New key for {issued.teamName}</h2>
            <Badge color="amber">shown once</Badge>
          </div>
          <p className="text-[13px] text-muted mb-3">
            Copy it now — fp-toolbox never stores the plaintext key. Share it with your team
            (or configure their AI client directly). It counts against the team&apos;s monthly ${view.teams[0]?.limitUsd ?? 30} pool.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="flex-1 min-w-[280px] break-all rounded-[10px] bg-white border border-border px-3.5 py-2.5 font-mono text-[13px] text-navy">
              {issued.key}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                const ok = await copyText(issued.key);
                setCopied(ok);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </Button>
          </div>
          <p className="mt-3 text-[12.5px] text-muted">
            Base URL: <code className="font-mono">https://openrouter.ai/api/v1</code> · Model:{" "}
            <code className="font-mono">deepseek/deepseek-v4-flash</code>
          </p>
        </Card>
      ) : null}

      {view.isAdmin ? (
        <Card>
          <h2 className="text-[15px] font-extrabold text-navy mb-3">Create team</h2>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px_auto] items-end">
            <Input label="Team name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Sales A" />
            <Input label="Champion (login username)" value={newChampion} onChange={(e) => setNewChampion(e.target.value)} placeholder="e.g. glass" />
            <Input label="Limit $/mo" type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} />
            <Button onClick={() => void createTeam()} disabled={busyTeam !== null}>
              Create
            </Button>
          </div>
        </Card>
      ) : null}

      {view.teams.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2 items-start">
          {view.teams.map((team) => {
            const pct = usagePct(team.currentUsageUsd, team.limitUsd);
            const level = usageLevel(team.currentUsageUsd, team.limitUsd);
            const isMine = team.champion === username;
            return (
              <Card key={team.id}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-[16px] font-extrabold text-navy">{team.name}</h2>
                    <p className="mt-0.5 text-[12.5px] text-muted">
                      Champion: <span className="font-semibold text-navy">{team.champion}</span>
                      {isMine ? " (you)" : ""}
                    </p>
                  </div>
                  {team.keyHash ? (
                    <Badge color="emerald">key active</Badge>
                  ) : (
                    <Badge color="slate">no key</Badge>
                  )}
                </div>

                {/* Usage bar */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted">
                      This month
                    </span>
                    <span className="text-[13px] font-bold text-navy tabular-nums">
                      {fmtUsd(team.currentUsageUsd)} / ${team.limitUsd.toFixed(0)}{" "}
                      <span className="text-muted font-semibold">({Math.round(pct)}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-surface overflow-hidden">
                    <div
                      className={`h-full rounded-full ${BAR_COLOR[level]}`}
                      style={{ width: `${Math.max(pct, team.currentUsageUsd === null ? 0 : 2)}%` }}
                    />
                  </div>
                </div>

                {/* Key + actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {team.keyHash ? (
                    <>
                      <code className="rounded-[8px] bg-surface border border-border px-2.5 py-1.5 font-mono text-[12px] text-muted">
                        {team.keyLabel ?? "active"}
                      </code>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={busyTeam === team.id}
                        onClick={() => void revokeKey(team)}
                      >
                        {busyTeam === team.id ? "Working…" : "Revoke"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={busyTeam === team.id}
                      onClick={() => void issueKey(team)}
                    >
                      {busyTeam === team.id ? "Issuing…" : "Issue key"}
                    </Button>
                  )}
                </div>

                {/* Recent snapshots */}
                {team.snapshots.length > 0 ? (
                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted mb-1.5">
                      Recent checks
                    </p>
                    <ul className="space-y-1">
                      {team.snapshots.slice(0, 6).map((s, i) => (
                        <li
                          key={`${s.capturedAt}-${i}`}
                          className="flex justify-between text-[12.5px] text-muted"
                        >
                          <span>{new Date(s.capturedAt).toLocaleString()}</span>
                          <span className="font-mono tabular-nums text-navy">${s.usageUsd.toFixed(3)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      ) : null}

      {view.isAdmin && view.alerts.length > 0 ? (
        <Card tone="slate">
          <h2 className="text-[15px] font-extrabold text-navy mb-3">Recent alerts</h2>
          <ul className="space-y-1.5">
            {view.alerts.map((a, i) => (
              <li key={`${a.teamId}-${a.level}-${i}`} className="flex items-center gap-2 text-[13px]">
                <Badge color={a.level === "100" ? "rose" : "amber"}>{a.level === "100" ? "limit hit" : "80%"}</Badge>
                <span className="font-semibold text-navy">{teamName(a.teamId)}</span>
                <span className="text-muted">${a.usageUsd.toFixed(2)}</span>
                <span className="ml-auto text-muted">{new Date(a.sentAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
