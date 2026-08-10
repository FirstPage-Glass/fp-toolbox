"use client";

import { useState } from "react";
import { useToolApi } from "@/components/tools/useToolApi";
import ResultView from "@/components/tools/ResultView";
import { usePrefill } from "@/components/tools/usePrefill";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorBanner from "@/components/ui/ErrorBanner";

interface AiVisibilityResult {
  target: string;
  platforms: { name: string; citations: number; pages: number }[];
  totalCitations: number;
  totalPages: number;
}

export default function AiVisibilityPage() {
  const prefill = usePrefill();
  const [domain, setDomain] = useState(prefill.domain || "");
  const { data, error, loading, run } = useToolApi<AiVisibilityResult>("ai-visibility");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="AI Visibility Scanner"
        description="See how visible a domain is in AI-generated search answers — a key metric for AI-era SEO."
      />

      <div className="mt-6 flex gap-2">
        <Input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="firstpage.hk"
          className="flex-1"
        />
        <Button size="lg" onClick={() => run({ domain })} disabled={loading || !domain}>
          {loading ? "Scanning…" : "Scan"}
        </Button>
      </div>

      {error && <ErrorBanner className="mt-6">{error}</ErrorBanner>}
      {data && (
        <div className="mt-6">
          <ResultView data={data} />
        </div>
      )}
    </div>
  );
}
