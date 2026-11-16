"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { AiModel, Platform, AspectRatio } from "@/types";
import { ImageVariant, PlatformVariantData } from "@/features/composer/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Cpu,
  Layers,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  RefreshCw,
  Sliders,
  Check,
  Bookmark,
  Hash,
} from "lucide-react";

const AI_MODELS: {
  id: AiModel;
  name: string;
  speed: string;
  credits: number;
  description: string;
}[] = [
  {
    id: "FLUX_1_PRO",
    name: "Flux.1 Pro",
    speed: "Ultra-Fast (1.8s)",
    credits: 15,
    description: "State-of-the-art photorealism, typography precision & organic lighting.",
  },
  {
    id: "DALLE_3",
    name: "DALL-E 3 HD",
    speed: "Standard (3.2s)",
    credits: 25,
    description: "Exceptional prompt coherence, complex semantic scenes & narrative depth.",
  },
  {
    id: "SDXL_TURBO",
    name: "SDXL Turbo",
    speed: "Instant (0.8s)",
    credits: 8,
    description: "Sub-second real-time iteration, stylistic exploration & social speed.",
  },
];

export function Step3CreateStudio() {
  const {
    brands,
    selectedBrandId,
    selectedPlatforms,
    platformAspectRatios,
    masterPrompt,
    setMasterPrompt,
    enhancedPrompt,
    setEnhancedPrompt,
    isEnhanceWithTone,
    setIsEnhanceWithTone,
    selectedModel,
    setSelectedModel,
    isGenerating,
    setIsGenerating,
    generatedVariants,
    setGeneratedVariants,
    selectedVariantId,
    setSelectedVariantId,
    repurposedVariants,
    setRepurposedVariants,
    updateSinglePlatformVariant,
    saveToMediaLibrary,
    setSaveToMediaLibrary,
    organization,
  } = useAppStore();

  const [activeRepurposeTab, setActiveRepurposeTab] = useState<Platform>(
    selectedPlatforms[0] || "INSTAGRAM"
  );
  const [zoomedVariant, setZoomedVariant] = useState<ImageVariant | null>(null);

  // Caption generator mini-controls
  const [captionTone, setCaptionTone] = useState<"EDITORIAL" | "CONCISE" | "VIRAL">("EDITORIAL");
  const [hashtagCount, setHashtagCount] = useState<number>(5);

  const activeBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];
  const kit = activeBrand?.brandKit;

  // Real-time enhanced prompt generation based on active brand kit
  const generateEnhancedString = (rawPrompt: string) => {
    const toneSnippet = kit?.toneKeywords?.join(", ") || "Warm, Artisanal";
    const primary = kit?.primaryColor || "#E8B04B";
    const directives = kit?.toneDirectives?.slice(0, 100) || "Refined intentional craft";
    return `${rawPrompt} | Aesthetic parameters: Natural directional lighting, subtle chromatic accents in ${primary}, 35mm anamorphic glass, sensory texture rendering. Tone: ${toneSnippet}. Directives: ${directives}. Zero synthetic noise, no high-gloss plasticky artifacts.`;
  };

  const handlePromptChange = (val: string) => {
    setMasterPrompt(val);
    setEnhancedPrompt(generateEnhancedString(val));
  };

  const handleGenerateImages = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newVariants: ImageVariant[] = [
        {
          id: `var-${Date.now()}-1`,
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
          gradient: `from-[${kit?.primaryColor || "#E8B04B"}]/30 via-slate-900 to-black`,
          seed: String(Math.floor(10000 + Math.random() * 90000)),
          model: selectedModel,
          aspectRatio: "PORTRAIT_4_5",
          selected: true,
        },
        {
          id: `var-${Date.now()}-2`,
          url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1080&auto=format&fit=crop&q=80",
          gradient: "from-blue-600/30 via-slate-900 to-black",
          seed: String(Math.floor(10000 + Math.random() * 90000)),
          model: selectedModel,
          aspectRatio: "PORTRAIT_4_5",
          selected: false,
        },
        {
          id: `var-${Date.now()}-3`,
          url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1080&auto=format&fit=crop&q=80",
          gradient: "from-emerald-600/30 via-slate-900 to-black",
          seed: String(Math.floor(10000 + Math.random() * 90000)),
          model: selectedModel,
          aspectRatio: "PORTRAIT_4_5",
          selected: false,
        },
        {
          id: `var-${Date.now()}-4`,
          url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1080&auto=format&fit=crop&q=80",
          gradient: "from-purple-600/30 via-slate-900 to-black",
          seed: String(Math.floor(10000 + Math.random() * 90000)),
          model: selectedModel,
          aspectRatio: "PORTRAIT_4_5",
          selected: false,
        },
      ];
      setGeneratedVariants(newVariants);
      setSelectedVariantId(newVariants[0].id);
    }, 2000);
  };

  // MULTI-CHANNEL REPURPOSING ENGINE
  const handleRepurposeToAll = () => {
    const updated: Partial<Record<Platform, PlatformVariantData>> = {};

    selectedPlatforms.forEach((p) => {
      const ratio = platformAspectRatios[p] || "SQUARE_1_1";
      if (p === "X") {
        updated[p] = {
          platform: "X",
          caption: `${masterPrompt.slice(0, 180)} — intentional visual craft by ${activeBrand?.name}. Full flight rolling out today.`,
          hashtags: ["#CreativeOps", "#VisualCraft", "#BrandArchitecture"],
          ctaText: "Explore Flight",
          ctaUrl: activeBrand?.website || "https://luminacreative.studio",
          aspectRatio: ratio,
          brandCheckPass: true,
          brandCheckNotes: "Within X 280-char limit. Tone matches brand profile.",
        };
      } else if (p === "LINKEDIN") {
        updated[p] = {
          platform: "LINKEDIN",
          caption: `Why spatial design and visual intentionality redefine how modern brands communicate craft.\n\n${masterPrompt}\n\nOur team focuses on subtle tactile parameters rather than algorithmic noise. Full case study in comments.`,
          hashtags: ["#DesignLeadership", "#BrandArchitecture", "#CreativeOperations", "#SpatialAesthetics"],
          ctaText: "Read Case Study",
          ctaUrl: activeBrand?.website || "https://luminacreative.studio",
          aspectRatio: ratio,
          brandCheckPass: true,
          brandCheckNotes: "B2B thought leadership tone verified. Zero forbidden terms.",
        };
      } else if (p === "INSTAGRAM") {
        updated[p] = {
          platform: "INSTAGRAM",
          caption: `Spaces sculpted by light. ${masterPrompt}\n\nDesigned with timeless perspective for ${activeBrand?.name}.`,
          hashtags: ["#EditorialDesign", "#SpatialAesthetics", "#ArchitecturalLighting", "#LuminaLabs", "#VisualCraft"],
          ctaText: "View Collection",
          ctaUrl: activeBrand?.website || "https://luminacreative.studio",
          aspectRatio: ratio,
          brandCheckPass: true,
          brandCheckNotes: "Instagram rich hashtag structure applied. Aesthetic matches BrandKit.",
        };
      } else if (p === "PINTEREST") {
        updated[p] = {
          platform: "PINTEREST",
          caption: `${activeBrand?.name} Moodboard Series: ${masterPrompt}. High-res tactile studio architectural inspiration.`,
          hashtags: ["#DesignInspiration", "#ArchitectureMoodboard", "#EditorialAesthetics"],
          ctaText: "Save Pin & Visit Studio",
          ctaUrl: activeBrand?.website || "https://luminacreative.studio",
          aspectRatio: ratio,
          brandCheckPass: true,
          brandCheckNotes: "Optimal 4:5 pin format and descriptive search keywords included.",
        };
      } else {
        updated[p] = {
          platform: p,
          caption: `${masterPrompt} — crafted by ${activeBrand?.name}.`,
          hashtags: ["#OmniBrand", "#CreativeOps"],
          ctaText: "Learn More",
          ctaUrl: activeBrand?.website || "https://luminacreative.studio",
          aspectRatio: ratio,
          brandCheckPass: true,
          brandCheckNotes: "Standard channel payload verified.",
        };
      }
    });

    setRepurposedVariants(updated);
  };

  const currentPlatformVariant =
    repurposedVariants[activeRepurposeTab] || {
      platform: activeRepurposeTab,
      caption: masterPrompt,
      hashtags: ["#OmniBrand", "#CreativeOps"],
      ctaText: "Learn More",
      ctaUrl: activeBrand?.website || "https://luminacreative.studio",
      aspectRatio: "SQUARE_1_1",
      brandCheckPass: true,
      brandCheckNotes: "Generated",
    };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Step 3: Prompt Studio & Multi-Channel Repurposing Engine</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Synthesize high-fidelity visual assets, inject brand tone invariants, and automatically repurpose across target channels.
        </p>
      </div>

      {/* Main Studio 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Composer & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Prompt Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                Master Creative Prompt
              </label>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {masterPrompt.length} / 2000 chars &bull; Cost: 15 AI Credits
              </span>
            </div>

            <textarea
              rows={4}
              value={masterPrompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
              placeholder="Describe your visual concept, subject, lighting, and composition..."
            />

            {/* Enhance with Brand Tone Switch */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Enhance with Brand Tone Invariants
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Injects lighting, color temperature, and voice parameters from {activeBrand?.name}
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={isEnhanceWithTone}
                onChange={(e) => setIsEnhanceWithTone(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-[var(--brand-primary)]"
              />
            </div>

            {/* Read-only expanded prompt preview */}
            {isEnhanceWithTone && (
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-slate-950/80 border border-amber-300 dark:border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200/90 leading-relaxed font-mono">
                <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                  <span>Synthesized Injection Pipeline Preview</span>
                </div>
                {enhancedPrompt}
              </div>
            )}
          </div>

          {/* Model Selector Cards */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              Generative Visual Model
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {AI_MODELS.map((m) => {
                const isSelected = selectedModel === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-[var(--brand-primary)]/15 border-[var(--brand-primary)] text-slate-900 dark:text-white shadow-sm ring-1 ring-[var(--brand-primary)]"
                        : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-blue-100 dark:bg-white/10 font-mono text-blue-700 dark:text-[var(--brand-primary)] font-semibold">
                          {m.credits}cr
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">
                        {m.description}
                      </p>
                    </div>
                    <span className="mt-2 text-[9px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                      {m.speed}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generation Action & Media Library Toggle */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={saveToMediaLibrary}
                onChange={(e) => setSaveToMediaLibrary(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-700 text-[var(--brand-primary)]"
              />
              <span>Auto-save approved variants to Media Library</span>
            </label>

            <Button
              variant="brand"
              size="sm"
              onClick={handleGenerateImages}
              isLoading={isGenerating}
              className="shadow-glow-brand"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isGenerating ? "Synthesizing 4 Variants..." : "Generate 4 Variants"}</span>
            </Button>
          </div>
        </div>

        {/* Right Column: 4-Variant Grid Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              Visual Variants (Deterministic Seed MOCK)
            </span>
            <Badge variant="metric-mock" size="sm">MOCK GENERATIONS</Badge>
          </div>

          {/* 4-Variant Grid */}
          <div className="grid grid-cols-2 gap-3">
            {generatedVariants.map((variant, idx) => {
              const isSelected = variant.id === selectedVariantId;

              return (
                <div
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`group relative rounded-xl border overflow-hidden aspect-[4/5] cursor-pointer transition-all duration-200 bg-slate-950 ${
                    isSelected
                      ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/60 shadow-lg"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={variant.url}
                    alt={`Variant ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-white font-mono">
                      #{idx + 1} &bull; Seed {variant.seed}
                    </span>
                  </div>

                  {/* Selected Tick */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold shadow-sm">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Bottom Hover Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedVariant(variant);
                      }}
                      className="p-1 rounded bg-white/20 text-white hover:bg-white/40"
                      title="Inspect full resolution"
                    >
                      <ZoomIn className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] text-white font-medium">
                      {isSelected ? "Active Choice" : "Select this"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MULTI-CHANNEL REPURPOSING ENGINE PANEL */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-sm backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>Multi-Channel Repurposing Engine</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Automatically adapts copy length, hashtag volumes, and aspect ratios to native platform standards.
            </p>
          </div>

          <Button
            variant="brand"
            size="sm"
            onClick={handleRepurposeToAll}
            className="flex items-center gap-1.5"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Repurpose to All Selected Channels</span>
          </Button>
        </div>

        {/* Channel Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {selectedPlatforms.map((p) => {
            const isTabActive = activeRepurposeTab === p;
            const data = repurposedVariants[p];
            const hasPass = data?.brandCheckPass;

            return (
              <button
                key={p}
                onClick={() => setActiveRepurposeTab(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isTabActive
                    ? "bg-[var(--brand-primary)]/15 text-blue-700 dark:text-[var(--brand-primary)] border border-blue-300 dark:border-[var(--brand-primary)]/40 font-bold"
                    : "bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:text-white dark:border-white/5"
                }`}
              >
                <span>{p}</span>
                {data && (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      hasPass ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Variant Editor */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                {activeRepurposeTab} Native Caption
              </label>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {currentPlatformVariant.caption.length} chars
              </span>
            </div>

            <textarea
              rows={3}
              value={currentPlatformVariant.caption}
              onChange={(e) =>
                updateSinglePlatformVariant(activeRepurposeTab, {
                  caption: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
            />

            {/* Hashtag Chips */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1.5 block">
                Hashtags ({currentPlatformVariant.hashtags?.length || 0})
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentPlatformVariant.hashtags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-mono font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Guardian Check */}
          <div className="md:col-span-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-3 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Brand Guardian
                </span>
                <Badge variant="success" size="sm">Passed</Badge>
              </div>
              <p className="mt-2 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentPlatformVariant.brandCheckNotes ||
                  "Tone and length limits match active guidelines. Zero restricted terms detected."}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/5 text-[10px] text-slate-500 font-mono">
              Target Ratio: {currentPlatformVariant.aspectRatio}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedVariant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setZoomedVariant(null)}
        >
          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomedVariant.url}
              alt="Zoomed"
              className="w-full h-auto object-cover"
            />
            <div className="p-3 bg-slate-900 flex items-center justify-between text-xs text-white">
              <span>Seed: {zoomedVariant.seed} &bull; Model: {zoomedVariant.model}</span>
              <Button variant="ghost" size="sm" onClick={() => setZoomedVariant(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
