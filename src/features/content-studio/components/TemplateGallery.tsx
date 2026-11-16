"use client";

import React, { useState } from "react";
import { ContentTemplateItem } from "@/types";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Layers,
  Copy,
} from "lucide-react";

interface TemplateGalleryProps {
  templates: ContentTemplateItem[];
  onUseTemplate: (template: ContentTemplateItem) => void;
}

export function TemplateGallery({
  templates,
  onUseTemplate,
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["ALL", "PROMO", "PRODUCT_LAUNCH", "EVENT", "THOUGHT_LEADERSHIP", "QUOTE"];

  const filtered = templates.filter((t) => {
    if (selectedCategory !== "ALL" && t.category !== selectedCategory) return false;
    return true;
  });

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === cat
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20"
                : "border-white/10 bg-slate-900/40 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between group hover:border-[var(--brand-primary)]/40 transition-all hover:shadow-2xl hover:shadow-[var(--brand-primary)]/10"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-white/15 bg-white/5 text-slate-300 font-mono"
                    >
                      {tmpl.category.replace("_", " ")}
                    </Badge>
                    {tmpl.isBrandDefault && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                        Default
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[var(--brand-primary)] transition-colors">
                    {tmpl.name}
                  </h4>
                </div>

                {tmpl.thumbnailUrl && (
                  <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tmpl.thumbnailUrl}
                      alt={tmpl.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {tmpl.description}
              </p>

              {/* Platforms */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {tmpl.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/80 border border-white/5 text-slate-400 font-mono"
                  >
                    {p}
                  </span>
                ))}
              </div>

              {/* Prompt snippet preview */}
              {tmpl.promptTemplate && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold uppercase tracking-wider">AI Prompt Directive</span>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(tmpl.id, tmpl.promptTemplate || "")}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedId === tmpl.id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono line-clamp-2">
                    {tmpl.promptTemplate}
                  </div>
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="pt-4 border-t border-white/10 mt-4">
              <Button
                onClick={() => onUseTemplate(tmpl)}
                className="w-full bg-white/10 hover:bg-[var(--brand-primary)] hover:text-white text-slate-200 text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 group-hover:bg-[var(--brand-primary)] group-hover:text-white shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Use Template in Composer</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
