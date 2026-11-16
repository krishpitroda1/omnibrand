"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Platform } from "@/types";
import { NativePostCards } from "./NativePostCards";
import { RevisionDrawer } from "./RevisionDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Check,
} from "lucide-react";

export function Step4PreviewApproval() {
  const {
    brands,
    selectedBrandId,
    selectedPlatforms,
    activePreviewPlatform,
    setActivePreviewPlatform,
    repurposedVariants,
    generatedVariants,
    selectedVariantId,
    complianceAcknowledged,
    setComplianceAcknowledged,
    setApprovalRecord,
    approvalRecord,
    revisionDrawerOpen,
    setRevisionDrawerOpen,
    setWizardStep,
  } = useAppStore();

  const activeBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];
  const activeVariant =
    generatedVariants.find((v) => v.id === selectedVariantId) || generatedVariants[0];

  const currentPlatformData = repurposedVariants[activePreviewPlatform] || {
    platform: activePreviewPlatform,
    caption: "Sample flight caption",
    hashtags: ["#OmniBrand", "#CreativeOps"],
    ctaText: "Learn More",
    ctaUrl: activeBrand?.website || "https://luminacreative.studio",
    aspectRatio: "PORTRAIT_4_5",
    brandCheckPass: true,
  };

  const handleApprove = () => {
    if (!complianceAcknowledged) return;

    // Write ApprovalRecord as mandated by the Constitution!
    const record = {
      actorName: "Elena Rostova",
      decision: "APPROVED" as const,
      notes: `Pixel preview verified for ${selectedPlatforms.join(", ")}. Brand tone and safety directives met.`,
      complianceCheck: true,
      createdAt: new Date().toISOString(),
    };

    setApprovalRecord(record);
    setWizardStep(5);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Step 4: Pixel-Accurate Native Previews & Dual-Path Approval Gate</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Review native layout simulations across every selected channel. An explicit compliance acknowledgment gates dispatch.
        </p>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {selectedPlatforms.map((plat) => {
          const isActive = activePreviewPlatform === plat;
          return (
            <button
              key={plat}
              onClick={() => setActivePreviewPlatform(plat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                  : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:text-white dark:border-white/5 shadow-sm"
              }`}
            >
              <span>{plat} Preview</span>
            </button>
          );
        })}
      </div>

      {/* Centerpiece: Pixel-Accurate Card Display */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-slate-950/70 shadow-inner backdrop-blur-xl flex flex-col items-center justify-center min-h-[460px]">
        <NativePostCards
          platform={activePreviewPlatform}
          brand={activeBrand}
          caption={currentPlatformData.caption}
          hashtags={currentPlatformData.hashtags}
          mediaUrl={activeVariant?.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80"}
          ctaText={currentPlatformData.ctaText}
          ctaUrl={currentPlatformData.ctaUrl}
        />
      </div>

      {/* DUAL-PATH APPROVAL GATE PANEL */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-sm backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>Enterprise Approval & Regulatory Verification Gate</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Requires human sign-off acknowledging brand compliance before queueing to live social connectors.
            </p>
          </div>

          <Badge variant="brand" size="sm">
            Actor: Elena Rostova (Owner)
          </Badge>
        </div>

        {/* Compliance Checkbox */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 flex items-start gap-3">
          <input
            type="checkbox"
            id="complianceCheck"
            checked={complianceAcknowledged}
            onChange={(e) => setComplianceAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-[var(--brand-primary)] cursor-pointer"
          />
          <label htmlFor="complianceCheck" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <strong className="text-slate-900 dark:text-white block font-medium">
              I certify this content adheres to {activeBrand?.name}&apos;s BrandKit directives.
            </strong>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Verified: No restricted terms, accurate aspect ratio scaling, appropriate audience tone, and platform policies obeyed.
            </span>
          </label>
        </div>

        {/* Dual Path Controls */}
        <div className="flex items-center justify-between pt-2">
          {/* Path 1: Reject / Regenerate */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRevisionDrawerOpen(true)}
            className="text-xs text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reject / Request Revision...</span>
          </Button>

          {/* Path 2: Approve & Proceed */}
          <Button
            variant="brand"
            size="sm"
            onClick={handleApprove}
            disabled={!complianceAcknowledged}
            className="shadow-glow-brand text-xs font-semibold"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approve & Unlock Scheduling &rarr;</span>
          </Button>
        </div>
      </div>

      {/* Revision Drawer Component */}
      <RevisionDrawer
        isOpen={revisionDrawerOpen}
        onClose={() => setRevisionDrawerOpen(false)}
      />
    </div>
  );
}
