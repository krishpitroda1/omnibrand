"use client";

import React from "react";
import { useAppStore } from "@/store";
import { Platform, AspectRatio } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Check,
  Info,
  Maximize2,
  Share2,
  Smartphone,
  Tv,
} from "lucide-react";

interface PlatformConfig {
  id: Platform;
  name: string;
  defaultRatio: AspectRatio;
  allowedRatios: { ratio: AspectRatio; resolution: string; label: string }[];
  capability: "PUBLISH" | "READ" | "RESTRICTED";
  restrictedReason?: string;
}

const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: "INSTAGRAM",
    name: "Instagram",
    defaultRatio: "PORTRAIT_4_5",
    allowedRatios: [
      { ratio: "PORTRAIT_4_5", resolution: "1080 × 1350", label: "Portrait 4:5 (Feed Optimal)" },
      { ratio: "SQUARE_1_1", resolution: "1080 × 1080", label: "Square 1:1 (Carousel)" },
      { ratio: "VERTICAL_9_16", resolution: "1080 × 1920", label: "Stories & Reels 9:16" },
    ],
    capability: "PUBLISH",
  },
  {
    id: "LINKEDIN",
    name: "LinkedIn",
    defaultRatio: "LANDSCAPE_16_9",
    allowedRatios: [
      { ratio: "LANDSCAPE_16_9", resolution: "1920 × 1080", label: "Landscape 16:9 (Desktop Hero)" },
      { ratio: "SQUARE_1_1", resolution: "1080 × 1080", label: "Square 1:1 (Mobile Feed)" },
    ],
    capability: "PUBLISH",
  },
  {
    id: "X",
    name: "X (Twitter)",
    defaultRatio: "LANDSCAPE_16_9",
    allowedRatios: [
      { ratio: "LANDSCAPE_16_9", resolution: "1920 × 1080", label: "Landscape 16:9 (Timeline Card)" },
      { ratio: "SQUARE_1_1", resolution: "1080 × 1080", label: "Square 1:1 (Multi-Photo)" },
    ],
    capability: "PUBLISH",
  },
  {
    id: "FACEBOOK",
    name: "Facebook",
    defaultRatio: "SQUARE_1_1",
    allowedRatios: [
      { ratio: "SQUARE_1_1", resolution: "1080 × 1080", label: "Square 1:1 (Page Feed)" },
      { ratio: "LANDSCAPE_16_9", resolution: "1920 × 1080", label: "Landscape 16:9 (Link Preview)" },
    ],
    capability: "PUBLISH",
  },
  {
    id: "PINTEREST",
    name: "Pinterest",
    defaultRatio: "PORTRAIT_4_5",
    allowedRatios: [
      { ratio: "PORTRAIT_4_5", resolution: "1080 × 1350", label: "Portrait 4:5 (Standard Pin)" },
      { ratio: "VERTICAL_9_16", resolution: "1080 × 1920", label: "Idea Pin 9:16" },
    ],
    capability: "PUBLISH",
  },
  {
    id: "THREADS",
    name: "Threads",
    defaultRatio: "SQUARE_1_1",
    allowedRatios: [
      { ratio: "SQUARE_1_1", resolution: "1080 × 1080", label: "Square 1:1" },
      { ratio: "PORTRAIT_4_5", resolution: "1080 × 1350", label: "Portrait 4:5" },
    ],
    capability: "PUBLISH",
  },
  {
    id: "YOUTUBE",
    name: "YouTube Community",
    defaultRatio: "LANDSCAPE_16_9",
    allowedRatios: [
      { ratio: "LANDSCAPE_16_9", resolution: "1920 × 1080", label: "Landscape 16:9 (Community Post)" },
      { ratio: "SQUARE_1_1", resolution: "1080 × 1080", label: "Square 1:1" },
    ],
    capability: "PUBLISH",
  },
  {
    id: "GOOGLE_BUSINESS",
    name: "Google Business",
    defaultRatio: "LANDSCAPE_16_9",
    allowedRatios: [
      { ratio: "LANDSCAPE_16_9", resolution: "1920 × 1080", label: "Landscape 16:9 (Local Update)" },
      { ratio: "SQUARE_1_1", resolution: "1080 × 1080", label: "Square 1:1" },
    ],
    capability: "PUBLISH",
  },
  {
    id: "TIKTOK",
    name: "TikTok",
    defaultRatio: "VERTICAL_9_16",
    allowedRatios: [
      { ratio: "VERTICAL_9_16", resolution: "1080 × 1920", label: "Vertical 9:16" },
    ],
    capability: "RESTRICTED",
    restrictedReason: "Platform Restriction: TikTok Content Verification Policy requires mobile device upload authorization. Automated API scheduling is restricted.",
  },
];

export function Step2PlatformAspect() {
  const {
    selectedPlatforms,
    togglePlatformSelection,
    platformAspectRatios,
    setPlatformAspectRatio,
  } = useAppStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Step 2: Destination Platforms & Aspect Ratio Matrix</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Select target social channels. Each platform auto-suggests optimal native resolutions, with user override.
        </p>
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {PLATFORM_CONFIGS.map((cfg) => {
          const isSelected = selectedPlatforms.includes(cfg.id);
          const isRestricted = cfg.capability === "RESTRICTED";
          const currentRatio = platformAspectRatios[cfg.id] || cfg.defaultRatio;
          const ratioInfo = cfg.allowedRatios.find((r) => r.ratio === currentRatio) || cfg.allowedRatios[0];

          return (
            <div
              key={cfg.id}
              onClick={() => {
                if (!isRestricted) {
                  togglePlatformSelection(cfg.id);
                }
              }}
              className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                isRestricted
                  ? "bg-amber-50/50 dark:bg-slate-950/30 border-amber-300 dark:border-amber-500/20 opacity-70 cursor-not-allowed"
                  : isSelected
                  ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] shadow-sm ring-1 ring-[var(--brand-primary)] cursor-pointer"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{cfg.name}</span>
                    {isRestricted && (
                      <span title={cfg.restrictedReason} className="cursor-help">
                        <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      </span>
                    )}
                  </div>

                  <Badge
                    variant={
                      cfg.capability === "PUBLISH"
                        ? "publish"
                        : cfg.capability === "READ"
                        ? "read"
                        : "restricted"
                    }
                    size="sm"
                  >
                    {cfg.capability}
                  </Badge>
                </div>

                {isRestricted ? (
                  <p className="mt-2 text-[10px] text-amber-800 dark:text-amber-300/80 leading-relaxed font-medium">
                    {cfg.restrictedReason}
                  </p>
                ) : (
                  <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Aspect Ratio:</span>
                      <span className="font-mono text-[10px] font-semibold text-[var(--brand-primary)]">
                        {ratioInfo.resolution}
                      </span>
                    </div>

                    <select
                      value={currentRatio}
                      disabled={!isSelected}
                      onChange={(e) => setPlatformAspectRatio(cfg.id, e.target.value as AspectRatio)}
                      className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-primary)] disabled:opacity-60 disabled:bg-slate-100 disabled:text-slate-500 dark:disabled:bg-slate-900/50 dark:disabled:text-slate-400 font-medium"
                    >
                      {cfg.allowedRatios.map((r) => (
                        <option key={r.ratio} value={r.ratio}>
                          {r.label} ({r.resolution})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {!isRestricted && (
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    {isSelected ? "Included in dispatch" : "Click to select"}
                  </span>
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white shadow-sm"
                        : "border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
