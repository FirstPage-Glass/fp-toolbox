import PageHeader from "@/components/ui/PageHeader";
import ToolboxView from "@/components/toolbox/ToolboxView";
import { tools } from "@/lib/registry";

export default async function ToolboxPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const sp = await searchParams;
  const activeCount = tools.filter((t) => t.status === "active").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        title="Toolbox"
        description="Sales weapons built into the platform. Pick a tool — each one generates a client-ready deliverable."
        count={`${activeCount} tools`}
      />
      {/* Initial q/cat come from the URL as server props → full SSR first paint.
          Client updates write back via router.replace; back/forward sync via popstate. */}
      <ToolboxView initialQuery={sp.q ?? ""} initialCategory={sp.cat ?? null} />
    </div>
  );
}
