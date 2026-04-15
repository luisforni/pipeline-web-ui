"use client";

import { useState } from "react";
import PipelineForm, { PipelineParams } from "@/components/PipelineForm";
import ResultPanel from "@/components/ResultPanel";

export type PipelineResult = {
  topic: string;
  engine: string;
  research: string;
  summary: string;
  content: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);

  async function handleRun(params: PipelineParams) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Pipeline error ${res.status}: ${body}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h1 className="text-lg font-semibold text-white leading-none">
              Multi-Agent AI Pipeline
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Research · Summarize · Generate
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <PipelineForm onSubmit={handleRun} loading={loading} />

        {loading && (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center space-y-4">
            <div className="flex justify-center gap-2">
              {["🔍 Researching", "📝 Summarizing", "✍️ Generating"].map(
                (step, i) => (
                  <span
                    key={step}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    {step}
                  </span>
                )
              )}
            </div>
            <p className="text-sm text-gray-400">
              Pipeline running — this may take a minute…
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-800 bg-red-950/40 p-6">
            <p className="text-sm font-medium text-red-400">Pipeline error</p>
            <p className="text-xs text-red-300 mt-1 font-mono">{error}</p>
          </div>
        )}

        {result && <ResultPanel result={result} />}
      </div>
    </main>
  );
}
