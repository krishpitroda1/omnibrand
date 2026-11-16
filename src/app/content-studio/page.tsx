"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAppStore } from "@/store";
import { MediaAssetItem, ContentTemplateItem, Platform, ContentStatus, AspectRatio } from "@/types";
import {
  MOCK_MEDIA_ASSETS,
  MOCK_CONTENT_TEMPLATES,
  MOCK_CONTENT_FOLDERS,
} from "@/lib/mock-data/content-studio";
import { MediaFolderTree } from "@/features/content-studio/components/MediaFolderTree";
import { AssetGalleryView } from "@/features/content-studio/components/AssetGalleryView";
import { AssetTableView } from "@/features/content-studio/components/AssetTableView";
import { AssetCalendarView } from "@/features/content-studio/components/AssetCalendarView";
import { AssetDetailDrawer } from "@/features/content-studio/components/AssetDetailDrawer";
import { UploadModal } from "@/features/content-studio/components/UploadModal";
import { TemplateGallery } from "@/features/content-studio/components/TemplateGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  Table as TableIcon,
  Calendar as CalendarIcon,
  Sparkles,
  UploadCloud,
  FileImage,
  FolderTree,
  Filter,
  Plus,
  Layers,
  Search,
  CheckCircle2,
  Copy,
} from "lucide-react";

type ContentStudioView = "GALLERY" | "TABLE" | "CALENDAR" | "TEMPLATES";

export default function ContentStudioPage() {
  const {
    brands,
    activeBrandId,
    setCreateModalOpen,
    setMasterPrompt,
    mediaAssets,
    campaigns,
    publishJobs,
    addMediaAsset,
    setMediaAssets,
    addCampaign,
  } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  // Fetch campaigns from Supabase database on mount to ensure full DB sync
  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data?.campaigns && Array.isArray(data.campaigns)) {
          data.campaigns.forEach((campRow: any) => {
            const exists = campaigns.some((c) => c.id === campRow.id || c.name === campRow.name);
            if (!exists) {
              addCampaign({
                id: campRow.id,
                workspaceId: campRow.workspace_id,
                brandId: campRow.brand_id,
                brandName: activeBrand?.name || "Active Brand",
                brandColor: activeBrand?.brandKit?.primaryColor || "#3B82F6",
                name: campRow.name,
                description: `Campaign flight: ${campRow.name}`,
                objective: campRow.objective || "AWARENESS",
                budget: Number(campRow.budget) || 5000,
                spendToDate: Number(campRow.spend) || 0,
                ownerUserId: "usr-elena-01",
                ownerName: "Elena Rostova",
                leadsCount: 0,
                targetAudience: "Global enterprise customers",
                ctaLinks: [
                  {
                    type: "LANDING_PAGE",
                    displayText: "View Campaign",
                    targetUrl: "https://",
                  },
                ],
                channelBudgets: (campRow.channels || ["INSTAGRAM"]).map((ch: string) => ({
                  platform: ch as Platform,
                  allocatedBudget: 2500,
                  spent: 0,
                  status: "SCHEDULED",
                  consentGated: false,
                  deliveryRate: 100,
                })),
                status: campRow.status || "SCHEDULED",
                startDate: campRow.start_date || new Date().toISOString(),
                endDate: campRow.end_date || new Date().toISOString(),
                channels: (campRow.channels || ["INSTAGRAM"]).map((ch: string) => ({
                  platform: ch as Platform,
                  aspectRatio: "SQUARE_1_1" as AspectRatio,
                  scheduledAt: campRow.start_date || new Date().toISOString(),
                  status: "SCHEDULED" as const,
                })),
                caption: campRow.name,
                hashtags: ["#OmniBrand", "#CreativeFlight"],
                mediaUrl:
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
                aiModelUsed: "FLUX_1_PRO",
                utmUrl: `https://${activeBrand?.slug || "brand"}.com?utm_source=omnibrand`,
                publishJobs: [],
              });
            }
          });
        }
      })
      .catch((err) => console.warn("Could not fetch DB campaigns on ContentStudio load:", err));
  }, []);

  // Merge stored mediaAssets and any campaigns with media
  const combinedAssets = useMemo(() => {
    const list = [...mediaAssets];

    // Also include campaigns as visual assets if not already represented
    campaigns.forEach((c) => {
      const alreadyHasAsset = list.some((a) => a.id === `ast-${c.id}` || a.url === c.mediaUrl);
      if (!alreadyHasAsset && c.mediaUrl) {
        list.push({
          id: `ast-${c.id}`,
          workspaceId: c.workspaceId,
          brandId: c.brandId,
          brandName: c.brandName,
          url: c.mediaUrl,
          thumbnailUrl: c.mediaUrl,
          aspectRatio: (c.channels?.[0]?.aspectRatio as AspectRatio) || "SQUARE_1_1",
          width: 1080,
          height: 1080,
          dimensions: "1080×1080",
          format: "PNG",
          mimeType: "image/png",
          fileSize: 2048000,
          folderId: "fld-lumina-month-nov",
          tags: c.hashtags || ["#OmniBrand", "#Campaign"],
          promptUsed: c.caption || c.name,
          modelUsed: (c.aiModelUsed as any) || "FLUX_1_PRO",
          isFavorite: false,
          usageCount: 1,
          campaignsUsed: [c.id],
          status: "APPROVED",
          createdAt: c.startDate || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return list;
  }, [mediaAssets, campaigns]);

  // State
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  useEffect(() => {
    setAssets(combinedAssets);
  }, [combinedAssets]);
  const [templates, setTemplates] = useState<ContentTemplateItem[]>([]);
  const [activeView, setActiveView] = useState<ContentStudioView>("GALLERY");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Drawers & Modals
  const [previewAsset, setPreviewAsset] = useState<MediaAssetItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showFolderSidebar, setShowFolderSidebar] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => a.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [assets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Folder filter
      if (selectedFolderId && asset.folderId !== selectedFolderId) return false;

      // Status filter
      if (statusFilter !== "ALL" && asset.status !== statusFilter) return false;

      // Type filter
      if (typeFilter === "VIDEO" && !asset.mimeType.includes("video") && asset.format !== "MP4") return false;
      if (typeFilter === "IMAGE" && (asset.mimeType.includes("video") || asset.format === "MP4")) return false;

      // Tag filter
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some((t) => asset.tags.includes(t));
        if (!hasTag) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = asset.id.toLowerCase().includes(q);
        const matchPrompt = asset.promptUsed?.toLowerCase().includes(q) || false;
        const matchFormat = asset.format.toLowerCase().includes(q);
        const matchTag = asset.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchId && !matchPrompt && !matchFormat && !matchTag) return false;
      }

      return true;
    });
  }, [assets, selectedFolderId, statusFilter, typeFilter, selectedTags, searchQuery]);

  // Handlers
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDuplicateAsset = (asset: MediaAssetItem) => {
    const copy: MediaAssetItem = {
      ...asset,
      id: `ast-${Date.now().toString().slice(-4)}`,
      promptUsed: `${asset.promptUsed || "Asset"} (Duplicate Variant)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      campaignsUsed: [],
    };
    addMediaAsset(copy);
    setAssets([copy, ...assets]);
    setActionSuccessMsg(`Duplicated asset '${asset.id}' as new variant '${copy.id}'.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleDeleteAsset = (assetId: string) => {
    const updated = assets.filter((a) => a.id !== assetId);
    setAssets(updated);
    setMediaAssets(updated);
    setSelectedAssetIds((prev) => prev.filter((id) => id !== assetId));
    if (previewAsset?.id === assetId) setPreviewAsset(null);
    setActionSuccessMsg(`Asset '${assetId}' permanently deleted.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleBulkDelete = () => {
    if (confirm(`Permanently delete ${selectedAssetIds.length} selected assets?`)) {
      setAssets(assets.filter((a) => !selectedAssetIds.includes(a.id)));
      setSelectedAssetIds([]);
      setActionSuccessMsg(`Deleted ${selectedAssetIds.length} assets.`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  const handleToggleSelect = (assetId: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    setSelectedAssetIds(filteredAssets.map((a) => a.id));
  };

  const handleClearSelection = () => {
    setSelectedAssetIds([]);
  };

  const handleUseTemplate = (tmpl: ContentTemplateItem) => {
    if (tmpl.promptTemplate) {
      setMasterPrompt(tmpl.promptTemplate);
    }
    setCreateModalOpen(true);
  };

  const handleAddToCampaign = (asset: MediaAssetItem) => {
    setActionSuccessMsg(`Queued '${asset.id}' for active campaign flight.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <FileImage className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>Content Studio & Media Library</span>
            </h1>
            <Badge variant="brand" size="sm">
              {activeBrand?.name}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Centralized digital asset management, brand template gallery, multi-platform resolution derivatives, and version history.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {assets.length === 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setAssets(MOCK_MEDIA_ASSETS);
                setTemplates(MOCK_CONTENT_TEMPLATES);
                setActionSuccessMsg("Sample omnichannel media assets loaded.");
                setTimeout(() => setActionSuccessMsg(null), 3000);
              }}
              className="text-xs h-9 border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100 font-medium"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>Load Sample Assets</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAssets([]);
                setTemplates([]);
                setActionSuccessMsg("Media library cleared to blank state.");
                setTimeout(() => setActionSuccessMsg(null), 3000);
              }}
              className="text-xs h-9 text-slate-500 hover:text-slate-800"
            >
              <span>Clear Assets</span>
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFolderSidebar(!showFolderSidebar)}
            className="border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs text-slate-700 dark:text-slate-300"
          >
            <FolderTree className="h-3.5 w-3.5 mr-1 text-cyan-600 dark:text-cyan-400" />
            <span>{showFolderSidebar ? "Hide Folders" : "Show Folders"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsUploadModalOpen(true)}
            className="border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs text-slate-700 dark:text-slate-300"
          >
            <UploadCloud className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
            <span>Upload Media</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="bg-[var(--brand-primary)] hover:brightness-110 text-white text-xs font-semibold shadow-md shadow-[var(--brand-primary)]/20"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>Generate with AI</span>
          </Button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* View Switcher & Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-xl p-3.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveView("GALLERY")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === "GALLERY"
                ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("TABLE")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === "TABLE"
                ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("CALENDAR")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === "CALENDAR"
                ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("TEMPLATES")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === "TEMPLATES"
                ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Brand Templates</span>
            <span className="text-[10px] font-mono opacity-80">({templates.length})</span>
          </button>
        </div>

        {/* Right: Quick Filters (Content Type & Status) */}
        {activeView !== "TEMPLATES" && (
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Filter media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-950/70 border-white/10 rounded-xl text-white placeholder:text-slate-500"
              />
            </div>

            {/* Type Filter */}
            <select
              aria-label="Filter by Content Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 bg-slate-950/80 border border-white/10 rounded-xl px-2.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="IMAGE">Images (1:1, 4:5, 16:9)</option>
              <option value="VIDEO">Videos (9:16, MP4)</option>
            </select>

            {/* Status Filter */}
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 bg-slate-950/80 border border-white/10 rounded-xl px-2.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeView === "TEMPLATES" ? (
        <TemplateGallery
          templates={templates}
          onUseTemplate={handleUseTemplate}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Collapsible Left Folder Tree (3 cols) */}
          {showFolderSidebar && (
            <div className="lg:col-span-3 space-y-4">
              <MediaFolderTree
                folders={MOCK_CONTENT_FOLDERS}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                allTags={allTags}
                selectedTags={selectedTags}
                onToggleTag={handleToggleTag}
                onClearTags={() => setSelectedTags([])}
                totalAssetCount={assets.length}
              />
            </div>
          )}

          {/* Right Main Content (9 or 12 cols) */}
          <div className={showFolderSidebar ? "lg:col-span-9" : "lg:col-span-12"}>
            {activeView === "GALLERY" && (
              <AssetGalleryView
                assets={filteredAssets}
                onPreviewAsset={(ast) => setPreviewAsset(ast)}
                onDuplicateAsset={handleDuplicateAsset}
                onAddToCampaign={handleAddToCampaign}
                onDeleteAsset={handleDeleteAsset}
                selectedAssetIds={selectedAssetIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
                onBulkDelete={handleBulkDelete}
              />
            )}

            {activeView === "TABLE" && (
              <AssetTableView
                assets={filteredAssets}
                onPreviewAsset={(ast) => setPreviewAsset(ast)}
                onDuplicateAsset={handleDuplicateAsset}
                onAddToCampaign={handleAddToCampaign}
                onDeleteAsset={handleDeleteAsset}
                selectedAssetIds={selectedAssetIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
              />
            )}

            {activeView === "CALENDAR" && (
              <AssetCalendarView
                assets={filteredAssets}
                campaigns={campaigns}
                publishJobs={publishJobs}
                onPreviewAsset={(ast) => setPreviewAsset(ast)}
              />
            )}
          </div>
        </div>
      )}

      {/* Asset Detail Drawer */}
      <AssetDetailDrawer
        asset={previewAsset}
        onClose={() => setPreviewAsset(null)}
        onAddToCampaign={handleAddToCampaign}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={(newAsset) => {
          addMediaAsset(newAsset);
          setAssets([newAsset, ...assets]);
          setActionSuccessMsg(`Uploaded new asset '${newAsset.id}' with multi-platform resolutions.`);
          setTimeout(() => setActionSuccessMsg(null), 3000);
        }}
        brandName={activeBrand?.name}
      />
    </div>
  );
}
