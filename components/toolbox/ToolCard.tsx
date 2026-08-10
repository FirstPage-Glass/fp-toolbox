import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { ToolManifest } from "@/lib/registry";

/** Category → emoji-container accent. Static map — no dynamic Tailwind classes. */
const ACCENT: Record<string, string> = {
  Sales: "bg-emerald-100",
  "SEO Research": "bg-blue-100",
  "SEO Technical": "bg-violet-100",
  Content: "bg-amber-100",
  Operations: "bg-rose-100",
};
const DEFAULT_ACCENT = "bg-slate-100";

interface ToolCardProps {
  tool: ToolManifest;
}

/** Tool card: accent emoji tile + name + description + category/owner meta. External tools link out. */
export default function ToolCard({ tool }: ToolCardProps) {
  const isExternal = Boolean(tool.externalLink);
  const accent = ACCENT[tool.category] ?? DEFAULT_ACCENT;

  const card = (
    <Card hover className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${accent}`}
          aria-hidden
        >
          {tool.icon ?? "🧰"}
        </div>
        {isExternal ? <Badge color="slate">External</Badge> : null}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-fp-700">
        {tool.name}
      </h2>
      <p className="mt-1 flex-1 text-sm text-slate-600">{tool.description}</p>
      <div className="mt-4 flex items-center gap-2">
        <Badge color="fp">{tool.category}</Badge>
        <span className="text-xs text-slate-400">{tool.owner}</span>
      </div>
    </Card>
  );

  if (isExternal && tool.externalLink) {
    return (
      <Link
        href={tool.externalLink}
        target="_blank"
        rel="noreferrer"
        className="group block h-full"
      >
        {card}
      </Link>
    );
  }
  return (
    <Link href={`/tools/${tool.slug}`} className="group block h-full">
      {card}
    </Link>
  );
}
