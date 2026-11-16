"use client";

import React, { useState } from "react";
import { ContentFolderItem } from "@/types";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Tag,
  Hash,
  Layers,
  Sparkles,
} from "lucide-react";

interface MediaFolderTreeProps {
  folders: ContentFolderItem[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  totalAssetCount: number;
}

export function MediaFolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  allTags,
  selectedTags,
  onToggleTag,
  onClearTags,
  totalAssetCount,
}: MediaFolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "fld-lumina-root": true,
    "fld-lumina-campaign-fall": true,
    "fld-apex-root": true,
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Folder Navigation */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-[var(--brand-primary)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Media Folders
            </h4>
          </div>
          <button
            type="button"
            onClick={() => onSelectFolder(null)}
            className={`text-[11px] px-2 py-0.5 rounded-lg transition-colors ${
              selectedFolderId === null
                ? "bg-[var(--brand-primary)] text-white font-medium"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({totalAssetCount})
          </button>
        </div>

        {/* Tree items */}
        <div className="space-y-1 text-xs">
          {folders.map((fld) => {
            const isSelected = selectedFolderId === fld.id;
            const isExpanded = !!expandedFolders[fld.id];
            const isSubfolder = fld.path.includes("/");

            return (
              <div
                key={fld.id}
                className={`flex items-center justify-between py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                  isSubfolder ? "ml-4" : ""
                } ${
                  isSelected
                    ? "bg-[var(--brand-primary)]/20 text-white border border-[var(--brand-primary)]/40 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => onSelectFolder(fld.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(fld.id);
                    }}
                    className="p-0.5 text-slate-500 hover:text-white"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                  {isExpanded ? (
                    <FolderOpen className="h-4 w-4 text-amber-400 shrink-0" />
                  ) : (
                    <Folder className="h-4 w-4 text-amber-400/80 shrink-0" />
                  )}
                  <span className="truncate">{fld.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-950/60">
                  {fld.itemCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tag Chips */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Taxonomy & Tags
            </h4>
          </div>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={onClearTags}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              Reset ({selectedTags.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isTagSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                  isTagSelected
                    ? "bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-sm"
                    : "bg-slate-950/40 text-slate-400 border-white/5 hover:text-white hover:border-white/15"
                }`}
              >
                <Hash className="h-3 w-3 opacity-60" />
                <span>{tag.replace("#", "")}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
