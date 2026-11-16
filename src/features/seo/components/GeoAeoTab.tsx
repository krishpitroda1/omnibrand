"use client";

import React, { useState } from "react";
import { SEED_GEO_AEO_EVALUATION } from "@/lib/seed/seo-seed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  ExternalLink,
  Layers,
  HelpCircle,
} from "lucide-react";

export function GeoAeoTab() {
  const [selectedFaqIdx, setSelectedFaqIdx] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const evaluation = SEED_GEO_AEO_EVALUATION;

  // Generate full JSON-LD FAQ schema
  const jsonLdFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": evaluation.faqSchemaSuggestions.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdFaqSchema, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Mandatory Invariant Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Mandatory Algorithmic Phrasing Disclaimer:</span>
          <p className="text-[11px] text-amber-200/90 mt-0.5">
            <strong>These are recommendations. OmniBrand cannot guarantee visibility in AI-generated answers.</strong> Generative search engines (Perplexity, ChatGPT Search, Google AI Overviews) synthesize answers non-deterministically. These recommendations format data structures to optimize semantic crawler comprehension.
          </p>
        </div>
      </div>

      {/* Top Section: Overall Readiness Score & LLM Engine Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wide">
              GEO Synthesis Readiness Score
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              {evaluation.readinessScore} / 100
            </div>
          </div>
          <span className="text-[11px] text-emerald-300/80 font-mono">
            Optimized for LLM Citations
          </span>
        </div>

        {evaluation.engineBreakdown.map((engine) => (
          <div
            key={engine.engine}
            className="p-5 rounded-2xl border border-white/10 glass-card flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{engine.engine}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                  engine.status === "EXCELLENT"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                }`}
              >
                {engine.status}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">{engine.score}%</div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5 border border-white/10">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${engine.score}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Entity graph completeness
            </span>
          </div>
        ))}
      </div>

      {/* Entity Consistency Across Knowledge Graphs */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>Cross-Web Knowledge Graph Entity Consistency</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditing authoritative corporate entity representations across Wikipedia, Crunchbase, and Schema nodes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>Authoritative Web Citations:</span>
            <strong className="text-white font-bold">{evaluation.authoritativeCitationsCount} Verified</strong>
          </div>
        </div>

        <div className="space-y-3">
          {evaluation.entityConsistency.map((ec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{ec.entity}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                      ec.status === "VERIFIED"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {ec.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{ec.notes}</p>
              </div>

              <div className="flex-shrink-0">
                {ec.status === "VERIFIED" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-7 px-2"
                    onClick={() => alert("Submitted entity reconciliation patch to Knowledge Graph.")}
                  >
                    <span>Reconcile Entity</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended FAQ Schema Suggestions for Answer Engine Citations */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>Recommended FAQ Schema (JSON-LD Markup for Generative Citations)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured Q&A blocks specifically formatted for LLM direct-synthesis extractors.
            </p>
          </div>

          <Button size="sm" variant="outline" onClick={handleCopySchema}>
            <Copy className="h-3.5 w-3.5 mr-1" />
            <span>{isCopied ? "Copied JSON-LD!" : "Copy Full Schema"}</span>
          </Button>
        </div>

        {/* Interactive FAQ Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 block mb-1">
              Select Recommended Question:
            </span>
            {evaluation.faqSchemaSuggestions.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFaqIdx(idx)}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                  selectedFaqIdx === idx
                    ? "bg-slate-900 border-[var(--brand-primary)] text-white font-bold"
                    : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="truncate">{faq.question}</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                  Target: {faq.targetUrl.replace("https://omnibrand.io", "")}
                </div>
              </button>
            ))}
          </div>

          {/* JSON-LD Code Block Preview */}
          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-slate-300 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">
                Structured JSON-LD Answer Preview:
              </div>
              <div className="text-emerald-400 font-bold mb-1">
                Q: &ldquo;{evaluation.faqSchemaSuggestions[selectedFaqIdx].question}&rdquo;
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-900 p-2.5 rounded border border-white/5">
                {evaluation.faqSchemaSuggestions[selectedFaqIdx].answer}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
              <span>Schema Type: FAQPage (Schema.org)</span>
              <span className="text-emerald-400">Crawl Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
