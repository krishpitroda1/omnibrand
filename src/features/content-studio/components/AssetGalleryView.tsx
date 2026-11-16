"use client";

import React, { useState } from "react";
import { MediaAssetItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Copy,
  PlusCircle,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
  Download,
  Tag,
  AlertTriangle,
  Play,
} from "lucide-react";

interface AssetGalleryViewProps {
  assets: MediaAssetItem[];
  onPreviewAsset: (asset: MediaAssetItem) => void;
  onDuplicateAsset: (asset: MediaAssetItem) => void;
  onAddToCampaign: (asset: MediaAssetItem) => void;
  onDeleteAsset: (assetId: string) => void;
  selectedAssetIds: string[];
  onToggleSelect: (assetId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export function AssetGalleryView({
  assets,
  onPreviewAsset,
  onDuplicateAsset,
  onAddToCampaign,
  onDeleteAsset,
  selectedAssetIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
}: AssetGalleryViewProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const allSelected = assets.length > 0 && selectedAssetIds.length === assets.length;

  return (
    <div className="space-y-4">
      {/* Bulk Selection Bar */}
      {selectedAssetIds.length > 0 && (
        <div className="rounded-xl border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/15 backdrop-blur-xl p-3 px-4 flex items-center justify-between text-xs text-white animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">
              {selectedAssetIds.length} assets selected
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={onSelectAll}
              className="text-slate-300 hover:text-white text-xs h-7"
            >
              Select All ({assets.length})
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-slate-400 hover:text-white text-xs h-7"
            >
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                alert(`Added ${selectedAssetIds.length} assets to active campaign flight.`);
                onClearSelection();
              }}
              className="border-white/20 text-xs h-7 bg-slate-900/60"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1 text-[var(--brand-primary)]" />
              Add to Campaign
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onBulkDelete}
              className="border-red-500/30 text-red-300 hover:bg-red-950/40 text-xs h-7"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1 text-red-400" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Masonry Grid */}
      {assets.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-400">
          No media assets found matching the selected filters.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {assets.map((asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);
            const isVideo = asset.mimeType.includes("video") || asset.format === "MP4";

            return (
              <div
                key={asset.id}
                className={`break-inside-avoid rounded-2xl border overflow-hidden bg-slate-900/60 backdrop-blur-xl group relative shadow-md transition-all hover:shadow-2xl hover:border-white/30 ${
                  isSelected
                    ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/40 shadow-lg"
                    : "border-white/10"
                }`}
              >
                {/* Media Image / Video */}
                <div className="relative overflow-hidden bg-slate-950">
                  {isVideo ? (
                    <div className="relative aspect-[9/16] max-h-80 w-full overflow-hidden flex items-center justify-center bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <Play className="h-5 w-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.url}
                      alt={asset.promptUsed || "Asset"}
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect(asset.id);
                      }}
                      className={`h-6 w-6 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors ${
                        isSelected
                          ? "bg-[var(--brand-primary)] text-white"
                          : "bg-black/50 text-white/80 hover:bg-black/70"
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-3.5 w-3.5" />
                      ) : (
                        <Square className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <Badge className="bg-black/60 backdrop-blur-md text-[10px] text-white border-white/10 font-mono">
                      {asset.aspectRatio.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="absolute top-2.5 right-2.5 z-10">
                    <Badge
                      className={`text-[10px] backdrop-blur-md border ${
                        asset.status === "PUBLISHED"
                          ? "bg-emerald-950/70 border-emerald-500/30 text-emerald-300"
                          : asset.status === "APPROVED"
                          ? "bg-cyan-950/70 border-cyan-500/30 text-cyan-300"
                          : "bg-amber-950/70 border-amber-500/30 text-amber-300"
                      }`}
                    >
                      {asset.status}
                    </Badge>
                  </div>

                  {/* Hover Overlay with Quick Actions */}
                  <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm flex flex-col justify-between p-3.5 z-20">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded">
                        {(asset.fileSize / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                        {asset.promptUsed || "Studio editorial master asset"}
                      </p>

                      {/* Action buttons */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPreviewAsset(asset)}
                          title="Preview & Details"
                          className="h-8 border-white/15 bg-slate-900/80 hover:bg-[var(--brand-primary)] text-white text-[11px] p-0"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDuplicateAsset(asset)}
                          title="Duplicate Variant"
                          className="h-8 border-white/15 bg-slate-900/80 hover:bg-[var(--brand-primary)] text-white text-[11px] p-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAddToCampaign(asset)}
                          title="Add to Campaign"
                          className="h-8 border-white/15 bg-slate-900/80 hover:bg-[var(--brand-primary)] text-white text-[11px] p-0"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirmId(asset.id)}
                          title="Delete Asset"
                          className="h-8 border-red-500/30 bg-slate-900/80 hover:bg-red-600 text-red-300 hover:text-white text-[11px] p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="p-3 bg-slate-950/40 space-y-1.5 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 truncate">
                      {asset.dimensions || "1080×1080"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {asset.format}
                    </span>
                  </div>

                  {asset.tags && asset.tags.length > 0 && (
                    <div className="flex items-center gap-1 overflow-hidden">
                      {asset.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] text-slate-400 truncate bg-slate-900 px-1.5 py-0.5 rounded border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete Confirmation Modal for single item */}
                {deleteConfirmId === asset.id && (
                  <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in">
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                    <div className="text-xs font-semibold text-white">
                      Permanently delete this asset?
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Cannot be undone if used in scheduled flights.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-xs text-slate-400 h-7"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          onDeleteAsset(asset.id);
                          setDeleteConfirmId(null);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs h-7"
                      >
                        Confirm Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
