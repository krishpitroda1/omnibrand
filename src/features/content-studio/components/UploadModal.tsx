"use client";

import React, { useState } from "react";
import { MediaAssetItem, AspectRatio, Platform } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UploadCloud,
  X,
  FileCheck2,
  AlertTriangle,
  Crop,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (asset: MediaAssetItem) => void;
  brandName?: string;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  brandName = "Lumina Creative",
}: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [autoResizeAllPlatforms, setAutoResizeAllPlatforms] = useState(true);
  const [tagsInput, setTagsInput] = useState("#editorial, #studio, #autumn");

  if (!isOpen) return null;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "video/mp4"];

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    if (!allowedFormats.includes(file.type)) {
      setErrorMsg("Invalid file format. Please upload PNG, JPG, WEBP, or MP4.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg("File exceeds 50MB size limit.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleStartUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const isVideo = selectedFile.type.includes("video");
            const newAsset: MediaAssetItem = {
              id: `ast-${Date.now().toString().slice(-4)}`,
              workspaceId: "ws-growth-lab",
              brandId: "brand-lumina",
              brandName,
              url: URL.createObjectURL(selectedFile),
              thumbnailUrl: URL.createObjectURL(selectedFile),
              aspectRatio: "SQUARE_1_1",
              width: 1080,
              height: 1080,
              dimensions: "1080×1080",
              format: selectedFile.name.split(".").pop()?.toUpperCase() || "PNG",
              mimeType: selectedFile.type,
              fileSize: selectedFile.size,
              folderId: "fld-lumina-month-nov",
              tags: tagsInput.split(",").map((t) => t.trim()),
              rightsExpiry: "2028-11-01T00:00:00Z",
              promptUsed: "Studio master asset uploaded with multi-platform aspect ratio derivations.",
              isFavorite: false,
              usageCount: 0,
              status: "APPROVED",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            onUploadSuccess(newAsset);
            onClose();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 text-blue-700 dark:text-[var(--brand-primary)]">
              <UploadCloud className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Upload Media & Asset Derivatives
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Target brand: <strong className="text-slate-900 dark:text-white">{brandName}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10"
              : selectedFile
              ? "border-emerald-500/50 bg-emerald-950/20"
              : "border-white/15 bg-slate-950/40 hover:border-white/30"
          }`}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <FileCheck2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <div className="text-sm font-semibold text-white">{selectedFile.name}</div>
              <div className="text-xs text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedFile(null)}
                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30"
              >
                Choose different file
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <UploadCloud className="h-10 w-10 text-slate-400 mx-auto" />
              <div>
                <span className="text-sm font-semibold text-white block">
                  Drag & drop high-resolution asset here
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Supports PNG, JPG, WEBP, and MP4 (Up to 50MB)
                </span>
              </div>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,video/mp4"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white cursor-pointer border border-white/10 transition-colors">
                  Browse Files
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Generating multi-platform resolution derivatives...</span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-cyan-400 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Toggle: Resize for all platforms */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Crop className="h-4 w-4 text-[var(--brand-primary)]" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Auto-Resize for All Social Platforms
                </span>
                <span className="text-[11px] text-slate-400">
                  Calculates smart center crops for 1:1, 4:5, 16:9, and 9:16
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoResizeAllPlatforms}
              onChange={(e) => setAutoResizeAllPlatforms(e.target.checked)}
              className="rounded accent-[var(--brand-primary)] h-4 w-4"
            />
          </label>
        </div>

        {/* Tags input */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Taxonomy Tags (comma-separated)</label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="bg-slate-950 border-white/10 text-xs text-white"
            placeholder="#editorial, #architecture, #fall2026"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedFile || isUploading}
            onClick={handleStartUpload}
            className="bg-[var(--brand-primary)] hover:brightness-110 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-lg shadow-[var(--brand-primary)]/20"
          >
            {isUploading ? "Processing..." : "Upload & Save Asset"}
          </Button>
        </div>
      </div>
    </div>
  );
}
