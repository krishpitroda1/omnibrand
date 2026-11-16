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
    <div className="max-w-[420px] mx-auto rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl text-white font-sans text-xs">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full p-0.5"
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
              <span className="font-semibold text-xs tracking-tight">
                {brand.socialAccounts?.[0]?.handle || "@brand"}
              </span>
              <CheckCircle2 className="h-3 w-3 text-sky-400 fill-sky-400" />
            </div>
            <span className="text-[10px] text-slate-400">Original Audio</span>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 text-slate-400" />
      </div>

      {/* Media container */}
      <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="Instagram Media" className="w-full h-full object-cover" />
      </div>

      {/* Action Bar */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`transition-colors ${liked ? "text-rose-500 fill-rose-500" : "text-white"}`}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-rose-500" : ""}`} />
            </button>
            <button className="text-white hover:text-slate-300">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="text-white hover:text-slate-300">
              <Send className="h-5 w-5" />
            </button>
          </div>
          <button onClick={() => setSaved(!saved)} className="text-white">
            <Bookmark className={`h-5 w-5 ${saved ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Likes count */}
        <p className="font-semibold text-[11px] text-white">
          {liked ? "1,429 likes" : "1,428 likes"}
        </p>

        {/* Caption */}
        <div className="text-[11px] leading-relaxed text-slate-200">
          <span className="font-bold text-white mr-1.5">
            {brand.socialAccounts?.[0]?.handle || "brand"}
          </span>
          <span>{caption}</span>
          <div className="mt-1 text-sky-400 font-medium">
            {hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 cursor-pointer pt-1">
          View all 48 comments
        </p>
        <p className="text-[9px] uppercase tracking-wider text-slate-500">
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
    <div className="max-w-[480px] mx-auto rounded-2xl bg-[#1B1F23] border border-white/10 overflow-hidden shadow-2xl text-white font-sans text-xs">
      {/* Author Header */}
      <div className="p-4 flex items-start justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.socialAccounts?.[0]?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
            alt={brand.name}
            className="h-10 w-10 rounded-full object-cover border border-white/20"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">{brand.name}</span>
              <span className="text-[10px] text-slate-400">&bull; 1st</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">{brand.tagline || brand.industry}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">1d &bull; Edited &bull; 🌐</p>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 text-slate-400" />
      </div>

      {/* Copy */}
      <div className="px-4 py-3 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
        {expanded ? caption : caption.slice(0, 160) + (caption.length > 160 ? "..." : "")}
        {caption.length > 160 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-slate-400 hover:text-white font-semibold ml-1"
          >
            see more
          </button>
        )}
        <div className="mt-2 text-sky-400 font-semibold">
          {hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
        </div>
      </div>

      {/* Media */}
      <div className="aspect-[16/9] bg-slate-950 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="LinkedIn Media" className="w-full h-full object-cover" />
      </div>

      {/* CTA Box */}
      {ctaText && (
        <div className="p-3 bg-slate-900 border-t border-b border-white/5 flex items-center justify-between">
          <span className="font-semibold text-xs text-white">{ctaText}</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            {brand.website || "luminacreative.studio"} <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      )}

      {/* Reactions Bar */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-white/5">
          <div className="flex items-center gap-1">
            <span className="h-4 w-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">👍</span>
            <span className="h-4 w-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">❤️</span>
            <span className="h-4 w-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px]">💡</span>
            <span className="ml-1">842</span>
          </div>
          <span>36 comments &bull; 12 reposts</span>
        </div>

        <div className="flex items-center justify-around pt-1 text-slate-400 text-xs">
          <button className="flex items-center gap-1.5 hover:text-white py-1">
            <ThumbsUp className="h-4 w-4" /> Like
          </button>
          <button className="flex items-center gap-1.5 hover:text-white py-1">
            <MessageCircle className="h-4 w-4" /> Comment
          </button>
          <button className="flex items-center gap-1.5 hover:text-white py-1">
            <Repeat2 className="h-4 w-4" /> Repost
          </button>
          <button className="flex items-center gap-1.5 hover:text-white py-1">
            <Send className="h-4 w-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. X (TWITTER) TWEET CARD
function XTweetCard({ brand, caption, hashtags, mediaUrl }: NativePreviewProps) {
  return (
    <div className="max-w-[460px] mx-auto rounded-2xl bg-black border border-white/10 p-4 shadow-2xl text-white font-sans text-xs space-y-3">
      {/* Author */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.socialAccounts?.[0]?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
            alt={brand.name}
            className="h-10 w-10 rounded-full object-cover border border-white/10"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-white">{brand.name}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 fill-sky-400" />
            </div>
            <span className="text-slate-400 text-[11px] font-mono">
              {brand.socialAccounts?.[0]?.handle || "@brand"} &bull; 2h
            </span>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 text-slate-500" />
      </div>

      {/* Tweet Body */}
      <p className="text-xs text-slate-100 leading-relaxed">{caption}</p>
      {hashtags.length > 0 && (
        <p className="text-sky-400 text-xs">
          {hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
        </p>
      )}

      {/* Media */}
      <div className="rounded-xl overflow-hidden border border-white/10 aspect-[16/9] bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="X Media" className="w-full h-full object-cover" />
      </div>

      {/* Metrics Row */}
      <div className="pt-2 flex items-center justify-between text-slate-400 text-[11px]">
        <button className="flex items-center gap-1 hover:text-sky-400">
          <MessageCircle className="h-4 w-4" /> 18
        </button>
        <button className="flex items-center gap-1 hover:text-emerald-400">
          <Repeat2 className="h-4 w-4" /> 42
        </button>
        <button className="flex items-center gap-1 hover:text-rose-400">
          <Heart className="h-4 w-4" /> 312
        </button>
        <button className="flex items-center gap-1 hover:text-sky-400">
          <BarChart2 className="h-4 w-4" /> 14.8K
        </button>
        <button className="hover:text-white">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// 4. FACEBOOK CARD
function FacebookCard({ brand, caption, hashtags, mediaUrl }: NativePreviewProps) {
  return (
    <div className="max-w-[460px] mx-auto rounded-2xl bg-[#242526] border border-white/10 overflow-hidden shadow-2xl text-white font-sans text-xs">
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.socialAccounts?.[0]?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
            alt={brand.name}
            className="h-10 w-10 rounded-full object-cover border border-white/10"
          />
          <div>
            <p className="font-bold text-sm text-white">{brand.name}</p>
            <p className="text-[10px] text-slate-400">Yesterday at 3:15 PM &bull; 🌐</p>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 text-slate-400" />
      </div>

      <div className="px-3.5 pb-2.5 text-xs text-slate-200">
        <p>{caption}</p>
        <p className="text-sky-400 mt-1">{hashtags.map((h) => `#${h.replace('#', '')}`).join(" ")}</p>
      </div>

      <div className="aspect-square bg-slate-950 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="Facebook" className="w-full h-full object-cover" />
      </div>

      <div className="p-3 flex items-center justify-around border-t border-white/10 text-slate-400">
        <button className="flex items-center gap-1.5 hover:text-white">
          <ThumbsUp className="h-4 w-4" /> Like
        </button>
        <button className="flex items-center gap-1.5 hover:text-white">
          <MessageCircle className="h-4 w-4" /> Comment
        </button>
        <button className="flex items-center gap-1.5 hover:text-white">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </div>
  );
}

// 5. PINTEREST CARD
function PinterestCard({ brand, caption, mediaUrl }: NativePreviewProps) {
  return (
    <div className="max-w-[320px] mx-auto rounded-3xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl text-white font-sans text-xs">
      <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="Pinterest" className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 opacity-90 hover:opacity-100">
          <span className="px-3.5 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs shadow-md">
            Save
          </span>
        </div>
      </div>
      <div className="p-3.5 space-y-1">
        <h4 className="font-bold text-sm text-white line-clamp-1">{caption.slice(0, 45)}</h4>
        <p className="text-[11px] text-slate-400 line-clamp-2">{caption}</p>
        <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-400">
          <span className="font-medium text-white">{brand.name}</span>
        </div>
      </div>
    </div>
  );
}

// Generic Card Fallback
function GenericCard({ platform, brand, caption, mediaUrl }: NativePreviewProps) {
  return (
    <div className="max-w-[420px] mx-auto rounded-2xl bg-slate-900 border border-white/10 p-4 shadow-xl text-white text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-bold text-sm text-white">{brand.name}</span>
        <span className="text-[10px] text-slate-400 uppercase font-mono">{platform} Preview</span>
      </div>
      <p className="text-slate-200">{caption}</p>
      <div className="aspect-video rounded-xl bg-slate-950 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt={platform} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
