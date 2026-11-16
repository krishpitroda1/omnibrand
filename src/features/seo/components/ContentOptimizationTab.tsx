"use client";

import React, { useState } from "react";
import { SEED_CONTENT_OPTIMIZATIONS } from "@/lib/seed/seo-seed";
import { ContentOptimizationItem } from "@/types/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Bot,
  X,
  Copy,
} from "lucide-react";

export function ContentOptimizationTab() {
  const [items, setItems] = useState<ContentOptimizationItem[]>(SEED_CONTENT_OPTIMIZATIONS);
  const [selectedUrlItem, setSelectedUrlItem] = useState<ContentOptimizationItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileCode className="h-5 w-5 text-[var(--brand-primary)]" />
          <span>Per-URL Content & Semantic Search Intent Optimizer</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Actionable on-page diagnostics: title tag phrasing, meta description gaps, heading architecture, and internal linking graph.
        </p>
      </div>

      {/* URL Cards */}
      <div className="space-y-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-white/10 glass-card space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold text-xs">
                  {item.url}
                </span>
                <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">
                  Search-Intent Score:{" "}
                  <strong className="text-emerald-400 font-mono font-bold">
                    {item.searchIntentAlignmentScore} / 100
                  </strong>
                </span>
                <Button
                  size="sm"
                  variant="brand"
                  className="text-xs"
                  onClick={() => setSelectedUrlItem(item)}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  <span>Generate Optimized Copy</span>
                </Button>
              </div>
            </div>

            {/* Diagnostic Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Title Tag Analysis */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Title Tag Optimization</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">
                    Score: {item.titleTag.score}%
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Current:</strong> &ldquo;{item.titleTag.current}&rdquo;
                  </div>
                  <div className="text-emerald-300 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                    <strong className="text-emerald-400">Recommended:</strong> &ldquo;{item.titleTag.recommended}&rdquo;
                  </div>
                </div>
              </div>

              {/* Meta Description Analysis */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Meta Description Optimization</span>
                  <span className="font-mono text-emerald-400 font-bold text-[11px]">
                    Score: {item.metaDescription.score}%
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Current:</strong> &ldquo;{item.metaDescription.current}&rdquo;
                  </div>
                  <div className="text-emerald-300 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                    <strong className="text-emerald-400">Recommended:</strong> &ldquo;{item.metaDescription.recommended}&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Headings & Internal Linking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
                <span className="font-bold text-white block">Heading Hierarchy & Structure</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {item.headingsAnalysis.suggestion}
                </p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-slate-400">
                  <span>H1 Tags: {item.headingsAnalysis.h1Count}</span>
                  <span>•</span>
                  <span>H2 Tags: {item.headingsAnalysis.h2Count}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{item.headingsAnalysis.status}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
                <span className="font-bold text-white block">Internal Linking Opportunities</span>
                <p className="text-[11px] text-slate-300">
                  Recommended anchor text phrases to inject across existing blog posts:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.internalLinks.recommendedAnchors.map((anchor, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-white/10"
                    >
                      &ldquo;{anchor}&rdquo;
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Copy Optimization Modal */}
      {selectedUrlItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedUrlItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[var(--brand-primary)]" />
                <h3 className="text-base font-bold text-white">
                  AI-Generated Meta & Title Payload
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                Target: {selectedUrlItem.url}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Optimized Title Tag:</span>
                <div className="text-emerald-400">{selectedUrlItem.titleTag.recommended}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Optimized Meta Description:</span>
                <div className="text-slate-200">{selectedUrlItem.metaDescription.recommended}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Immediate Action Items:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                  {selectedUrlItem.recommendedActions.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Search Intent Alignment: <strong className="text-emerald-400 font-mono">{selectedUrlItem.searchIntentAlignmentScore}%</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleCopy(
                      `<title>${selectedUrlItem.titleTag.recommended}</title>\n<meta name="description" content="${selectedUrlItem.metaDescription.recommended}" />`
                    )
                  }
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  <span>{isCopied ? "Copied!" : "Copy HTML Tags"}</span>
                </Button>
                <Button
                  size="sm"
                  variant="brand"
                  onClick={() => {
                    alert("Applied optimized tags to Next.js metadata route export.");
                    setSelectedUrlItem(null);
                  }}
                >
                  <span>Apply to Page</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
