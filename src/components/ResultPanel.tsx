"use client";

import { useState } from "react";
import type { PipelineResult } from "@/app/page";

type Tab = "research" | "summary" | "content";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "research", label: "Research", icon: "🔍" },
  { id: "summary", label: "Summary", icon: "📝" },
  { id: "content", label: "Content", icon: "✍️" },
];

export default function ResultPanel({ result }: { result: PipelineResult }) {
  const [activeTab, setActiveTab] = useState<Tab>("content");

  const tabContent: Record<Tab, string> = {
    research: result.research,
    summary: result.summary,
    content: result.content,
  };

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/80">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-green-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Pipeline complete
          </span>
          <span className="text-xs text-gray-500">·</span>
          <span className="text-xs text-gray-400">
            Engine:{" "}
            <span className="text-gray-200 font-mono">{result.engine}</span>
          </span>
        </div>
        <button
          onClick={() => copyToClipboard(tabContent[activeTab])}
          className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded hover:bg-gray-800"
        >
          Copy
        </button>
      </div>

      <div className="px-6 pt-4 pb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Topic</p>
        <p className="text-sm text-white mt-1">{result.topic}</p>
      </div>

      <div className="flex border-b border-gray-800 px-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === tab.id
                ? "border-brand-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        <pre className="prose-result">{tabContent[activeTab]}</pre>
      </div>
    </div>
  );
}
