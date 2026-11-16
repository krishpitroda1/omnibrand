"use client";

import React, { useState, useMemo } from "react";
import { MediaAssetItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Copy,
  PlusCircle,
  Trash2,
  CheckSquare,
  Square,
  ArrowUpDown,
  Download,
  Filter,
} from "lucide-react";

interface AssetTableViewProps {
  assets: MediaAssetItem[];
  onPreviewAsset: (asset: MediaAssetItem) => void;
  onDuplicateAsset: (asset: MediaAssetItem) => void;
  onAddToCampaign: (asset: MediaAssetItem) => void;
  onDeleteAsset: (assetId: string) => void;
  selectedAssetIds: string[];
  onToggleSelect: (assetId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function AssetTableView({
  assets,
  onPreviewAsset,
  onDuplicateAsset,
  onAddToCampaign,
  onDeleteAsset,
  selectedAssetIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
}: AssetTableViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"createdAt" | "fileSize" | "usageCount">("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return assets.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        (item.promptUsed?.toLowerCase().includes(q) ?? false) ||
        (item.format.toLowerCase().includes(q)) ||
        (item.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [assets, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: number | string = a[sortField] || 0;
      let valB: number | string = b[sortField] || 0;
      if (sortField === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const toggleSort = (field: "createdAt" | "fileSize" | "usageCount") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Table Tools */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-3.5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by ID, prompt, format, tag..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-slate-950/60 border-white/10 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Sort by:</span>
          <button
            type="button"
            onClick={() => toggleSort("createdAt")}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              sortField === "createdAt"
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/20 text-white font-semibold"
                : "border-white/10 text-slate-400"
            }`}
          >
            Date {sortField === "createdAt" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            type="button"
            onClick={() => toggleSort("fileSize")}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              sortField === "fileSize"
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/20 text-white font-semibold"
                : "border-white/10 text-slate-400"
            }`}
          >
            Size {sortField === "fileSize" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            type="button"
            onClick={() => toggleSort("usageCount")}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              sortField === "usageCount"
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/20 text-white font-semibold"
                : "border-white/10 text-slate-400"
            }`}
          >
            Usage {sortField === "usageCount" && (sortAsc ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 w-10">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedAssetIds.length === assets.length) {
                        onClearSelection();
                      } else {
                        onSelectAll();
                      }
                    }}
                    className="p-1 hover:text-white"
                  >
                    {selectedAssetIds.length > 0 && selectedAssetIds.length === assets.length ? (
                      <CheckSquare className="h-4 w-4 text-[var(--brand-primary)]" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Asset Preview</th>
                <th className="py-3 px-4">Details & Generation Prompt</th>
                <th className="py-3 px-4">Aspect & Format</th>
                <th className="py-3 px-4">Dimensions</th>
                <th className="py-3 px-4 text-right">Size</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No assets found.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const isSelected = selectedAssetIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isSelected ? "bg-[var(--brand-primary)]/10" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onToggleSelect(item.id)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[var(--brand-primary)]" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <div
                          onClick={() => onPreviewAsset(item)}
                          className="h-12 w-12 rounded-xl overflow-hidden bg-slate-950 border border-white/10 cursor-pointer hover:border-[var(--brand-primary)] transition-colors shrink-0"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt="thumb"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-white truncate">{item.id}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.promptUsed || "Studio Master Creative Asset"}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {item.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] text-slate-500 font-mono bg-slate-950 px-1.5 py-0.2 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-white/10 bg-slate-950/60 text-slate-300"
                        >
                          {item.aspectRatio.replace("_", " ")}
                        </Badge>
                        <span className="block text-[10px] text-slate-500 mt-0.5 font-mono">
                          {item.format}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-300">
                        {item.dimensions || "1080×1080"}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Badge
                          className={`text-[10px] ${
                            item.status === "PUBLISHED"
                              ? "bg-emerald-950/70 border-emerald-500/30 text-emerald-300"
                              : item.status === "APPROVED"
                              ? "bg-cyan-950/70 border-cyan-500/30 text-cyan-300"
                              : "bg-amber-950/70 border-amber-500/30 text-amber-300"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onPreviewAsset(item)}
                            title="Inspect Details"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDuplicateAsset(item)}
                            title="Duplicate"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAddToCampaign(item)}
                            title="Add to Campaign"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-[var(--brand-primary)]"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Delete asset ${item.id}?`)) {
                                onDeleteAsset(item.id);
                              }
                            }}
                            title="Delete"
                            className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} assets
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="border-white/10 text-xs h-8"
            >
              Previous
            </Button>
            <span className="text-white font-mono px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="border-white/10 text-xs h-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
