"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepperBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onStepClick: (step: 1 | 2 | 3 | 4 | 5) => void;
  brandColor?: string;
}

const STEPS = [
  { step: 1, label: "Brand", subtext: "Identity & Tokens" },
  { step: 2, label: "Platforms", subtext: "Channels & Ratios" },
  { step: 3, label: "Create", subtext: "Studio & Repurpose" },
  { step: 4, label: "Approve", subtext: "Previews & Gate" },
  { step: 5, label: "Schedule", subtext: "Connectors & Queue" },
] as const;

export function StepperBar({ currentStep, onStepClick, brandColor }: StepperBarProps) {
  const progressPercent = ((currentStep - 1) / 4) * 100;

  return (
    <div className="w-full px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        {/* Progress line */}
        <div className="relative mb-3 hidden sm:block">
          <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-[var(--brand-primary)] to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step buttons */}
        <div className="grid grid-cols-5 gap-2">
          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const isClickable = s.step <= currentStep;

            return (
              <button
                key={s.step}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(s.step as 1 | 2 | 3 | 4 | 5)}
                className={`group flex flex-col items-center sm:items-start text-left transition-all p-1.5 rounded-xl ${
                  isClickable
                    ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5"
                    : "cursor-not-allowed opacity-40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40"
                        : isCurrent
                        ? "bg-[var(--brand-primary)] text-white shadow-glow-brand font-extrabold"
                        : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/60"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.step}
                  </div>

                  <span
                    className={`text-xs font-semibold hidden md:inline truncate ${
                      isCurrent
                        ? "text-slate-900 dark:text-white"
                        : isCompleted
                        ? "text-slate-700 dark:text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5 truncate pl-8">
                  {s.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
