"use client";

import React, { useState } from "react";
import { MediaAssetItem, VersionHistoryItem, AssetUsageItem } from "@/types";
import {
  MOCK_VERSION_HISTORIES,
  MOCK_ASSET_USAGES,
} from "@/lib/mock-data/content-studio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Clock,
  History,
  FileImage,
  Tag,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Share2,
  Maximize2,
  Crop,
  AlertCircle,
} from "lucide-react";

interface AssetDetailDrawerProps {
  asset: MediaAssetItem | null;
  onClose: () => void;
  onAddToCampaign?: (asset: MediaAssetItem) => void;
}

export function AssetDetailDrawer({
  asset,
  onClose,
  onAddToCampaign,
}: AssetDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "VERSIONS" | "USAGE" | "PERFORMANCE">("OVERVIEW");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!asset) return null;

  const versions: VersionHistoryItem[] = MOCK_VERSION_HISTORIES[asset.id] || [
    {
      id: "vh-default-1",
      workspaceId: asset.workspaceId,
      assetId: asset.id,
      versionNumber: 1,
      changeSummary: "Original master asset generated via AI model or direct studio upload.",
      modifiedByName: "Elena Rostova",
      createdAt: asset.createdAt,
      previewUrl: asset.url,
      dimensions: asset.dimensions,
    },
  ];

  const usages: AssetUsageItem[] = MOCK_ASSET_USAGES[asset.id] || [
    {
      id: "usg-default",
      workspaceId: asset.workspaceId,
      assetId: asset.id,
      campaignId: "cmp-01-architectural-radiance",
      campaignName: "Architectural Radiance Fall Collection",
      channel: "INSTAGRAM",
      usedAt: asset.createdAt,
    },
  ];

  const handleDownload = (formatVariant: string) => {
    setDownloadSuccess(`Downloaded ${asset.id}_${formatVariant}.${asset.format.toLowerCase()}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const isVideo = asset.mimeType.includes("video") || asset.format === "MP4";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 text-blue-700 dark:text-[var(--brand-primary)]">
              <FileImage className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Asset Detail & Governance
                </h3>
                <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono">
                  {asset.id}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {asset.brandName || "Lumina Creative"} • {asset.dimensions || "1080×1080"} • {(asset.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Main Visual Display */}
          <div className="relative rounded-2xl border border-white/10 bg-slate-950 overflow-hidden group shadow-lg">
            {isVideo ? (
              <video
                src={asset.url}
                controls
                className="w-full max-h-72 object-contain mx-auto"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset.url}
                alt={asset.promptUsed || "Asset Preview"}
                className="w-full max-h-80 object-contain mx-auto"
              />
            )}

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 text-xs">
                {asset.aspectRatio.replace("_", " ")}
              </Badge>
              <Badge className="bg-black/70 backdrop-blur-md text-cyan-300 border-white/20 text-xs">
                {asset.format}
              </Badge>
            </div>

            <div className="absolute top-3 right-3">
              <Badge
                variant="outline"
                className={`text-xs backdrop-blur-md ${
                  asset.status === "PUBLISHED"
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/60"
                    : asset.status === "APPROVED"
                    ? "border-cyan-500/30 text-cyan-400 bg-cyan-950/60"
                    : "border-amber-500/30 text-amber-300 bg-amber-950/60"
                }`}
              >
                {asset.status}
              </Badge>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            {(
              [
                { id: "OVERVIEW", label: "Overview & Rights", icon: Layers },
                { id: "VERSIONS", label: `Versions (${versions.length})`, icon: History },
                { id: "USAGE", label: `Campaign Usage (${usages.length})`, icon: Share2 },
                { id: "PERFORMANCE", label: "ROI Snapshot", icon: TrendingUp },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-[var(--brand-primary)] text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & RIGHTS */}
          {activeTab === "OVERVIEW" && (
            <div className="space-y-4">
              {/* Rights and Expiry Alert */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-white">Commercial Rights & Licensing Verified</div>
                  <div className="text-slate-400">
                    Worldwide digital marketing rights cleared for editorial, social ads, and print lookbooks.
                  </div>
                  <div className="text-[11px] text-emerald-300/90 font-mono mt-1">
                    Rights Expiry: {asset.rightsExpiry ? new Date(asset.rightsExpiry).toLocaleDateString() : "Perpetual"}
                  </div>
                </div>
              </div>

              {/* Prompt and Synthesis Meta */}
              {asset.promptUsed && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                    <span>Generation Prompt</span>
                  </label>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 leading-relaxed font-mono">
                    {asset.promptUsed}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Model: <strong className="text-white">{asset.modelUsed || "FLUX.1 PRO"}</strong></span>
                    {asset.seed && <span>Seed: <strong className="text-white font-mono">{asset.seed}</strong></span>}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Tags</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs border-white/10 bg-white/5 text-slate-300">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs">
                  <span className="text-slate-500 block mb-0.5">Dimensions</span>
                  <span className="text-white font-semibold font-mono">{asset.dimensions || "1080×1080"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs">
                  <span className="text-slate-500 block mb-0.5">File Size</span>
                  <span className="text-white font-semibold font-mono">{(asset.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs">
                  <span className="text-slate-500 block mb-0.5">Created At</span>
                  <span className="text-white font-semibold">{new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs">
                  <span className="text-slate-500 block mb-0.5">MIME Type</span>
                  <span className="text-white font-semibold font-mono">{asset.mimeType}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERSIONS */}
          {activeTab === "VERSIONS" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Tamper-evident edit history tracking chromatic grading, crops, and editorial retouching.
              </div>
              <div className="space-y-3">
                {versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3.5 rounded-xl border border-white/10 bg-slate-950/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[var(--brand-primary)]/20 text-white border-[var(--brand-primary)]/40 text-[10px]">
                          v{ver.versionNumber}.0
                        </Badge>
                        <span className="text-xs font-semibold text-white">
                          Edited by {ver.modifiedByName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(ver.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ver.changeSummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: USAGE HISTORY */}
          {activeTab === "USAGE" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Tracked placements across active campaigns, scheduled queues, and published feeds.
              </div>
              <div className="space-y-2">
                {usages.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl border border-white/10 bg-slate-950/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{u.campaignName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Platform: <strong className="text-slate-200">{u.channel}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
                        ACTIVE FLIGHT
                      </Badge>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {new Date(u.usedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERFORMANCE SNAPSHOT */}
          {activeTab === "PERFORMANCE" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-center">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Impressions</div>
                  <div className="text-base font-bold text-white mt-0.5">48,290</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-center">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Engagements</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">3,410</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-center">
                  <div className="text-[10px] uppercase font-mono text-slate-400">CTR</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">7.1%</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>AI Creative Insights</span>
                </div>
                <p className="leading-relaxed">
                  This creative variant achieved a 38% higher retention rate than the campaign benchmark, predominantly driven by Instagram Carousel saves and LinkedIn executive reposts.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Export & Multi-Platform Variants
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload("original")}
              className="border-white/10 hover:bg-white/5 text-xs text-slate-200"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Original
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload("1x1_square")}
              className="border-white/10 hover:bg-white/5 text-xs text-slate-200"
            >
              <Crop className="h-3.5 w-3.5 mr-1" />
              1:1 Square
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload("4x5_portrait")}
              className="border-white/10 hover:bg-white/5 text-xs text-slate-200"
            >
              <Crop className="h-3.5 w-3.5 mr-1" />
              4:5 Portrait
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload("16x9_landscape")}
              className="border-white/10 hover:bg-white/5 text-xs text-slate-200"
            >
              <Crop className="h-3.5 w-3.5 mr-1" />
              16:9 Landscape
            </Button>
          </div>

          {onAddToCampaign && (
            <Button
              onClick={() => onAddToCampaign(asset)}
              className="w-full bg-[var(--brand-primary)] hover:brightness-110 text-white text-xs font-semibold py-2 rounded-xl shadow-lg shadow-[var(--brand-primary)]/20"
            >
              Add Asset to Campaign Queue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
