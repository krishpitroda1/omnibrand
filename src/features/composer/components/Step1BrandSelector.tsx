"use client";

import React from "react";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Sparkles, Share2 } from "lucide-react";

export function Step1BrandSelector() {
  const {
    brands,
    activeWorkspaceId,
    selectedBrandId,
    setWizardBrand,
    campaignName,
    setCampaignName,
  } = useAppStore();

  const workspaceBrands = brands.filter((b) => b.workspaceId === activeWorkspaceId);
  const displayBrands = workspaceBrands.length > 0 ? workspaceBrands : brands;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Step 1: Select Brand Context & Campaign Flight</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Every generation, caption, and channel payload is rooted in the selected brand&apos;s design tokens and tone directives.
        </p>
      </div>

      {/* Campaign Name Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Flight / Campaign Title
        </label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="e.g. Q4 Editorial Lookbook & Spatial Series"
          className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
        />
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayBrands.map((brand) => {
          const isSelected = brand.id === selectedBrandId;
          const kit = brand.brandKit;

          return (
            <div
              key={brand.id}
              onClick={() => setWizardBrand(brand.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] shadow-sm ring-1 ring-[var(--brand-primary)]"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/80 dark:hover:bg-slate-900/80 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: kit?.primaryColor || "#3B82F6" }}
                    >
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {brand.name}
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{brand.industry}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="h-6 w-6 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Tone snippet */}
                <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2">
                  &ldquo;{kit?.toneDirectives || brand.tagline}&rdquo;
                </p>

                {/* Color swatches */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Palette:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-6 rounded-md border border-slate-300 dark:border-white/20 shadow-sm"
                      style={{ backgroundColor: kit?.primaryColor }}
                      title={`Primary: ${kit?.primaryColor}`}
                    />
                    <div
                      className="h-4 w-6 rounded-md border border-slate-300 dark:border-white/20 shadow-sm"
                      style={{ backgroundColor: kit?.secondaryColor }}
                      title={`Secondary: ${kit?.secondaryColor}`}
                    />
                    <div
                      className="h-4 w-6 rounded-md border border-slate-300 dark:border-white/20 shadow-sm"
                      style={{ backgroundColor: kit?.accentColor }}
                      title={`Accent: ${kit?.accentColor}`}
                    />
                  </div>
                </div>

                {/* Tone keywords */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {kit?.toneKeywords?.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connected accounts with health dots */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  <span>{brand.socialAccounts?.length || 0} Connected Accounts:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {brand.socialAccounts?.map((sa) => {
                    const isHealthy = sa.health?.status === "HEALTHY";
                    const isRestricted = sa.capabilities.includes("RESTRICTED");

                    return (
                      <span
                        key={sa.id}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-slate-300 border border-white/5"
                        title={`${sa.platform}: ${sa.health?.status || "CONNECTED"}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isRestricted
                              ? "bg-amber-400"
                              : isHealthy
                              ? "bg-emerald-400"
                              : "bg-rose-400"
                          }`}
                        />
                        {sa.platform.substring(0, 2)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
