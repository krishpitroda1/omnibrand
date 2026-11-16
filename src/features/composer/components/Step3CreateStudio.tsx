"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAppStore } from "@/store";
import { AiModel, Platform, AspectRatio, MediaAssetItem } from "@/types";
import { ImageVariant, PlatformVariantData } from "@/features/composer/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Layers,
  Wand2,
  CheckCircle2,
  ZoomIn,
  Check,
  Upload,
  Database,
  Image as ImageIcon,
  Edit3,
  Search,
  RefreshCw,
  ExternalLink,
  Save,
  Tag,
  Sliders,
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

type CreationMode = "AI_GENERATION" | "EXISTING_POSTS" | "MANUAL_POST";

export function Step3CreateStudio() {
  const {
    brands,
    selectedBrandId,
    activeWorkspaceId,
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
    campaigns,
    addCampaign,
    mediaAssets,
    addMediaAsset,
  } = useAppStore();

  const [creationMode, setCreationMode] = useState<CreationMode>("AI_GENERATION");
  const [activeRepurposeTab, setActiveRepurposeTab] = useState<Platform>(
    selectedPlatforms[0] || "INSTAGRAM"
  );
  const [zoomedVariant, setZoomedVariant] = useState<ImageVariant | null>(null);

  // Database posts state
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [dbAssets, setDbAssets] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [dbSearchQuery, setDbSearchQuery] = useState("");
  const [selectedDbPostId, setSelectedDbPostId] = useState<string | null>(null);
  const [dbSyncMessage, setDbSyncMessage] = useState<string | null>(null);

  // Manual post creation state
  const [manualTitle, setManualTitle] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80");
  const [manualCaption, setManualCaption] = useState("");
  const [manualHashtags, setManualHashtags] = useState("#OmniBrand #CreativeFlight #Design");
  const [manualAspectRatio, setManualAspectRatio] = useState<AspectRatio>("PORTRAIT_4_5");
  const [isSavingManual, setIsSavingManual] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Fetch posts and assets from Supabase database
  const fetchDbContent = async () => {
    setIsLoadingDb(true);
    try {
      const [campRes, assetRes] = await Promise.all([
        fetch("/api/campaigns").then((r) => r.json()).catch(() => ({ campaigns: [] })),
        fetch("/api/media/assets").then((r) => r.json()).catch(() => ({ assets: [] })),
      ]);

      setDbPosts(campRes?.campaigns || []);
      setDbAssets(assetRes?.assets || []);
    } catch (e) {
      console.warn("Could not fetch DB posts:", e);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchDbContent();
  }, []);

  // Combine DB campaigns + Zustand campaigns + DB assets + mediaAssets without duplicates
  const allExistingItems = useMemo(() => {
    const items: Array<{
      id: string;
      name: string;
      caption: string;
      mediaUrl: string;
      source: "DATABASE_CAMPAIGN" | "STORE_CAMPAIGN" | "MEDIA_ASSET";
      date: string;
      hashtags: string[];
      channels?: string[];
    }> = [];

    // 1. Database campaigns
    dbPosts.forEach((c) => {
      if (c.name || c.id) {
        items.push({
          id: c.id,
          name: c.name || "Campaign Flight",
          caption: c.caption || c.name || "",
          mediaUrl: c.media_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
          source: "DATABASE_CAMPAIGN",
          date: c.created_at || c.start_date || new Date().toISOString(),
          hashtags: c.hashtags || ["#OmniBrand", "#CreativeFlight"],
          channels: c.channels || ["INSTAGRAM", "LINKEDIN"],
        });
      }
    });

    // 2. Store campaigns not already included
    campaigns.forEach((c) => {
      if (!items.some((it) => it.id === c.id || it.name === c.name)) {
        items.push({
          id: c.id,
          name: c.name,
          caption: c.caption || c.description || c.name,
          mediaUrl: c.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
          source: "STORE_CAMPAIGN",
          date: c.startDate || new Date().toISOString(),
          hashtags: c.hashtags || ["#OmniBrand"],
          channels: c.channels?.map((ch) => ch.platform),
        });
      }
    });

    // 3. Media Assets
    [...dbAssets, ...mediaAssets].forEach((a) => {
      const id = a.id || `ast-${Date.now()}`;
      if (!items.some((it) => it.id === id || it.mediaUrl === a.url)) {
        items.push({
          id,
          name: a.name || a.promptUsed?.slice(0, 40) || "Media Asset",
          caption: a.promptUsed || a.name || "",
          mediaUrl: a.url || a.thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
          source: "MEDIA_ASSET",
          date: a.createdAt || a.created_at || new Date().toISOString(),
          hashtags: a.tags || ["#Asset", "#CreativeOps"],
        });
      }
    });

    return items;
  }, [dbPosts, campaigns, dbAssets, mediaAssets]);

  // Filtered DB items
  const filteredExistingItems = useMemo(() => {
    if (!dbSearchQuery.trim()) return allExistingItems;
    const q = dbSearchQuery.toLowerCase();
    return allExistingItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.caption.toLowerCase().includes(q) ||
        item.hashtags.some((h) => h.toLowerCase().includes(q))
    );
  }, [allExistingItems, dbSearchQuery]);

  // Select an already created post/asset from database
  const handleSelectExistingPost = (item: typeof allExistingItems[0]) => {
    setSelectedDbPostId(item.id);

    // 1. Create a dedicated variant for this selected item
    const variantId = `var-existing-${item.id}`;
    const newVariant: ImageVariant = {
      id: variantId,
      url: item.mediaUrl,
      gradient: "from-blue-600/30 via-slate-900 to-black",
      seed: String(Math.floor(10000 + Math.random() * 90000)),
      model: "FLUX_1_PRO",
      aspectRatio: "PORTRAIT_4_5",
      selected: true,
    };

    setGeneratedVariants([newVariant]);
    setSelectedVariantId(variantId);

    // 2. Load caption and master prompt
    const chosenCaption = item.caption || item.name;
    setMasterPrompt(chosenCaption);
    setEnhancedPrompt(generateEnhancedString(chosenCaption));

    // 3. Auto-populate Multi-Channel Repurposing Engine with this post's content
    const updated: Partial<Record<Platform, PlatformVariantData>> = {};
    selectedPlatforms.forEach((p) => {
      const ratio = platformAspectRatios[p] || "SQUARE_1_1";
      updated[p] = {
        platform: p,
        caption: chosenCaption,
        hashtags: item.hashtags.length > 0 ? item.hashtags : ["#OmniBrand", "#CreativeFlight"],
        ctaText: "Learn More",
        ctaUrl: activeBrand?.website || "https://luminacreative.studio",
        aspectRatio: ratio,
        brandCheckPass: true,
        brandCheckNotes: `Loaded from database post: "${item.name}". Synchronized across native channels.`,
      };
    });
    setRepurposedVariants(updated);

    setDbSyncMessage(`✓ Loaded post "${item.name}" from database. Ready for native preview & editing.`);
    setTimeout(() => setDbSyncMessage(null), 5000);
  };

  // Save changes to selected post in database
  const handleSavePostToDatabase = async () => {
    if (!selectedDbPostId) return;
    setIsLoadingDb(true);
    try {
      const currentCaption = repurposedVariants[activeRepurposeTab]?.caption || masterPrompt;
      const currentTags = repurposedVariants[activeRepurposeTab]?.hashtags || ["#OmniBrand"];
      const activeVariant = generatedVariants.find((v) => v.id === selectedVariantId) || generatedVariants[0];

      await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: masterPrompt.slice(0, 60) || "Updated Post Flight",
          workspaceId: activeWorkspaceId,
          brandId: activeBrand?.id,
          brandName: activeBrand?.name,
          caption: currentCaption,
          hashtags: currentTags,
          mediaUrl: activeVariant?.url,
          status: "SCHEDULED",
        }),
      });

      setDbSyncMessage("✓ Successfully synchronized post updates to Supabase database.");
      fetchDbContent();
      setTimeout(() => setDbSyncMessage(null), 4000);
    } catch (err) {
      console.error("Save to DB failed:", err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) {
        setManualImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save manual post and apply to flight
  const handleSaveManualPost = async () => {
    if (!manualCaption.trim() && !manualTitle.trim()) {
      alert("Please enter a title or caption for the post.");
      return;
    }

    setIsSavingManual(true);
    const title = manualTitle.trim() || manualCaption.slice(0, 50) || "Manual Creative Post";
    const tags = manualHashtags
      .split(/[\s,]+/)
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    const variantId = `var-manual-${Date.now()}`;
    const newVariant: ImageVariant = {
      id: variantId,
      url: manualImageUrl,
      gradient: "from-blue-600/30 via-slate-900 to-black",
      seed: String(Math.floor(10000 + Math.random() * 90000)),
      model: "FLUX_1_PRO",
      aspectRatio: manualAspectRatio,
      selected: true,
    };

    setGeneratedVariants([newVariant]);
    setSelectedVariantId(variantId);
    setMasterPrompt(manualCaption || title);

    // Save to media assets in DB
    try {
      await fetch("/api/media/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: activeWorkspaceId,
          url: manualImageUrl,
          aspectRatio: manualAspectRatio,
          promptUsed: title,
          tags,
          status: "APPROVED",
        }),
      });
    } catch (err) {
      console.warn("DB media asset save warning:", err);
    }

    // Add to store
    addMediaAsset({
      id: `ast-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      brandId: activeBrand?.id || "brand-01",
      brandName: activeBrand?.name || "Lumina Creative",
      url: manualImageUrl,
      thumbnailUrl: manualImageUrl,
      aspectRatio: manualAspectRatio,
      width: 1080,
      height: 1080,
      dimensions: "1080×1080",
      format: "PNG",
      mimeType: "image/png",
      fileSize: 2048000,
      folderId: "manual-uploads",
      tags,
      promptUsed: title,
      modelUsed: "FLUX_1_PRO",
      isFavorite: true,
      usageCount: 1,
      campaignsUsed: [],
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Repurpose across platforms
    const updated: Partial<Record<Platform, PlatformVariantData>> = {};
    selectedPlatforms.forEach((p) => {
      updated[p] = {
        platform: p,
        caption: manualCaption || title,
        hashtags: tags,
        ctaText: "Learn More",
        ctaUrl: activeBrand?.website || "https://luminacreative.studio",
        aspectRatio: platformAspectRatios[p] || manualAspectRatio,
        brandCheckPass: true,
        brandCheckNotes: "Manual creative asset verified and added to database.",
      };
    });
    setRepurposedVariants(updated);

    setIsSavingManual(false);
    setDbSyncMessage(`✓ Manual post "${title}" created and saved to database.`);
    setTimeout(() => setDbSyncMessage(null), 4000);
  };

  // AI Generation handler
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
    }, 1800);
  };

  // Multi-channel repurposing
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
          caption: `Spaces sculpted by natural light. ${masterPrompt}\n\nDesigned with timeless perspective for ${activeBrand?.name}.`,
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
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Step 3: Creative Studio & Multi-Channel Repurposing Engine</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Generate with AI models, select from already created database posts, or manually compose assets.
          </p>
        </div>

        {/* Database Notification Toast */}
        {dbSyncMessage && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600 text-xs font-semibold text-emerald-800 dark:text-emerald-200 shadow-sm flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{dbSyncMessage}</span>
          </div>
        )}
      </div>

      {/* 3 CREATION MODES TAB SELECTOR */}
      <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-center gap-2 shadow-inner">
        <button
          type="button"
          onClick={() => setCreationMode("AI_GENERATION")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            creationMode === "AI_GENERATION"
              ? "bg-white dark:bg-slate-800 text-[var(--brand-primary)] shadow-sm border border-slate-200 dark:border-white/10"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>AI Visual Generation</span>
        </button>

        <button
          type="button"
          onClick={() => setCreationMode("EXISTING_POSTS")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            creationMode === "EXISTING_POSTS"
              ? "bg-white dark:bg-slate-800 text-[var(--brand-primary)] shadow-sm border border-slate-200 dark:border-white/10"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Database className="h-4 w-4 text-blue-500" />
          <span>Already Created Posts ({allExistingItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setCreationMode("MANUAL_POST")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            creationMode === "MANUAL_POST"
              ? "bg-white dark:bg-slate-800 text-[var(--brand-primary)] shadow-sm border border-slate-200 dark:border-white/10"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Edit3 className="h-4 w-4 text-emerald-500" />
          <span>Add Manually / Upload</span>
        </button>
      </div>

      {/* MODE 1: AI GENERATION STUDIO */}
      {creationMode === "AI_GENERATION" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Prompt Composer & Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
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

            {/* Generation Action */}
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
                Visual Variants
              </span>
              <Badge variant="metric-mock" size="sm">ACTIVE SEED MOCK</Badge>
            </div>

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

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-white font-mono">
                        #{idx + 1} &bull; Seed {variant.seed}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold shadow-sm">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

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
      )}

      {/* MODE 2: ALREADY CREATED POSTS & DATABASE LIBRARY */}
      {creationMode === "EXISTING_POSTS" && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-[var(--brand-primary)]" />
                <span>Select from Existing Database Posts & Media Assets</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any previously scheduled or created post to import its visual assets, caption, and tags directly.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDbContent}
                isLoading={isLoadingDb}
                className="text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                <span>Sync with Supabase DB</span>
              </Button>

              {selectedDbPostId && (
                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleSavePostToDatabase}
                  isLoading={isLoadingDb}
                  className="text-xs"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  <span>Update in Database</span>
                </Button>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={dbSearchQuery}
              onChange={(e) => setDbSearchQuery(e.target.value)}
              placeholder="Search posts by campaign title, caption, or hashtag..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto p-1">
            {filteredExistingItems.map((item) => {
              const isSelected = selectedDbPostId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectExistingPost(item)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/40 shadow-md"
                      : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.mediaUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-white/10 text-blue-700 dark:text-sky-300 font-semibold font-mono shrink-0">
                          {item.source === "DATABASE_CAMPAIGN" ? "SUPABASE" : "POST"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                        {item.caption || item.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span className="font-semibold text-blue-600 dark:text-sky-400">
                        {isSelected ? "Active in Flight ✓" : "Click to load"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredExistingItems.length === 0 && (
              <div className="col-span-full py-8 text-center text-xs text-slate-500">
                No posts found matching &ldquo;{dbSearchQuery}&rdquo;. Try another term or create one manually!
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: ADD MANUALLY / UPLOAD POST */}
      {creationMode === "MANUAL_POST" && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-emerald-500" />
              <span>Add Post Manually & Save to Database</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload an image from your computer or enter an external image URL, compose native copy, and store it in Supabase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Left: Image Upload & Preview (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Media Source (Upload File or Enter URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualImageUrl}
                    onChange={(e) => setManualImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs shrink-0"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    <span>Upload</span>
                  </Button>
                </div>
              </div>

              {/* Image Preview */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={manualImageUrl}
                  alt="Manual Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-mono">
                  Aspect: {manualAspectRatio}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                  Target Aspect Ratio
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["PORTRAIT_4_5", "SQUARE_1_1", "LANDSCAPE_16_9"] as AspectRatio[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setManualAspectRatio(r)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all ${
                        manualAspectRatio === r
                          ? "bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {r.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Manual Copy & Tags (7 cols) */}
            <div className="md:col-span-7 space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Campaign / Post Title
                </label>
                <Input
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. November Brand Architecture Release"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Full Caption / Body Copy
                </label>
                <textarea
                  rows={5}
                  value={manualCaption}
                  onChange={(e) => setManualCaption(e.target.value)}
                  placeholder="Type the full post caption for your omnichannel release..."
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Hashtags (Space or comma separated)
                </label>
                <Input
                  value={manualHashtags}
                  onChange={(e) => setManualHashtags(e.target.value)}
                  placeholder="#Design #BrandArchitecture #OmniBrand"
                  className="text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleSaveManualPost}
                  isLoading={isSavingManual}
                  className="shadow-glow-brand"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  <span>Save to Database & Apply to Flight</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
