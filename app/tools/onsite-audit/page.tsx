"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { usePrefill } from "@/components/tools/usePrefill";

type Verdict = "pass" | "fail" | "warn" | "manual" | "n-a";
type ActionStatus = "pending" | "in-progress" | "done" | "n-a";

interface Progress {
  status: string;
  phase: string;
  message: string;
  pagesCrawled: number;
  pagesTotal: number;
}

interface AuditResult {
  jobId: string;
  target: string;
  domain: string;
  sections: { name: string; items: { id: string; item: string; kind: string; verdict: Verdict; evidence?: string }[] }[];
  summary: { passed: number; failed: number; warned: number; manual: number; total: number };
  manualActions: { id: string; item: string; section: string; instruction: string }[];
  llmSummary: string;
}

interface HistoryEntry {
  id: number;
  domain: string;
  createdAt: string;
  summary: { passed: number; failed: number; warned: number; manual: number } | null;
}

interface ActionState {
  status: ActionStatus;
  note: string;
  saved: boolean;
  saving: boolean;
}

const VERDICT_STYLE: Record<Verdict, { label: string; cls: string }> = {
  pass: { label: "Pass", cls: "bg-emerald-100 text-emerald-700" },
  fail: { label: "Fail", cls: "bg-rose-100 text-rose-700" },
  warn: { label: "Review", cls: "bg-amber-100 text-amber-700" },
  manual: { label: "Manual", cls: "bg-slate-200 text-slate-600" },
  "n-a": { label: "N/A", cls: "bg-violet-100 text-violet-700" },
};

const ACTION_STYLE: Record<ActionStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-slate-200 text-slate-600" },
  "in-progress": { label: "In progress", cls: "bg-blue-100 text-blue-700" },
  done: { label: "Done", cls: "bg-emerald-100 text-emerald-700" },
  "n-a": { label: "N/A", cls: "bg-violet-100 text-violet-700" },
};

const ACTION_STATUSES: ActionStatus[] = ["pending", "in-progress", "done", "n-a"];
const ACTION_FILTERS: ("all" | ActionStatus)[] = ["all", ...ACTION_STATUSES];

function statusText(s: string): string {
  if (s === "crawling") return "Crawling";
  if (s === "collecting") return "Collecting signals";
  if (s === "summarizing") return "Summarizing";
  if (s === "done") return "Done";
  if (s === "error") return "Error";
  return "Queued";
}

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function toMarkdown(r: AuditResult): string {
  const lines: string[] = [`# Onsite SEO Audit — ${r.domain}`, "", r.llmSummary, ""];
  lines.push(`**Summary:** ${r.summary.passed} pass · ${r.summary.failed} fail · ${r.summary.warned} review · ${r.summary.manual} manual`, "");
  for (const sec of r.sections) {
    lines.push(`## ${sec.name}`, "");
    lines.push("| # | Check | Status | Evidence |", "|---|-------|--------|----------|");
    for (const it of sec.items) {
      const st = VERDICT_STYLE[it.verdict]?.label ?? it.verdict;
      lines.push(`| ${it.id} | ${it.item.replace(/\|/g, "\\|")} | ${st} | ${(it.evidence ?? "").replace(/\|/g, "\\|")} |`);
    }
    lines.push("");
  }
  if (r.manualActions.length) {
    lines.push("## Manual actions needed", "");
    for (const m of r.manualActions) lines.push(`- [ ] **${m.id}** ${m.item} — ${m.instruction}`);
  }
  return lines.join("\n");
}

export default function OnsiteAuditPage() {
  const prefill = usePrefill();
  const [url, setUrl] = useState(prefill.url || "");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [actions, setActions] = useState<Record<string, ActionState>>({});
  const [actionFilter, setActionFilter] = useState<"all" | ActionStatus>("all");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/tools/onsite-audit");
      const json = await res.json();
      if (json.history) setHistory(json.history);
    } catch {
      // history is best-effort
    }
  }, []);

  const loadActions = useCallback(async (domain: string) => {
    try {
      const res = await fetch(`/api/tools/onsite-audit/actions?domain=${encodeURIComponent(domain)}`);
      const json = await res.json();
      if (Array.isArray(json.actions)) {
        const map: Record<string, ActionState> = {};
        for (const a of json.actions as { itemId: string; status: ActionStatus; note: string }[]) {
          map[a.itemId] = { status: a.status, note: a.note, saved: true, saving: false };
        }
        setActions(map);
      }
    } catch {
      // actions are best-effort
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tools/onsite-audit")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.history) setHistory(json.history);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      stopPoll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async () => {
    setError(null);
    setResult(null);
    setActions({});
    setStarting(true);
    try {
      const res = await fetch("/api/tools/onsite-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to start audit");
        setStarting(false);
        return;
      }
      setProgress(json.progress);
      setStarting(false);
      pollRef.current = setInterval(async () => {
        const pr = await fetch(`/api/tools/onsite-audit?jobId=${json.jobId}`);
        const pj = await pr.json();
        if (pj.error) {
          setError(pj.error);
          stopPoll();
          return;
        }
        setProgress(pj.progress);
        if (pj.progress?.status === "done" && pj.result) {
          setResult(pj.result);
          stopPoll();
          void refreshHistory();
          void loadActions(pj.result.domain);
        } else if (pj.progress?.status === "error") {
          setError(pj.progress.message || "Audit failed");
          stopPoll();
        }
      }, 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStarting(false);
    }
  };

  const busy = starting || (progress && ["queued", "crawling", "collecting", "summarizing"].includes(progress.status));

  const loadRun = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`/api/tools/onsite-audit?outputId=${id}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to load run");
        return;
      }
      setResult(json.output as AuditResult);
      setProgress(null);
      if (Array.isArray(json.actions)) {
        const map: Record<string, ActionState> = {};
        for (const a of json.actions as { itemId: string; status: ActionStatus; note: string }[]) {
          map[a.itemId] = { status: a.status, note: a.note, saved: true, saving: false };
        }
        setActions(map);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const updateAction = async (itemId: string, patch: Partial<Pick<ActionState, "status" | "note">>) => {
    if (!result) return;
    const prev = actions[itemId] ?? { status: "pending" as ActionStatus, note: "", saved: true, saving: false };
    setActions((a) => ({ ...a, [itemId]: { ...prev, ...patch, saving: true } }));
    try {
      const res = await fetch("/api/tools/onsite-audit/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: result.domain,
          itemId,
          status: patch.status ?? prev.status,
          note: patch.note ?? prev.note,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setActions((a) => ({ ...a, [itemId]: { ...a[itemId], saved: true, saving: false } }));
    } catch (e) {
      setActions((a) => ({ ...a, [itemId]: { ...a[itemId], saved: false, saving: false } }));
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const manualList = result?.manualActions ?? [];
  const doneCount = manualList.filter((m) => {
    const s = actions[m.id]?.status;
    return s === "done" || s === "n-a";
  }).length;
  const filteredManual = manualList.filter((m) => {
    if (actionFilter === "all") return true;
    return (actions[m.id]?.status ?? "pending") === actionFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Onsite SEO Audit</h1>
      <p className="mt-1 text-sm text-slate-600">
        Runs the full SEO Implementation Checklist against a site — crawl + GSC/GA4/PSI/Ahrefs checks, with manual steps flagged for a human.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://client-site.com"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fp-400 focus:outline-none"
        />
        <button
          onClick={run}
          disabled={busy || !url}
          className="rounded-lg bg-fp-700 px-5 py-2 text-sm font-semibold text-white hover:bg-fp-800 disabled:opacity-40"
        >
          {busy ? "Running…" : "Run audit"}
        </button>
      </div>

      <Card className="mt-6">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Previous runs</h3>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">
            No saved runs yet — run an audit and it will appear here.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-800">
                    {h.domain || `Run #${h.id}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(h.createdAt).toLocaleString()} ·{" "}
                    {h.summary
                      ? `${h.summary.failed} fail · ${h.summary.warned} review · ${h.summary.manual} manual`
                      : ""}
                  </div>
                </div>
                <Button variant="secondary" onClick={() => void loadRun(h.id)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {progress && !result && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">{statusText(progress.status)}</div>
              <div className="text-sm text-slate-500">{progress.message}</div>
            </div>
            {progress.status === "crawling" && progress.pagesTotal > 0 && (
              <div className="text-sm font-semibold text-fp-700">
                {progress.pagesCrawled}/{progress.pagesTotal} pages
              </div>
            )}
          </div>
          {progress.status === "crawling" && progress.pagesTotal > 0 && (
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-fp-600 transition-all"
                style={{ width: `${Math.min(100, (progress.pagesCrawled / progress.pagesTotal) * 100)}%` }}
              />
            </div>
          )}
        </Card>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Audit result — {result.domain}</h2>
                <div className="mt-1 text-sm text-slate-500">{result.llmSummary}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => download("onsite-audit.md", toMarkdown(result), "text/markdown")}>
                  Download report (.md)
                </Button>
                <Button variant="secondary" onClick={() => download("onsite-audit.json", JSON.stringify(result, null, 2), "application/json")}>
                  Download JSON
                </Button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { k: "Total", v: result.summary.total, cls: "text-slate-900" },
                { k: "Pass", v: result.summary.passed, cls: "text-emerald-600" },
                { k: "Fail", v: result.summary.failed, cls: "text-rose-600" },
                { k: "Review", v: result.summary.warned, cls: "text-amber-600" },
                { k: "Manual", v: result.summary.manual, cls: "text-slate-500" },
              ].map((s) => (
                <div key={s.k} className="rounded-lg bg-slate-50 p-3 text-center">
                  <div className={`text-2xl font-bold ${s.cls}`}>{s.v}</div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">{s.k}</div>
                </div>
              ))}
            </div>
          </Card>

          {manualList.length > 0 && (
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">
                  Manual actions needed ({doneCount}/{manualList.length} done)
                </h3>
                <div className="flex gap-1">
                  {ACTION_FILTERS.map((f) => {
                    const count =
                      f === "all"
                        ? manualList.length
                        : manualList.filter((m) => (actions[m.id]?.status ?? "pending") === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setActionFilter(f)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          actionFilter === f ? "bg-fp-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {f === "all" ? "All" : ACTION_STYLE[f].label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${Math.min(100, (doneCount / manualList.length) * 100)}%` }}
                />
              </div>
              <ul className="mt-4 space-y-3">
                {filteredManual.map((m) => {
                  const a = actions[m.id] ?? { status: "pending" as ActionStatus, note: "", saved: true, saving: false };
                  return (
                    <li key={m.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm text-slate-800">
                            <span className="mr-1 font-mono text-xs text-slate-400">{m.id}</span>
                            <span className="font-semibold">{m.item}</span>
                          </div>
                          {m.instruction && <div className="mt-0.5 text-xs text-slate-500">{m.instruction}</div>}
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${ACTION_STYLE[a.status].cls}`}>
                          {ACTION_STYLE[a.status].label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <select
                          value={a.status}
                          onChange={(e) => void updateAction(m.id, { status: e.target.value as ActionStatus })}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-fp-400 focus:outline-none"
                        >
                          {ACTION_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {ACTION_STYLE[s].label}
                            </option>
                          ))}
                        </select>
                        <input
                          value={a.note}
                          onChange={(e) =>
                            setActions((prev) => ({
                              ...prev,
                              [m.id]: { ...prev[m.id], note: e.target.value, saved: false, saving: false },
                            }))
                          }
                          onBlur={() => {
                            const cur = actions[m.id];
                            if (cur && !cur.saved) void updateAction(m.id, { note: cur.note });
                          }}
                          placeholder="Note…"
                          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-fp-400 focus:outline-none"
                        />
                        <span className="w-14 text-right text-xs text-slate-400">
                          {a.saving ? "saving…" : a.saved ? "✓ saved" : ""}
                        </span>
                      </div>
                    </li>
                  );
                })}
                {filteredManual.length === 0 && (
                  <li className="text-sm text-slate-500">No manual actions in this filter.</li>
                )}
              </ul>
            </Card>
          )}

          {result.sections.map((sec) => (
            <Card key={sec.name}>
              <h3 className="mb-3 text-base font-semibold text-slate-900">{sec.name}</h3>
              <div className="divide-y divide-slate-100">
                {sec.items.map((it) => {
                  const st = VERDICT_STYLE[it.verdict] ?? { label: it.verdict, cls: "bg-slate-200 text-slate-600" };
                  const act = it.verdict === "manual" ? actions[it.id] : undefined;
                  return (
                    <div key={it.id} className="flex items-start gap-3 py-2">
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                      {act && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${ACTION_STYLE[act.status].cls}`}>
                          {ACTION_STYLE[act.status].label}
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm text-slate-800">
                          <span className="mr-1 font-mono text-xs text-slate-400">{it.id}</span>
                          {it.item}
                        </div>
                        {it.evidence && <div className="mt-0.5 text-xs text-slate-500">{it.evidence}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
