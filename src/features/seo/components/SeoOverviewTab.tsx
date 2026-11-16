"use client";

import React, { useState } from "react";
import {
  SEED_90_SEARCH_METRICS,
  SEED_12_COMPETITORS,
} from "@/lib/seed/seo-seed";
import { CompetitorBenchmarkItem } from "@/types/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  TrendingUp,
  Search,
  Eye,
  MousePointer,
  MapPin,
  Bot,
  Users,
  BarChart3,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface SeoOverviewTabProps {
  activeBrandName: string;
}

export function SeoOverviewTab({ activeBrandName }: SeoOverviewTabProps) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorBenchmarkItem | null>(null);

  // Compute 90-day totals
  const totalImpressions = SEED_90_SEARCH_METRICS.reduce((acc, curr) => acc + curr.gscImpressions, 0);
  const totalClicks = SEED_90_SEARCH_METRICS.reduce((acc, curr) => acc + curr.gscClicks, 0);
  const avgCtr = ((totalClicks / totalImpressions) * 100).toFixed(2);
  const avgPos = (
    SEED_90_SEARCH_METRICS.reduce((acc, curr) => acc + curr.gscAveragePosition, 0) /
    SEED_90_SEARCH_METRICS.length
  ).toFixed(1);

  const totalLocalViews = SEED_90_SEARCH_METRICS.reduce((acc, curr) => acc + curr.gbpViews, 0);
  const totalLocalInteractions = SEED_90_SEARCH_METRICS.reduce(
    (acc, curr) => acc + curr.gbpCalls + curr.gbpDirections,
    0
  );

  return (
    <div className="space-y-6">
      {/* Search & GEO Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Organic Impressions</span>
            <Eye className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {(totalImpressions / 1000000).toFixed(2)}M
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">+18.4% 90d trend</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Organic Clicks</span>
            <MousePointer className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
            {(totalClicks / 1000).toFixed(1)}K
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">+24.2% 90d trend</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Average CTR</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {avgCtr}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">+0.4% SERP snippet</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Average Position</span>
            <Search className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            #{avgPos}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">▲ 3.2 positions</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Local Actions</span>
            <MapPin className="h-3.5 w-3.5 text-pink-400" />
          </div>
          <div className="text-xl font-bold text-pink-400 font-mono mt-1">
            {totalLocalInteractions.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Calls & Directions</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-emerald-300 uppercase">GEO Readiness</span>
            <Bot className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            82 / 100
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Perplexity & ChatGPT Ready</span>
        </div>
      </div>

      {/* Competitor Benchmarking Panel (12 Competitors) */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[var(--brand-primary)]" />
              <h3 className="text-base font-bold text-white">
                Competitor Share-of-Voice & Content Velocity (12 Tracked Entities)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative landscape tracking organic keyword overlap, publishing cadence, and format dominance.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Target Brand: <strong className="text-white">{activeBrandName}</strong> (Share of Voice: 18.2%)
          </span>
        </div>

        {/* 12 Competitors Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 text-[11px] font-mono">
                <th className="py-2.5 px-3">COMPETITOR</th>
                <th className="py-2.5 px-3">DOMAIN</th>
                <th className="py-2.5 px-3">SHARE OF VOICE</th>
                <th className="py-2.5 px-3 text-right">POSTS / MO</th>
                <th className="py-2.5 px-3">TOP FORMATS</th>
                <th className="py-2.5 px-3 text-right">KEYWORD OVERLAP</th>
                <th className="py-2.5 px-3 text-right">ENG. RATE</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SEED_12_COMPETITORS.map((comp) => (
                <tr key={comp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {comp.name}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {comp.domain}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-900 h-2 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="bg-[var(--brand-primary)] h-full rounded-full"
                          style={{ width: `${comp.shareOfVoice * 3.5}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-200 font-bold text-[11px]">
                        {comp.shareOfVoice}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {comp.postFrequencyMonthly}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {comp.topFormats.map((f, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-white/5"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-400 font-semibold">
                    {comp.overlapKeywordsCount} kws
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-400">
                    {comp.avgEngagementRate}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] h-7 px-2"
                      onClick={() => setSelectedCompetitor(comp)}
                    >
                      <span>SWOT</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitor SWOT Detail Modal */}
      {selectedCompetitor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedCompetitor.name} ({selectedCompetitor.domain})
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Share of Voice: {selectedCompetitor.shareOfVoice}% • Overlap: {selectedCompetitor.overlapKeywordsCount} keywords
                </span>
              </div>
              <Badge variant="brand" size="sm">Competitor Profile</Badge>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                <strong className="text-emerald-400 font-semibold block mb-0.5">Known Strengths:</strong>
                {selectedCompetitor.strengths}
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                <strong className="text-rose-400 font-semibold block mb-0.5">Exploitable Weaknesses & Gaps:</strong>
                {selectedCompetitor.weaknesses}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedCompetitor(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
