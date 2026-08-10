"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface SendToLink {
  label: string;
  href: string;
}

interface ResultViewProps {
  data: unknown;
  sendTo?: SendToLink[];
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") {
    return Number.isInteger(v) ? v.toLocaleString() : String(Math.round(v * 100) / 100);
  }
  if (typeof v === "boolean") return v ? "✓" : "✗";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** Render an array of records as a table with a union of their keys as columns. */
function DataTable({ rows }: { rows: Record<string, unknown>[] }) {
  const cols = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) for (const k of Object.keys(r)) set.add(k);
    return [...set];
  }, [rows]);
  if (cols.length === 0) return <p className="text-sm text-slate-500">No rows.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                className="px-3 py-2 text-left font-semibold text-slate-600 capitalize"
              >
                {c.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50">
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 text-slate-700">
                  {formatValue(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Recursive generic renderer: records → stat grid + sections, arrays → tables/lists. */
function renderNode(node: unknown): ReactNode {
  if (Array.isArray(node)) {
    if (node.length === 0) return <p className="text-sm text-slate-500">No data.</p>;
    if (node.every(isRecord)) return <DataTable rows={node} />;
    if (node.every((v) => !isRecord(v) && !Array.isArray(v))) {
      return (
        <ul className="space-y-1">
          {node.map((v, i) => (
            <li key={i} className="text-sm text-slate-700">
              {formatValue(v)}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <pre className="overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
        {JSON.stringify(node, null, 2)}
      </pre>
    );
  }
  if (isRecord(node)) {
    const entries = Object.entries(node);
    const scalars = entries.filter(([, v]) => !Array.isArray(v) && !isRecord(v));
    const complex = entries.filter(([, v]) => Array.isArray(v) || isRecord(v));
    return (
      <div className="space-y-5">
        {scalars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scalars.map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ")}
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-900">
                  {formatValue(v)}
                </div>
              </div>
            ))}
          </div>
        )}
        {complex.map(([k, v]) => (
          <div key={k}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ")}
            </h3>
            {renderNode(v)}
          </div>
        ))}
      </div>
    );
  }
  return <p className="text-sm text-slate-700">{formatValue(node)}</p>;
}

/**
 * Generic result renderer for data tools. Renders any JSON payload as stat
 * cards + tables, with copy-JSON / download buttons and optional cross-tool
 * "Send to …" links on top.
 */
export default function ResultView({ data, sendTo }: ResultViewProps) {
  const [copied, setCopied] = useState(false);

  function copyJson() {
    void navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {sendTo?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-lg bg-fp-100 px-3 py-1.5 text-sm font-semibold text-fp-700 hover:bg-fp-200"
          >
            {l.label} →
          </a>
        ))}
        <button
          onClick={copyJson}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          {copied ? "Copied ✓" : "Copy JSON"}
        </button>
        <button
          onClick={downloadJson}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Download
        </button>
      </div>
      {renderNode(data)}
    </div>
  );
}
