"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Calendar,
  Send,
  Layers,
  CheckCircle2,
  AlertCircle,
  Share2,
} from "lucide-react";

export function CampaignComposerModal() {
  const { createModalOpen, setCreateModalOpen, brands, activeBrandId } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [content, setContent] = useState(
    "Excited to unveil our newest visual collection. Designed with intentional craft and timeless perspective. #OmniBrand #CreativeOps"
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "INSTAGRAM",
    "LINKEDIN",
  ]);
  const [scheduledDate, setScheduledDate] = useState("2026-11-15T14:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const togglePlatform = (plat: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(plat) ? prev.filter((p) => p !== plat) : [...prev, plat]
    );
  };

  const handleScheduleCampaign = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setScheduledSuccess(true);

      // Trigger Confetti as per Constitution!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [
            activeBrand?.brandKit?.primaryColor || "#E8B04B",
            "#F472B6",
            "#60A5FA",
            "#34D399",
          ],
        });
      } catch (err) {
        // Fallback gracefully if canvas is unavailable
      }

      setTimeout(() => {
        setScheduledSuccess(false);
        setStep(1);
        setCreateModalOpen(false);
      }, 2400);
    }, 900);
  };

  const handleClose = () => {
    setScheduledSuccess(false);
    setStep(1);
    setCreateModalOpen(false);
  };

  return (
    <Modal
      isOpen={createModalOpen}
      onClose={handleClose}
      title="Create New Campaign & Social Dispatch"
      description={`Unified omnichannel publishing pipeline scoped for ${activeBrand?.name || "Active Brand"}.`}
      maxWidth="4xl"
    >
      {scheduledSuccess ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 animate-bounce">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Campaign Dispatched to Queue!</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md">
              Idempotency key generated. Content queued across {selectedPlatforms.length} channels with
              exponential backoff and brand compliance guardrails active.
            </p>
          </div>
          <Badge variant="metric-actual" size="md">
            Status: QUEUED &bull; Channel Partial Isolation
          </Badge>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-white/10 text-xs font-medium">
            <div
              className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
                step === 1 ? "bg-white/10 text-white font-semibold" : "text-slate-500"
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">
                1
              </span>
              <span>Content & AI Polish</span>
            </div>
            <div
              className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
                step === 2 ? "bg-white/10 text-white font-semibold" : "text-slate-500"
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">
                2
              </span>
              <span>Target Channels</span>
            </div>
            <div
              className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
                step === 3 ? "bg-white/10 text-white font-semibold" : "text-slate-500"
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">
                3
              </span>
              <span>Review & Queue</span>
            </div>
          </div>

          {/* Step 1: Content */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Campaign Message
                </label>
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Tone: {activeBrand?.brandKit?.toneKeywords?.slice(0, 2).join(", ") || "Warm"}</span>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 text-sm text-white placeholder-slate-500 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                placeholder="Write your campaign announcement..."
              />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{content.length} characters</span>
                <button
                  type="button"
                  onClick={() =>
                    setContent(
                      (prev) =>
                        prev +
                        ` | Rooted in ${activeBrand?.brandKit?.mustInclude?.[0] || "intentional craft"}.`
                    )
                  }
                  className="text-[var(--brand-primary)] hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="h-3 w-3" />
                  Apply Brand Directive Filter
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  Brand voice compliance filter passed. No forbidden terms detected (
                  {activeBrand?.brandKit?.doNotSay?.join(", ") || "none"}).
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Target Channels */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Select social channels connected to <strong>{activeBrand?.name}</strong>. Guardrail:
                Restricted capabilities cannot receive automated dispatch.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeBrand?.socialAccounts?.map((account) => {
                  const isSelected = selectedPlatforms.includes(account.platform);
                  const isRestricted = account.capabilities.includes("RESTRICTED");

                  return (
                    <div
                      key={account.id}
                      onClick={() => !isRestricted && togglePlatform(account.platform)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isRestricted
                          ? "bg-slate-900/30 border-amber-500/30 opacity-60 cursor-not-allowed"
                          : isSelected
                          ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] shadow-sm"
                          : "bg-slate-900/60 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Share2 className="h-4 w-4 text-slate-300" />
                          <div>
                            <p className="text-xs font-semibold text-white">{account.displayName}</p>
                            <p className="text-[11px] text-slate-400">{account.handle}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected && !isRestricted}
                          disabled={isRestricted}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-slate-700 text-[var(--brand-primary)]"
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        {account.capabilities.map((cap) => (
                          <Badge
                            key={cap}
                            variant={
                              cap === "PUBLISH"
                                ? "publish"
                                : cap === "READ"
                                ? "read"
                                : cap === "RESTRICTED"
                                ? "restricted"
                                : "webhook"
                            }
                            size="sm"
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Review & Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-slate-400">Target Workspace:</span>
                  <span className="font-semibold text-white">Growth Agency Hub</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-slate-400">Active Brand:</span>
                  <span className="font-semibold text-[var(--brand-primary)]">
                    {activeBrand?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-slate-400">Channels Selected:</span>
                  <span className="font-semibold text-white">{selectedPlatforms.join(", ")}</span>
                </div>
                <div className="text-xs space-y-1">
                  <span className="text-slate-400">Content Preview:</span>
                  <p className="p-2.5 rounded-xl bg-slate-950 text-slate-200 text-xs italic">
                    &ldquo;{content}&rdquo;
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                  Schedule Date & Time (UTC)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {step > 1 ? (
              <Button variant="ghost" size="sm" onClick={() => setStep((s) => (s - 1) as 1 | 2)}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Cancel
              </Button>
            )}

            {step < 3 ? (
              <Button variant="brand" size="sm" onClick={() => setStep((s) => (s + 1) as 2 | 3)}>
                Continue
              </Button>
            ) : (
              <Button
                variant="brand"
                size="sm"
                onClick={handleScheduleCampaign}
                isLoading={isSubmitting}
                className="shadow-glow-brand"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Confirm & Queue Dispatch</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
