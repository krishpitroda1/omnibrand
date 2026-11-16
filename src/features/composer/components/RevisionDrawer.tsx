"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  RotateCw,
  X,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

interface RevisionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RevisionDrawer({ isOpen, onClose }: RevisionDrawerProps) {
  const {
    revisionHistory,
    addRevisionHistoryEntry,
    masterPrompt,
    selectedModel,
    isGenerating,
    setIsGenerating,
    generatedVariants,
    setGeneratedVariants,
    selectedVariantId,
  } = useAppStore();

  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const handleRunRevision = () => {
    if (!feedback.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);

      const activeVar = generatedVariants.find((v) => v.id === selectedVariantId) || generatedVariants[0];

      // Add to revision timeline
      addRevisionHistoryEntry({
        id: `rev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        prompt: masterPrompt,
        feedback: feedback.trim(),
        mediaUrl: activeVar?.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
        model: selectedModel,
      });

      // Update generated variants with revised seed
      const updated = generatedVariants.map((v) => ({
        ...v,
        seed: String(Math.floor(20000 + Math.random() * 80000)),
      }));
      setGeneratedVariants(updated);

      setFeedback("");
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-white/10 p-6 overflow-y-auto z-10 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-amber-400" />
                <span>Revision & Regeneration Studio</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Provide refinement notes. Previous versions are strictly preserved in timeline.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Director Feedback & Adjustment Prompts
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. 'Make lighting warmer with more golden hour shadow contrast', 'Tighten the CTA', 'Soften background saturation'..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                "Make lighting warmer",
                "Soften background contrast",
                "Tighten the CTA",
                "More editorial framing",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setFeedback(suggestion)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline of Prior Generations */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" />
              Prior Revision History ({revisionHistory.length})
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {revisionHistory.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3 text-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.mediaUrl}
                    alt="Thumbnail"
                    className="h-12 w-12 rounded-lg object-cover border border-white/10 flex-shrink-0"
                  />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Version #{revisionHistory.length - idx}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic truncate">
                      &ldquo;{entry.feedback}&rdquo;
                    </p>
                    <span className="text-[9px] text-[var(--brand-primary)] font-mono">
                      Model: {entry.model}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={handleRunRevision}
            isLoading={isGenerating}
            disabled={!feedback.trim()}
            className="shadow-glow-brand"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Re-Generate with Feedback</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
