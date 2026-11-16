"use client";

import React, { useState } from "react";
import {
  SEED_300_MENTIONS,
  SEED_ALERT_RULES,
} from "@/lib/seed/analytics-seed";
import { SocialMentionItem, SocialAlertRule, MentionSentiment } from "@/types/analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Radio,
  Search,
  Filter,
  AlertTriangle,
  Bell,
  MessageSquare,
  TrendingUp,
  Share2,
  Users,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Plus,
  Sliders,
} from "lucide-react";

export function SocialListeningTab() {
  const [mentions, setMentions] = useState<SocialMentionItem[]>(SEED_300_MENTIONS);
  const [alertRules, setAlertRules] = useState<SocialAlertRule[]>(SEED_ALERT_RULES);
  const [selectedSentiment, setSelectedSentiment] = useState<MentionSentiment | "ALL">("ALL");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [competitorFilter, setCompetitorFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;

  // Sentiment counts
  const positiveCount = mentions.filter((m) => m.sentiment === "POSITIVE").length;
  const neutralCount = mentions.filter((m) => m.sentiment === "NEUTRAL").length;
  const negativeCount = mentions.filter((m) => m.sentiment === "NEGATIVE").length;

  const positivePct = Math.round((positiveCount / mentions.length) * 100);
  const neutralPct = Math.round((neutralCount / mentions.length) * 100);
  const negativePct = Math.round((negativeCount / mentions.length) * 100);

  // Filter mentions
  const filtered = mentions.filter((m) => {
    if (selectedSentiment !== "ALL" && m.sentiment !== selectedSentiment) return false;
    if (selectedPlatform !== "ALL" && m.platform !== selectedPlatform) return false;
    if (competitorFilter !== "ALL" && m.competitorMentioned !== competitorFilter) return false;
    if (
      searchKeyword &&
      !m.snippet.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !m.authorHandle.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleCreateTask = (mentionId: string) => {
    setMentions((prev) =>
      prev.map((m) =>
        m.id === mentionId
          ? { ...m, hasResponseTask: true, responseTaskId: `task-${Date.now()}` }
          : m
      )
    );
    alert("Created response task in AI Agent Centre (assigned to Engagement Agent).");
  };

  const toggleAlertRule = (id: string) => {
    setAlertRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Mandatory Invariant Platform Coverage Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Platform Coverage Invariant Notice:</span>
          <p className="text-[11px] text-amber-200/90 mt-0.5">
            <strong>Listening coverage varies by platform. Some networks restrict third-party access.</strong> Direct private feeds on TikTok, Facebook Groups, and Threads are constrained by platform API governance policies. Mentions are ingested via official enterprise partner webhooks and certified public feeds.
          </p>
        </div>
      </div>

      {/* Top Bar: Sentiment Breakdown & Volume Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">300 Mentions Ingested</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">300 Active</div>
          <span className="text-[10px] text-slate-500 font-mono">Past 90 days continuous stream</span>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase">Positive Sentiment</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {positivePct}% ({positiveCount})
          </div>
          <span className="text-[10px] text-emerald-500/80 font-mono">Product praise & advocacy</span>
        </div>
        <div className="p-4 rounded-2xl border border-slate-500/20 bg-slate-500/5">
          <span className="text-[11px] font-semibold text-slate-300 uppercase">Neutral Sentiment</span>
          <div className="text-2xl font-bold text-slate-200 font-mono mt-1">
            {neutralPct}% ({neutralCount})
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Market commentary & comparisons</span>
        </div>
        <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <span className="text-[11px] font-semibold text-rose-400 uppercase">Negative Sentiment</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
            {negativePct}% ({negativeCount})
          </div>
          <span className="text-[10px] text-rose-400/80 font-mono">Support queries & critiques</span>
        </div>
      </div>

      {/* Sentiment Distribution Bar */}
      <div className="p-4 rounded-2xl border border-white/10 glass-card space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">Audience Sentiment Aggregate Distribution</span>
          <span className="text-slate-400 font-mono text-[11px]">300 Scored Posts</span>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-950 border border-white/10">
          <div style={{ width: `${positivePct}%` }} className="bg-emerald-400 h-full" title={`Positive: ${positivePct}%`} />
          <div style={{ width: `${neutralPct}%` }} className="bg-slate-400 h-full" title={`Neutral: ${neutralPct}%`} />
          <div style={{ width: `${negativePct}%` }} className="bg-rose-500 h-full" title={`Negative: ${negativePct}%`} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
          <span className="text-emerald-400 font-bold">● Positive ({positivePct}%)</span>
          <span className="text-slate-300 font-bold">● Neutral ({neutralPct}%)</span>
          <span className="text-rose-400 font-bold">● Negative ({negativePct}%)</span>
        </div>
      </div>

      {/* Real-time Alert Rules Section */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[var(--brand-primary)]" />
            <h3 className="text-sm font-bold text-white">
              Automated Anomaly & Negative Sentiment Alert Rules
            </h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => alert("Configuring new webhook listening alert rule...")}
          >
            <Plus className="h-3 w-3 mr-1" />
            <span>New Alert Rule</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alertRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                rule.isEnabled
                  ? "bg-slate-900/80 border-white/15"
                  : "bg-slate-950/40 border-white/5 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rule.name}</span>
                  <button
                    onClick={() => toggleAlertRule(rule.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      rule.isEnabled
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-white/10"
                    }`}
                  >
                    {rule.isEnabled ? "ACTIVE" : "PAUSED"}
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {rule.condition}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                <span>Channels: {rule.notifyChannels.join(", ")}</span>
                <span>Window: {rule.timeWindowHours}h</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mention Stream Filters & Table */}
      <div className="rounded-2xl border border-white/10 glass-card overflow-hidden space-y-4 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[var(--brand-primary)]" />
            <h3 className="text-sm font-bold text-white">Live Brand Mention Feed</h3>
            <span className="text-xs font-mono text-slate-400">({filtered.length} matching)</span>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search snippet or author..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-white/15 text-white text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Sentiment:</span>
          {(["ALL", "POSITIVE", "NEUTRAL", "NEGATIVE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelectedSentiment(s);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedSentiment === s
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {s}
            </button>
          ))}

          <span className="text-slate-500 mx-1">|</span>

          <span className="text-slate-400 text-[11px] font-semibold">Platform:</span>
          {["ALL", "X", "INSTAGRAM", "LINKEDIN", "REDDIT", "YOUTUBE", "WEB_NEWS", "GOOGLE_REVIEWS"].map(
            (p) => (
              <button
                key={p}
                onClick={() => {
                  setSelectedPlatform(p);
                  setPage(1);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  selectedPlatform === p
                    ? "bg-white/20 text-white font-bold"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Mention Rows */}
        <div className="space-y-3 pt-2">
          {paginated.map((item) => {
            let sentimentBadge = (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                +{item.sentimentScore} POSITIVE
              </span>
            );
            if (item.sentiment === "NEGATIVE") {
              sentimentBadge = (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  {item.sentimentScore} NEGATIVE
                </span>
              );
            } else if (item.sentiment === "NEUTRAL") {
              sentimentBadge = (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-slate-500/15 text-slate-300 border border-slate-500/30">
                  {item.sentimentScore >= 0 ? `+${item.sentimentScore}` : item.sentimentScore} NEUTRAL
                </span>
              );
            }

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                      {item.platform}
                    </span>
                    <span className="text-xs font-bold text-white">{item.authorName}</span>
                    <span className="text-xs text-slate-400 font-mono">{item.authorHandle}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({item.authorFollowers.toLocaleString()} followers)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {sentimentBadge}
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans pl-1 border-l-2 border-white/10">
                  &ldquo;{item.snippet}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-mono">
                      Est. Reach: <strong className="text-white">{item.reachEstimate.toLocaleString()}</strong>
                    </span>
                    {item.keywordMentioned && (
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                        #{item.keywordMentioned}
                      </span>
                    )}
                    {item.competitorMentioned && (
                      <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono">
                        vs. {item.competitorMentioned}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.hasResponseTask ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Task Queued</span>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant={item.sentiment === "NEGATIVE" ? "brand" : "outline"}
                        onClick={() => handleCreateTask(item.id)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>Create Response Task</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
          <span>
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} mentions
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="font-mono font-bold text-white px-2">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
