"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView, { type SendToLink } from "@/components/tools/ResultView";
import { usePrefill, prefillUrl } from "@/components/tools/usePrefill";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorBanner from "@/components/ui/ErrorBanner";

interface StrategyResult {
  url: string;
  performanceScore: number | null;
  lcpMs: number | null;
  cls: number | null;
}

interface MobileDesktopResult {
  url: string;
  mobile: StrategyResult;
  desktop: StrategyResult;
}

export default function MobileDesktopPsiPage() {
  const prefill = usePrefill();
  const [url, setUrl] = useState(prefill.url || "");
  const { data, error, loading, run } = useToolApi<MobileDesktopResult>("mobile-desktop-psi");

  const sendTo: SendToLink[] = data
    ? [
        {
          label: "URL Inspector",
          href: prefillUrl("/tools/url-inspector", { url, site: url }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Mobile vs Desktop PSI"
        description="Run PageSpeed Insights on both strategies for the same URL and compare the scores."
      />

      <div className="mt-6 flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://client-site.com/page"
          className="flex-1"
        />
        <Button size="lg" onClick={() => run({ url })} disabled={loading || !url}>
          {loading ? "Running…" : "Compare"}
        </Button>
      </div>

      {error && <ErrorBanner className="mt-6">{error}</ErrorBanner>}
      {data && (
        <div className="mt-6">
          <ResultView data={data} sendTo={sendTo} />
        </div>
      )}
    </div>
  );
}
