"use client";

import React, { useState } from "react";
import { Platform } from "@/types";
import { Brand } from "@/types";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  Lightbulb,
  Repeat2,
  BarChart2,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";

interface NativePreviewProps {
  platform: Platform;
  brand: Brand;
  caption: string;
  hashtags: string[];
  mediaUrl: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function NativePostCards(props: NativePreviewProps) {
  switch (props.platform) {
    case "INSTAGRAM":
      return <InstagramCard {...props} />;
    case "LINKEDIN":
      return <LinkedInCard {...props} />;
    case "X":
      return <XTweetCard {...props} />;
    case "FACEBOOK":
      return <FacebookCard {...props} />;
    case "PINTEREST":
      return <PinterestCard {...props} />;
    default:
      return <GenericCard {...props} />;
  }
}

// 1. INSTAGRAM POST CARD
function InstagramCard({ brand, caption, hashtags, mediaUrl }: NativePreviewProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="social-preview-card max-w-[420px] w-full mx-auto rounded-2xl bg-black border border-white/15 overflow-hidden shadow-2xl font-sans text-xs" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-white/10" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full p-0.5 shrink-0"
            style={{
              background: `linear-gradient(45deg, ${brand.brandKit?.primaryColor || "#f59e0b"}, #ec4899, #8b5cf6)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.socialAccounts?.[0]?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
              alt={brand.name}
              className="h-full w-full rounded-full object-cover border border-black"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs tracking-tight text-white" style={{ color: "#ffffff" }}>
                {brand.socialAccounts?.[0]?.handle || "@brand"}
              </span>
              <CheckCircle2 className="h-3 w-3 text-sky-400 fill-sky-400" style={{ color: "#38bdf8" }} />
            </div>
            <span className="text-[10px] text-slate-300 block" style={{ color: "#cbd5e1" }}>Original Audio</span>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 text-slate-300" style={{ color: "#cbd5e1" }} />
      </div>

      {/* Media container */}
      <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden" style={{ backgroundColor: "#020617" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="Instagram Media" className="w-full h-full object-cover" />
      </div>

      {/* Action Bar */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLiked(!liked)}
              className="transition-colors hover:opacity-80"
              style={{ color: liked ? "#f43f5e" : "#ffffff" }}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-rose-500 text-rose-500" : "text-white"}`} style={{ stroke: liked ? "#f43f5e" : "#ffffff", fill: liked ? "#f43f5e" : "none" }} />
            </button>
            <button type="button" className="text-white hover:opacity-80" style={{ color: "#ffffff" }}>
              <MessageCircle className="h-5 w-5" style={{ stroke: "#ffffff" }} />
            </button>
            <button type="button" className="text-white hover:opacity-80" style={{ color: "#ffffff" }}>
              <Send className="h-5 w-5" style={{ stroke: "#ffffff" }} />
            </button>
          </div>
          <button type="button" onClick={() => setSaved(!saved)} className="text-white hover:opacity-80" style={{ color: "#ffffff" }}>
            <Bookmark className={`h-5 w-5 ${saved ? "fill-white" : ""}`} style={{ stroke: "#ffffff", fill: saved ? "#ffffff" : "none" }} />
          </button>
        </div>

        {/* Likes count */}
        <p className="font-semibold text-[11px] text-white" style={{ color: "#ffffff" }}>
          {liked ? "1,429 likes" : "1,428 likes"}
        </p>

        {/* Caption */}
        <div className="text-[11px] leading-relaxed text-slate-100" style={{ color: "#f1f5f9" }}>
          <span className="font-bold text-white mr-1.5" style={{ color: "#ffffff" }}>
            {brand.socialAccounts?.[0]?.handle || "brand"}
          </span>
          <span style={{ color: "#f1f5f9" }}>{caption}</span>
          <div className="mt-1 font-medium" style={{ color: "#38bdf8" }}>
            {hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
          </div>
        </div>

        <p className="text-[10px] cursor-pointer pt-1" style={{ color: "#94a3b8" }}>
          View all 48 comments
        </p>
        <p className="text-[9px] uppercase tracking-wider font-medium" style={{ color: "#64748b" }}>
          2 hours ago
        </p>
      </div>
    </div>
  );
}

// 2. LINKEDIN FEED CARD
function LinkedInCard({ brand, caption, hashtags, mediaUrl, ctaText, ctaUrl }: NativePreviewProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="social-preview-card max-w-[480px] w-full mx-auto rounded-2xl bg-[#1B1F23] border border-white/15 overflow-hidden shadow-2xl font-sans text-xs" style={{ backgroundColor: "#1B1F23", color: "#ffffff" }}>
      {/* Author Header */}
      <div className="p-4 flex items-start justify-between border-b border-white/10" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.socialAccounts?.[0]?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
            alt={brand.name}
            className="h-10 w-10 rounded-full object-cover border border-white/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white" style={{ color: "#ffffff" }}>{brand.name}</span>
              <span className="text-[10px]" style={{ color: "#94a3b8" }}>&bull; 1st</span>
            </div>
            <p className="text-[11px] leading-tight" style={{ color: "#cbd5e1" }}>{brand.tagline || brand.industry}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "#94a3b8" }}>1d &bull; Edited &bull; 🌐</p>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4" style={{ color: "#94a3b8" }} />
      </div>

      {/* Copy */}
      <div className="px-4 py-3 text-xs whitespace-pre-line leading-relaxed" style={{ color: "#f1f5f9" }}>
        {expanded ? caption : caption.slice(0, 160) + (caption.length > 160 ? "..." : "")}
        {caption.length > 160 && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="font-semibold ml-1 hover:underline"
            style={{ color: "#38bdf8" }}
          >
            see more
          </button>
        )}
        <div className="mt-2 font-semibold" style={{ color: "#38bdf8" }}>
          {hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
        </div>
      </div>

      {/* Media */}
      <div className="aspect-[16/9] bg-slate-950 overflow-hidden" style={{ backgroundColor: "#020617" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="LinkedIn Media" className="w-full h-full object-cover" />
      </div>

      {/* CTA Box */}
      {ctaText && (
        <div className="p-3 bg-slate-900 border-t border-b border-white/10 flex items-center justify-between" style={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)" }}>
          <span className="font-semibold text-xs text-white" style={{ color: "#ffffff" }}>{ctaText}</span>
          <span className="text-[10px] flex items-center gap-1" style={{ color: "#cbd5e1" }}>
            {brand.website || "luminacreative.studio"} <ExternalLink className="h-3 w-3" style={{ stroke: "#cbd5e1" }} />
          </span>
        </div>
      )}

      {/* Reactions Bar */}
      <div className="p-3 border-t border-white/10 space-y-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between text-[10px] pb-2 border-b border-white/10" style={{ color: "#94a3b8", borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-1">
            <span className="h-4 w-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">👍</span>
            <span className="h-4 w-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">❤️</span>
            <span className="h-4 w-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px]">💡</span>
            <span className="ml-1 font-medium" style={{ color: "#e2e8f0" }}>842</span>
          </div>
          <span>36 comments &bull; 12 reposts</span>
        </div>

        <div className="flex items-center justify-around pt-1 text-xs" style={{ color: "#cbd5e1" }}>
          <button type="button" className="flex items-center gap-1.5 hover:text-white py-1" style={{ color: "#cbd5e1" }}>
            <ThumbsUp className="h-4 w-4" style={{ stroke: "#cbd5e1" }} /> Like
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:text-white py-1" style={{ color: "#cbd5e1" }}>
            <MessageCircle className="h-4 w-4" style={{ stroke: "#cbd5e1" }} /> Comment
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:text-white py-1" style={{ color: "#cbd5e1" }}>
            <Repeat2 className="h-4 w-4" style={{ stroke: "#cbd5e1" }} /> Repost
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:text-white py-1" style={{ color: "#cbd5e1" }}>
            <Send className="h-4 w-4" style={{ stroke: "#cbd5e1" }} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. X (TWITTER) TWEET CARD
function XTweetCard({ brand, caption, hashtags, mediaUrl }: NativePreviewProps) {
  return (
    <div className="social-preview-card max-w-[460px] w-full mx-auto rounded-2xl bg-black border border-white/15 p-4 shadow-2xl font-sans text-xs space-y-3" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Author */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.socialAccounts?.[0]?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
            alt={brand.name}
            className="h-10 w-10 rounded-full object-cover border border-white/15 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-white" style={{ color: "#ffffff" }}>{brand.name}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 fill-sky-400" style={{ color: "#38bdf8" }} />
            </div>
            <span className="text-[11px] font-mono" style={{ color: "#94a3b8" }}>
              {brand.socialAccounts?.[0]?.handle || "@brand"} &bull; 2h
            </span>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4" style={{ color: "#64748b" }} />
      </div>

      {/* Tweet Body */}
      <p className="text-xs leading-relaxed" style={{ color: "#f8fafc" }}>{caption}</p>
      {hashtags.length > 0 && (
        <p className="text-xs font-medium" style={{ color: "#38bdf8" }}>
          {hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
        </p>
      )}

      {/* Media */}
      <div className="rounded-xl overflow-hidden border border-white/15 aspect-[16/9] bg-slate-950" style={{ backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.15)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="X Media" className="w-full h-full object-cover" />
      </div>

      {/* Metrics Row */}
      <div className="pt-2 flex items-center justify-between text-[11px]" style={{ color: "#94a3b8" }}>
        <button type="button" className="flex items-center gap-1 hover:text-sky-400" style={{ color: "#94a3b8" }}>
          <MessageCircle className="h-4 w-4" style={{ stroke: "#94a3b8" }} /> 18
        </button>
        <button type="button" className="flex items-center gap-1 hover:text-emerald-400" style={{ color: "#94a3b8" }}>
          <Repeat2 className="h-4 w-4" style={{ stroke: "#94a3b8" }} /> 42
        </button>
        <button type="button" className="flex items-center gap-1 hover:text-rose-400" style={{ color: "#94a3b8" }}>
          <Heart className="h-4 w-4" style={{ stroke: "#94a3b8" }} /> 312
        </button>
        <button type="button" className="flex items-center gap-1 hover:text-sky-400" style={{ color: "#94a3b8" }}>
          <BarChart2 className="h-4 w-4" style={{ stroke: "#94a3b8" }} /> 14.8K
        </button>
        <button type="button" className="hover:text-white" style={{ color: "#94a3b8" }}>
          <Share2 className="h-4 w-4" style={{ stroke: "#94a3b8" }} />
        </button>
      </div>
    </div>
  );
}

// 4. FACEBOOK CARD
function FacebookCard({ brand, caption, hashtags, mediaUrl }: NativePreviewProps) {
  return (
    <div className="social-preview-card max-w-[460px] w-full mx-auto rounded-2xl bg-[#242526] border border-white/15 overflow-hidden shadow-2xl font-sans text-xs" style={{ backgroundColor: "#242526", color: "#ffffff" }}>
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.socialAccounts?.[0]?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
            alt={brand.name}
            className="h-10 w-10 rounded-full object-cover border border-white/15 shrink-0"
          />
          <div>
            <p className="font-bold text-sm text-white" style={{ color: "#ffffff" }}>{brand.name}</p>
            <p className="text-[10px]" style={{ color: "#cbd5e1" }}>Yesterday at 3:15 PM &bull; 🌐</p>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4" style={{ color: "#cbd5e1" }} />
      </div>

      <div className="px-3.5 pb-2.5 text-xs">
        <p style={{ color: "#f1f5f9" }}>{caption}</p>
        <p className="mt-1 font-medium" style={{ color: "#38bdf8" }}>{hashtags.map((h) => `#${h.replace('#', '')}`).join(" ")}</p>
      </div>

      <div className="aspect-square bg-slate-950 overflow-hidden" style={{ backgroundColor: "#020617" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="Facebook" className="w-full h-full object-cover" />
      </div>

      <div className="p-3 flex items-center justify-around border-t border-white/10" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#cbd5e1" }}>
        <button type="button" className="flex items-center gap-1.5 hover:text-white" style={{ color: "#cbd5e1" }}>
          <ThumbsUp className="h-4 w-4" style={{ stroke: "#cbd5e1" }} /> Like
        </button>
        <button type="button" className="flex items-center gap-1.5 hover:text-white" style={{ color: "#cbd5e1" }}>
          <MessageCircle className="h-4 w-4" style={{ stroke: "#cbd5e1" }} /> Comment
        </button>
        <button type="button" className="flex items-center gap-1.5 hover:text-white" style={{ color: "#cbd5e1" }}>
          <Share2 className="h-4 w-4" style={{ stroke: "#cbd5e1" }} /> Share
        </button>
      </div>
    </div>
  );
}

// 5. PINTEREST CARD
function PinterestCard({ brand, caption, mediaUrl }: NativePreviewProps) {
  return (
    <div className="social-preview-card max-w-[320px] w-full mx-auto rounded-3xl bg-slate-900 border border-white/15 overflow-hidden shadow-2xl font-sans text-xs" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>
      <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden group" style={{ backgroundColor: "#020617" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="Pinterest" className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 opacity-95 hover:opacity-100">
          <span className="px-3.5 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs shadow-md" style={{ backgroundColor: "#dc2626", color: "#ffffff" }}>
            Save
          </span>
        </div>
      </div>
      <div className="p-3.5 space-y-1">
        <h4 className="font-bold text-sm text-white line-clamp-1" style={{ color: "#ffffff" }}>{caption.slice(0, 45)}</h4>
        <p className="text-[11px] line-clamp-2" style={{ color: "#cbd5e1" }}>{caption}</p>
        <div className="pt-2 flex items-center gap-2 text-[10px]" style={{ color: "#94a3b8" }}>
          <span className="font-medium text-white" style={{ color: "#ffffff" }}>{brand.name}</span>
        </div>
      </div>
    </div>
  );
}

// Generic Card Fallback
function GenericCard({ platform, brand, caption, mediaUrl }: NativePreviewProps) {
  return (
    <div className="social-preview-card max-w-[420px] w-full mx-auto rounded-2xl bg-slate-900 border border-white/15 p-4 shadow-xl text-xs space-y-3" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <span className="font-bold text-sm text-white" style={{ color: "#ffffff" }}>{brand.name}</span>
        <span className="text-[10px] uppercase font-mono" style={{ color: "#94a3b8" }}>{platform} Preview</span>
      </div>
      <p style={{ color: "#f1f5f9" }}>{caption}</p>
      <div className="aspect-video rounded-xl bg-slate-950 overflow-hidden" style={{ backgroundColor: "#020617" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt={platform} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
