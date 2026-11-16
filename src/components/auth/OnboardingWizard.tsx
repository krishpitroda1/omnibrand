"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Palette,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Layers,
  X,
} from "lucide-react";

export function OnboardingWizard() {
  const {
    organization,
    workspaces,
    completeOnboarding,
    setOnboardingOpen,
    onboardingOpen,
  } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [companyName, setCompanyName] = useState(organization?.name || "Acme Innovations");
  const [workspaceName, setWorkspaceName] = useState(workspaces[0]?.name || "Main Marketing HQ");
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("Technology & SaaS");
  const [tagline, setTagline] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [secondaryColor, setSecondaryColor] = useState("#0F172A");
  const [accentColor, setAccentColor] = useState("#10B981");
  const [toneDirectives, setToneDirectives] = useState(
    "Speak with authoritative clarity, modern ambition, and precision."
  );

  if (!onboardingOpen) return null;

  const handleFinish = () => {
    completeOnboarding({
      companyName: companyName.trim() || "My Company",
      workspaceName: workspaceName.trim() || "Main Marketing HQ",
      brandName: brandName.trim() || companyName.trim() || "Core Brand",
      industry: industry.trim() || "Digital Enterprise",
      tagline: tagline.trim() || "Built for the future",
      primaryColor,
      secondaryColor,
      accentColor,
      toneDirectives,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 relative">
        {/* Close / Skip button */}
        <button
          type="button"
          onClick={() => setOnboardingOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          title="Skip setup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Wizard Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-[var(--brand-primary)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[var(--brand-primary)] font-mono">
              Welcome to OmniBrand OS • Setup Wizard
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {step === 1 && "Configure Your Organization & Primary Workspace"}
            {step === 2 && "Establish Your First Brand & Design System"}
            {step === 3 && "Review & Launch Your Clean Workspace"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {step === 1 && "Fill in your company details according to your needs. You can edit these anytime."}
            {step === 2 && "Design tokens, color palette, and tone directives seed your AI agents and templates."}
            {step === 3 && "Your workspace will initialize clean and empty, ready for you to create campaigns."}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 pt-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step
                  ? "bg-[var(--brand-primary,#3B82F6)]"
                  : "bg-slate-200 dark:bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* STEP 1: COMPANY & WORKSPACE */}
        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Company / Organization Legal Entity Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Horizon Technologies, Inc."
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primary Workspace Name
              </label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. Main Marketing HQ or North America Studio"
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Workspaces provide isolated campaign environments and access control for regional teams.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="brand"
                onClick={() => setStep(2)}
                className="bg-blue-600 hover:bg-blue-700 !text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-md"
              >
                <span className="!text-white font-bold">Continue to Brand Setup</span>
                <ArrowRight className="h-4 w-4 !text-white" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: FIRST BRAND & PALETTE */}
        {step === 2 && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Apex Cloud or Lumina"
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Industry / Sector
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-primary)]"
                >
                  <option value="Technology & SaaS">Technology & SaaS</option>
                  <option value="Fintech & Wealth">Fintech & Wealth</option>
                  <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="Design & Creative Studio">Design & Creative Studio</option>
                  <option value="Real Estate & Architecture">Real Estate & Architecture</option>
                  <option value="Automotive & Mobility">Automotive & Mobility</option>
                  <option value="Hospitality & Travel">Hospitality & Travel</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Empowering bold teams to scale without friction"
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            {/* Color Palette (Primary, Secondary, Accent) */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Design System Palette (Primary, Secondary, Accent)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold block">Primary Brand</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-7 w-7 rounded-lg cursor-pointer border border-black/10 dark:border-white/20 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {primaryColor}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold block">Secondary</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-7 w-7 rounded-lg cursor-pointer border border-black/10 dark:border-white/20 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {secondaryColor}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold block">Accent</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-7 w-7 rounded-lg cursor-pointer border border-black/10 dark:border-white/20 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {accentColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tone of Voice Directives
              </label>
              <textarea
                rows={2}
                value={toneDirectives}
                onChange={(e) => setToneDirectives(e.target.value)}
                placeholder="e.g. Speak with clarity, confidence, zero hype words, and empirical data."
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                type="button"
                variant="brand"
                onClick={() => setStep(3)}
                className="bg-blue-600 hover:bg-blue-700 !text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-md"
              >
                <span className="!text-white font-bold">Review & Launch</span>
                <ArrowRight className="h-4 w-4 !text-white" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
                    Organization & Workspace
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {companyName} • <span className="text-slate-600 dark:text-slate-400">{workspaceName}</span>
                  </div>
                </div>
                <Badge variant="brand" size="sm">
                  PRO Plan
                </Badge>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(brandName || companyName).substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {brandName || companyName}
                  </div>
                  <div className="text-xs text-slate-500">{industry}</div>
                  {tagline && <p className="text-[11px] text-slate-600 dark:text-slate-400 italic mt-0.5">&ldquo;{tagline}&rdquo;</p>}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Palette:</span>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-6 rounded border" style={{ backgroundColor: primaryColor }} title="Primary" />
                  <div className="h-4 w-6 rounded border" style={{ backgroundColor: secondaryColor }} title="Secondary" />
                  <div className="h-4 w-6 rounded border" style={{ backgroundColor: accentColor }} title="Accent" />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                type="button"
                variant="brand"
                onClick={handleFinish}
                className="bg-blue-600 hover:bg-blue-700 !text-white font-bold py-2.5 px-6 rounded-xl shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 !text-white" />
                <span className="!text-white font-bold">Initialize My Workspace</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
