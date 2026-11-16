"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/store";
import { StepperBar } from "./StepperBar";
import { Step1BrandSelector } from "./Step1BrandSelector";
import { Step2PlatformAspect } from "./Step2PlatformAspect";
import { Step3CreateStudio } from "./Step3CreateStudio";
import { Step4PreviewApproval } from "./Step4PreviewApproval";
import { Step5ScheduleConnectors } from "./Step5ScheduleConnectors";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function CampaignComposerWizard() {
  const router = useRouter();
  const {
    createModalOpen,
    setCreateModalOpen,
    step,
    setWizardStep,
    selectedPlatforms,
    brands,
    selectedBrandId,
    resetComposerWizard,
  } = useAppStore();

  const activeBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  // Lock background scroll when open
  useEffect(() => {
    if (createModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [createModalOpen]);

  if (!createModalOpen) return null;

  const handleClose = () => {
    setCreateModalOpen(false);
  };

  const handleNext = () => {
    if (step < 5) {
      setWizardStep((step + 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setWizardStep((step - 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const handleWizardComplete = () => {
    router.push("/campaign-manager");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 text-slate-900 dark:bg-[#060913] dark:text-slate-100 overflow-hidden animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <header className="h-16 px-6 border-b border-slate-200 dark:border-white/10 glass-panel bg-white/95 dark:bg-slate-950/80 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center font-bold text-white shadow-glow-brand"
            style={{ backgroundColor: activeBrand?.brandKit?.primaryColor || "#3b82f6" }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Campaign Composer & Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-white/10">
                Active Brand: {activeBrand?.name}
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              5-Step Unified Omnichannel Dispatch Flow
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          aria-label="Close Composer"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Stepper Bar */}
      <StepperBar
        currentStep={step}
        onStepClick={setWizardStep}
        brandColor={activeBrand?.brandKit?.primaryColor}
      />

      {/* Main Step Workspace (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {step === 1 && <Step1BrandSelector />}
        {step === 2 && <Step2PlatformAspect />}
        {step === 3 && <Step3CreateStudio />}
        {step === 4 && <Step4PreviewApproval />}
        {step === 5 && <Step5ScheduleConnectors onComplete={handleWizardComplete} />}
      </main>

      {/* Sticky Bottom Wizard Controls */}
      <footer className="h-16 px-6 border-t border-slate-200 dark:border-white/10 glass-panel bg-white/95 dark:bg-slate-950/80 flex items-center justify-between flex-shrink-0 z-10">
        <div>
          {step > 1 ? (
            <Button variant="ghost" size="sm" onClick={handlePrev} className="flex items-center gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
            Step {step} of 5 &bull; {selectedPlatforms.length} Channels Target
          </span>

          {step < 4 && (
            <Button variant="brand" size="sm" onClick={handleNext} className="flex items-center gap-1.5 shadow-glow-brand">
              <span>Continue</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {step === 4 && (
            <span className="text-xs text-amber-700 dark:text-amber-300 font-medium hidden sm:inline">
              Sign off on brand compliance above to proceed &rarr;
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
