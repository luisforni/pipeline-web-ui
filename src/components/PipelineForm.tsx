"use client";

import { useState } from "react";

export type PipelineParams = {
  topic: string;
  content_format: "blog" | "report" | "social";
  summary_style: "bullets" | "narrative" | "technical";
  language: string;
  engine: "crewai" | "langgraph";
};

type Props = {
  onSubmit: (params: PipelineParams) => void;
  loading: boolean;
};

const EXAMPLES = [
  "The impact of AI agents on software development in 2025",
  "Climate change solutions: carbon capture technology",
  "Quantum computing: current state and near-term applications",
];

export default function PipelineForm({ onSubmit, loading }: Props) {
  const [params, setParams] = useState<PipelineParams>({
    topic: "",
    content_format: "blog",
    summary_style: "bullets",
    language: "en",
    engine: "crewai",
  });

  function set<K extends keyof PipelineParams>(key: K, value: PipelineParams[K]) {
    setParams((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Topic</label>
        <input
          type="text"
          value={params.topic}
          onChange={(e) => set("topic", e.target.value)}
          placeholder="What do you want to research?"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
        />
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => set("topic", ex)}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition"
            >
              {ex.length > 48 ? ex.slice(0, 46) + "…" : ex}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SelectField
          label="Output format"
          value={params.content_format}
          onChange={(v) => set("content_format", v as PipelineParams["content_format"])}
          options={[
            { value: "blog", label: "📝 Blog post" },
            { value: "report", label: "📊 Report" },
            { value: "social", label: "📱 Social media" },
          ]}
        />
        <SelectField
          label="Summary style"
          value={params.summary_style}
          onChange={(v) => set("summary_style", v as PipelineParams["summary_style"])}
          options={[
            { value: "bullets", label: "• Bullets" },
            { value: "narrative", label: "¶ Narrative" },
            { value: "technical", label: "⚙ Technical" },
          ]}
        />
        <SelectField
          label="Engine"
          value={params.engine}
          onChange={(v) => set("engine", v as PipelineParams["engine"])}
          options={[
            { value: "crewai", label: "🚀 CrewAI" },
            { value: "langgraph", label: "🕸 LangGraph" },
          ]}
        />
        <SelectField
          label="Language"
          value={params.language}
          onChange={(v) => set("language", v)}
          options={[
            { value: "en", label: "🇺🇸 English" },
            { value: "es", label: "🇪🇸 Spanish" },
            { value: "pt", label: "🇧🇷 Portuguese" },
            { value: "fr", label: "🇫🇷 French" },
            { value: "de", label: "🇩🇪 German" },
          ]}
        />
      </div>

      <button
        onClick={() => onSubmit(params)}
        disabled={loading || !params.topic.trim()}
        className="w-full py-3 px-6 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
      >
        {loading ? "Running pipeline…" : "Run pipeline →"}
      </button>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
