"use client";

import React, { useState } from "react";
import { SEED_45_KEYWORDS } from "@/lib/seed/seo-seed";
import { TrackedKeywordItem, SearchIntent } from "@/types/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  KeyRound,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink,
  Filter,
  Layers,
} from "lucide-react";

export function KeywordsTab() {
  const [keywords, setKeywords] = useState<TrackedKeywordItem[]>(SEED_45_KEYWORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<SearchIntent | "ALL">("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"ALL" | "EASY" | "MEDIUM" | "HARD">("ALL");

  const filtered = keywords.filter((kw) => {
    if (selectedIntent !== "ALL" && kw.intent !== selectedIntent) return false;
    if (selectedDifficulty === "EASY" && kw.difficulty >= 40) return false;
    if (selectedDifficulty === "MEDIUM" && (kw.difficulty < 40 || kw.difficulty > 70)) return false;
    if (selectedDifficulty === "HARD" && kw.difficulty <= 70) return false;
    if (
      searchQuery &&
      !kw.keyword.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !kw.targetUrl.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const top3Count = keywords.filter((k) => k.currentPosition <= 3).length;
  const top10Count = keywords.filter((k) => k.currentPosition <= 10).length;
  const improvedCount = keywords.filter((k) => k.movement > 0).length;

  const renderSparkline = (points: number[]) => {
    // In rankings, lower number = higher position
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      // Invert: lower position number should be near the top
      const y = ((p - min) / range) * (height - 6) + 3;
      return `${x},${y}`;
    });

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={`M ${coords.join(" L ")}`}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.length > 0 && (
          <circle
            cx={coords[coords.length - 1].split(",")[0]}
            cy={coords[coords.length - 1].split(",")[1]}
            r="2.5"
            fill="#22D3EE"
          />
        )}
      </svg>
    );
  };

  const getIntentBadge = (intent: SearchIntent) => {
    switch (intent) {
      case "COMMERCIAL":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">COMMERCIAL</span>;
      case "TRANSACTIONAL":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">TRANSACTIONAL</span>;
      case "INFORMATIONAL":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">INFORMATIONAL</span>;
      case "NAVIGATIONAL":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">NAVIGATIONAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Tracked Keywords</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">45 Active</div>
          <span className="text-[10px] text-slate-500 font-mono">Continuous daily SERP monitoring</span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase">Top 3 Positions</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{top3Count} Keywords</div>
          <span className="text-[10px] text-emerald-500/80 font-mono">Dominating search snippets</span>
        </div>
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
          <span className="text-[11px] font-semibold text-blue-400 uppercase">Page 1 (Top 10)</span>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">{top10Count} Keywords</div>
          <span className="text-[10px] text-blue-400/80 font-mono">High organic click yield</span>
        </div>
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <span className="text-[11px] font-semibold text-cyan-400 uppercase">Recent Rank Improvements</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{improvedCount} Gaining</div>
          <span className="text-[10px] text-cyan-400/80 font-mono">Positive SERP momentum</span>
        </div>
      </div>

      {/* Keywords Table Card */}
      <div className="rounded-2xl border border-white/10 glass-card overflow-hidden space-y-4 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[var(--brand-primary)]" />
            <h3 className="text-sm font-bold text-white">Tracked Keyword Rankings & Search Movement</h3>
            <span className="text-xs font-mono text-slate-400">({filtered.length} visible)</span>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search keywords or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 text-white text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Search Intent:</span>
          {(["ALL", "COMMERCIAL", "TRANSACTIONAL", "INFORMATIONAL", "NAVIGATIONAL"] as const).map(
            (intent) => (
              <button
                key={intent}
                onClick={() => setSelectedIntent(intent)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                  selectedIntent === intent
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {intent}
              </button>
            )
          )}

          <span className="text-slate-500 mx-1">|</span>

          <span className="text-slate-400 text-[11px] font-semibold">Difficulty:</span>
          {(["ALL", "EASY", "MEDIUM", "HARD"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                selectedDifficulty === diff
                  ? "bg-white/20 text-white font-bold"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Full Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 text-[11px] font-mono">
                <th className="py-2.5 px-3">KEYWORD</th>
                <th className="py-2.5 px-3 text-center">RANK</th>
                <th className="py-2.5 px-3 text-center">MOVEMENT</th>
                <th className="py-2.5 px-3 text-right">SEARCH VOLUME</th>
                <th className="py-2.5 px-3 text-center">DIFFICULTY</th>
                <th className="py-2.5 px-3">INTENT</th>
                <th className="py-2.5 px-3">TARGET URL</th>
                <th className="py-2.5 px-3 text-right">TREND (10d)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((kw) => (
                <tr key={kw.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {kw.keyword}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-white">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        kw.currentPosition <= 3
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : kw.currentPosition <= 10
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      #{kw.currentPosition}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {kw.movement > 0 ? (
                      <span className="inline-flex items-center text-emerald-400 font-bold text-xs">
                        <ArrowUp className="h-3 w-3 mr-0.5" /> +{kw.movement}
                      </span>
                    ) : kw.movement < 0 ? (
                      <span className="inline-flex items-center text-rose-400 font-bold text-xs">
                        <ArrowDown className="h-3 w-3 mr-0.5" /> {kw.movement}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-slate-500">
                        <Minus className="h-3 w-3 mr-0.5" /> 0
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300 font-semibold">
                    {kw.searchVolume.toLocaleString()}/mo
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        kw.difficulty < 40
                          ? "bg-emerald-500/15 text-emerald-400"
                          : kw.difficulty <= 70
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {kw.difficulty}%
                    </span>
                  </td>
                  <td className="py-3 px-3">{getIntentBadge(kw.intent)}</td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                    <a
                      href={kw.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-cyan-400 flex items-center gap-1 truncate max-w-[220px]"
                    >
                      <span className="truncate">{kw.targetUrl.replace("https://omnibrand.io", "")}</span>
                      <ExternalLink className="h-3 w-3 text-slate-500 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="py-3 px-3 text-right">{renderSparkline(kw.rankHistory)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
