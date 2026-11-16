"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import { Brand, BrandKit, BrandKnowledgeItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Palette,
  Sparkles,
  Check,
  Edit3,
  Plus,
  BookOpen,
  Share2,
  Globe,
  Sliders,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";

export function BrandKitManager() {
  const {
    brands,
    activeBrandId,
    setActiveBrand,
    updateBrandKit,
    createBrand,
    organization,
    activeWorkspaceId,
  } = useAppStore();

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [brandSuccessMsg, setBrandSuccessMsg] = useState<string | null>(null);

  // Sync brands from Supabase database on mount
  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => {
        if (data?.brands && Array.isArray(data.brands) && data.brands.length > 0) {
          useAppStore.getState().setBrands(data.brands);
        }
      })
      .catch((err) => console.warn("Failed to fetch brands:", err));
  }, []);

  // Form edit states
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [secondaryColor, setSecondaryColor] = useState("#1E293B");
  const [accentColor, setAccentColor] = useState("#F43F5E");
  const [toneKeywords, setToneKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [toneDirectives, setToneDirectives] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState<BrandKnowledgeItem[]>([]);
  const [newKbTitle, setNewKbTitle] = useState("");
  const [newKbContent, setNewKbContent] = useState("");

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsCreating(false);
    setName(brand.name);
    setTagline(brand.tagline || "");
    setDescription(brand.description || "");
    setIndustry(brand.industry || "");
    setWebsite(brand.website || "");
    setPrimaryColor(brand.brandKit?.primaryColor || "#3B82F6");
    setSecondaryColor(brand.brandKit?.secondaryColor || "#1E293B");
    setAccentColor(brand.brandKit?.accentColor || "#F43F5E");
    setToneKeywords(brand.brandKit?.toneKeywords || []);
    setToneDirectives(brand.brandKit?.toneDirectives || "");
    setTargetAudience(brand.brandKit?.targetAudience || "");
    setKnowledgeBase(brand.knowledgeBase || []);
  };

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setIsCreating(true);
    setName("");
    setTagline("");
    setDescription("");
    setIndustry("Digital Media");
    setWebsite("https://");
    setPrimaryColor("#6366F1");
    setSecondaryColor("#0F172A");
    setAccentColor("#10B981");
    setToneKeywords(["Modern", "Agile", "Visionary"]);
    setToneDirectives("Speak with bold ambition and clear precision.");
    setTargetAudience("Modern digital enterprises");
    setKnowledgeBase([]);
  };

  const handleAddKeyword = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (newKeyword.trim() && !toneKeywords.includes(newKeyword.trim())) {
        setToneKeywords([...toneKeywords, newKeyword.trim()]);
        setNewKeyword("");
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setToneKeywords(toneKeywords.filter((k) => k !== keyword));
  };

  const handleAddKbDoc = () => {
    if (!newKbTitle.trim() || !newKbContent.trim()) return;
    const newDoc: BrandKnowledgeItem = {
      id: `kb-doc-${Date.now()}`,
      brandId: editingBrand?.id || "temp",
      title: newKbTitle.trim(),
      category: "GENERAL",
      content: newKbContent.trim(),
      tokenCount: Math.round(newKbContent.length / 4),
      isIndexed: true,
      createdAt: new Date().toISOString(),
    };
    setKnowledgeBase([newDoc, ...knowledgeBase]);
    setNewKbTitle("");
    setNewKbContent("");
  };

  const handleSave = () => {
    if (editingBrand) {
      updateBrandKit(editingBrand.id, {
        primaryColor,
        secondaryColor,
        accentColor,
        toneKeywords,
        toneDirectives,
        targetAudience,
      });
      setEditingBrand(null);
      setBrandSuccessMsg(`✓ Brand "${editingBrand.name}" updated successfully.`);
      setTimeout(() => setBrandSuccessMsg(null), 4000);
    } else if (isCreating) {
      createBrand({
        workspaceId: activeWorkspaceId || brands[0]?.workspaceId || "ws-growth-lab",
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        tagline,
        description,
        industry,
        website,
        isActive: true,
        brandKit: {
          id: `bk-${Date.now()}`,
          brandId: "temp",
          primaryColor,
          secondaryColor,
          accentColor,
          fontHeading: "Plus Jakarta Sans",
          fontBody: "Plus Jakarta Sans",
          toneKeywords,
          toneDirectives,
          targetAudience,
          doNotSay: [],
          mustInclude: [],
        },
        knowledgeBase,
        socialAccounts: [],
      });
      setIsCreating(false);
      setBrandSuccessMsg(`✓ Sub-company brand "${name}" saved directly to Supabase database!`);
      setTimeout(() => setBrandSuccessMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {brandSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{brandSuccessMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Palette className="h-6 w-6 text-[var(--brand-primary)]" />
            <span>Brand Kit & Knowledge Engine</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Define multi-brand design tokens, tone-of-voice directives, and knowledge base documentation.
          </p>
        </div>

        <Button
          variant="brand"
          size="sm"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 self-start sm:self-auto shadow-glow-brand"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Brand</span>
        </Button>
      </div>

      {/* Brand Grid Cards or Empty State */}
      {brands.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/20 p-12 text-center bg-white/60 dark:bg-slate-900/40 backdrop-blur-md">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Brands Configured Yet</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Your workspace is currently a clean slate. Create your first brand identity to define custom color tokens, tone directives, and knowledge base docs.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="brand" onClick={handleOpenCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Your First Brand</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {brands.map((brand) => {
          const isActive = brand.id === activeBrandId;
          const kit = brand.brandKit;

          return (
            <div
              key={brand.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 glass-card ${
                isActive
                  ? "border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/40 shadow-sm"
                  : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              <div>
                {/* Header: Name, Status & Active indicator */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: kit?.primaryColor || "#3b82f6" }}
                    >
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {brand.name}
                        {isActive && (
                          <Badge variant="brand" size="sm" className="font-semibold">
                            Active Theme
                          </Badge>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{brand.industry}</p>
                    </div>
                  </div>

                  <Badge variant="outline" size="sm" className="border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                    {organization.plan}
                  </Badge>
                </div>

                {/* Tagline / Description */}
                <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2">
                  &ldquo;{brand.tagline || brand.description}&rdquo;
                </p>

                {/* Color Palette Swatches */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Brand Palette</span>
                    <span className="font-mono">{kit?.primaryColor}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 w-5 rounded-md border border-slate-300 dark:border-white/20 shadow-sm"
                        style={{ backgroundColor: kit?.primaryColor }}
                        title="Primary Color"
                      />
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate font-medium">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 w-5 rounded-md border border-slate-300 dark:border-white/20 shadow-sm"
                        style={{ backgroundColor: kit?.secondaryColor }}
                        title="Secondary Color"
                      />
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate font-medium">Secondary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 w-5 rounded-md border border-slate-300 dark:border-white/20 shadow-sm"
                        style={{ backgroundColor: kit?.accentColor }}
                        title="Accent Color"
                      />
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate font-medium">Accent</span>
                    </div>
                  </div>
                </div>

                {/* Tone Keywords Chips */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Tone of Voice:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {kit?.toneKeywords?.map((keyword) => (
                      <span
                        key={keyword}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connected Accounts & KB items */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Share2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>{brand.socialAccounts?.length || 0} Connected Accounts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    <span>{brand.knowledgeBase?.length || 0} Knowledge Docs</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                <Button
                  variant={isActive ? "glass" : "brand"}
                  size="sm"
                  onClick={() => setActiveBrand(brand.id)}
                  className="flex-1 text-xs"
                >
                  {isActive ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                      <span>Active Accent</span>
                    </>
                  ) : (
                    <span>Set As Active Brand</span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(brand)}
                  className="text-xs"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Kit</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Create / Edit Brand Kit Side Drawer */}
      {(editingBrand || isCreating) && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => {
              setEditingBrand(null);
              setIsCreating(false);
            }}
          />

          <div className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 p-6 overflow-y-auto z-10 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isCreating ? "Scaffold New Brand" : `Edit ${editingBrand?.name} Kit`}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Updates cascade in real-time to CSS variables and AI agent prompt templates.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingBrand(null);
                  setIsCreating(false);
                }}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Core Identity
              </h4>
              <Input
                label="Brand Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lumina Creative Labs"
              />
              <Input
                label="Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Illuminating ideas through modern design"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Design & Media"
                />
                <Input
                  label="Website URL"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://luminacreative.studio"
                />
              </div>
            </div>

            {/* Color Palette (3 Hex Inputs with live pickers) */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                Color Palette & CSS Variable Injection
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-8 w-8 rounded-lg cursor-pointer border border-white/20 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full text-xs font-mono uppercase bg-slate-950 border border-white/10 rounded-lg p-1.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Secondary</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-8 w-8 rounded-lg cursor-pointer border border-white/20 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full text-xs font-mono uppercase bg-slate-950 border border-white/10 rounded-lg p-1.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-8 w-8 rounded-lg cursor-pointer border border-white/20 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full text-xs font-mono uppercase bg-slate-950 border border-white/10 rounded-lg p-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Bar */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Live Preview:</span>
                <div
                  className="h-4 flex-1 rounded-md"
                  style={{
                    background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Tone of Voice & Audience */}
            <div className="space-y-4 pt-3 border-t border-white/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                AI Voice & Audience Directives
              </h4>

              {/* Keywords chips */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Tone Keywords
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={handleAddKeyword}
                    placeholder="Type keyword and press Enter..."
                    className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddKeyword}>
                    Add
                  </Button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {toneKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="text-slate-400 hover:text-rose-400 ml-1"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Tone Directives (System Prompt Constraints)
                </label>
                <textarea
                  value={toneDirectives}
                  onChange={(e) => setToneDirectives(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                  placeholder="Directives given to LLMs when composing on behalf of this brand..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Target Audience
                </label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                  placeholder="Primary persona, buying criteria, tone resonance..."
                />
              </div>
            </div>

            {/* Brand Knowledge Base Entries */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Brand Knowledge Base Entries ({knowledgeBase.length})
              </h4>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <Input
                  label="Document Title"
                  placeholder="e.g. Q4 Product Catalog & Pricing"
                  value={newKbTitle}
                  onChange={(e) => setNewKbTitle(e.target.value)}
                />
                <textarea
                  rows={2}
                  placeholder="Paste knowledge text or guidelines to index into agent vector context..."
                  value={newKbContent}
                  onChange={(e) => setNewKbContent(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:border-[var(--brand-primary)]"
                />
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleAddKbDoc}>
                    Index Knowledge Snippet
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {knowledgeBase.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-semibold text-white truncate">{doc.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({doc.tokenCount} tokens)
                      </span>
                    </div>
                    <Badge variant="success" size="sm">Indexed</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900 pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingBrand(null);
                  setIsCreating(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="brand" size="sm" onClick={handleSave} className="shadow-glow-brand">
                Save Brand Kit & Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

