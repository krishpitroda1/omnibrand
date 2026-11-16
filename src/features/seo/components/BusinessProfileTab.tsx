"use client";

import React, { useState } from "react";
import {
  SEED_GBP_REVIEWS,
  SEED_90_SEARCH_METRICS,
} from "@/lib/seed/seo-seed";
import { GbpReviewItem } from "@/types/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  PhoneCall,
  Navigation,
  Eye,
  MessageSquare,
  Bot,
  CheckCircle2,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export function BusinessProfileTab() {
  const [reviews, setReviews] = useState<GbpReviewItem[]>(SEED_GBP_REVIEWS);
  const [activeReviewForReply, setActiveReviewForReply] = useState<GbpReviewItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const totalViews = SEED_90_SEARCH_METRICS.reduce((acc, curr) => acc + curr.gbpViews, 0);
  const totalSearches = SEED_90_SEARCH_METRICS.reduce((acc, curr) => acc + curr.gbpSearches, 0);
  const totalCalls = SEED_90_SEARCH_METRICS.reduce((acc, curr) => acc + curr.gbpCalls, 0);
  const totalDirections = SEED_90_SEARCH_METRICS.reduce((acc, curr) => acc + curr.gbpDirections, 0);

  const handleOpenReply = (rev: GbpReviewItem) => {
    setActiveReviewForReply(rev);
    setReplyText(rev.replyText || "");
  };

  const handleGenerateAiReply = () => {
    if (!activeReviewForReply) return;
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      if (activeReviewForReply.rating >= 4) {
        setReplyText(
          `Thank you so much, ${activeReviewForReply.reviewerName}! We are thrilled you had such a wonderful experience with our team. We look forward to continuing to support your business growth!`
        );
      } else {
        setReplyText(
          `Hi ${activeReviewForReply.reviewerName}, we sincerely apologize for any frustration you experienced during onboarding. We take your feedback seriously and our dedicated support lead is reaching out directly to make this right.`
        );
      }
    }, 400);
  };

  const handleSendReply = () => {
    if (!activeReviewForReply) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === activeReviewForReply.id
          ? {
              ...r,
              replyText,
              replyStatus: "REPLIED",
              repliedAt: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
    setActiveReviewForReply(null);
    alert("Reply submitted to Google Business Profile API successfully!");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Local Listing Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Local Listing Views</span>
            <Eye className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Google Maps & Local Pack</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Direct & Discovery Searches</span>
            <MapPin className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {totalSearches.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">+14.2% search intent</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Customer Phone Calls</span>
            <PhoneCall className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">
            {totalCalls.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Direct tap-to-call</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Direction Requests</span>
            <Navigation className="h-4 w-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-pink-400 font-mono mt-1">
            {totalDirections.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Branch consultations</span>
        </div>
      </div>

      {/* Google Business Profile Reviews Feed */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span>Google Business Profile Certified Reviews Feed</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live customer ratings with sentiment analysis and AI-assisted reply drafting.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Average Rating:</span>
            <strong className="text-amber-400 font-bold text-sm">4.8 / 5.0 ★</strong>
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                    {rev.reviewerName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{rev.reviewerName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {renderStars(rev.rating)}
                      <span className="text-[10px] text-slate-500 font-mono">{rev.reviewDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      rev.sentiment === "POSITIVE"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {rev.sentiment}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      rev.replyStatus === "REPLIED"
                        ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {rev.replyStatus === "REPLIED" ? "REPLIED" : "PENDING REPLY"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans pl-1 border-l-2 border-white/10">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Existing Reply Display */}
              {rev.replyText && (
                <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                    <span>Business Owner Response:</span>
                    <span className="text-[10px] text-slate-500 font-mono">{rev.repliedAt}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{rev.replyText}</p>
                </div>
              )}

              {/* Action */}
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant={rev.replyStatus === "REPLIED" ? "outline" : "brand"}
                  onClick={() => handleOpenReply(rev)}
                  className="text-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  <span>{rev.replyStatus === "REPLIED" ? "Edit Reply" : "Reply to Review"}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Modal */}
      {activeReviewForReply && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveReviewForReply(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[var(--brand-primary)]" />
                <span>Reply to Google Business Review</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Draft a verified response that will appear directly on Google Maps and Search.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300">
              <strong className="text-white block mb-0.5">{activeReviewForReply.reviewerName} wrote:</strong>
              &ldquo;{activeReviewForReply.comment}&rdquo;
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300 font-semibold">Your Response</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateAiReply}
                  disabled={isGeneratingAi}
                  className="text-[11px] h-7"
                >
                  <Sparkles className="h-3 w-3 mr-1 text-[var(--brand-primary)]" />
                  <span>{isGeneratingAi ? "Drafting..." : "AI Suggest Reply"}</span>
                </Button>
              </div>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your official response..."
                className="w-full bg-slate-950 border border-white/15 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setActiveReviewForReply(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="brand"
                disabled={!replyText.trim()}
                onClick={handleSendReply}
              >
                <span>Publish Reply</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
