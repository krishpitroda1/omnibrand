"use client";

import React, { useState } from "react";
import { SEED_CAMPAIGN_FUNNELS } from "@/lib/seed/analytics-seed";
import { CampaignFunnelItem, FunnelStage } from "@/types/analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Filter,
  TrendingDown,
  ArrowRight,
  DollarSign,
  Users,
  Target,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export function CampaignFunnelTab() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("cmp-01");

  const campaign =
    SEED_CAMPAIGN_FUNNELS.find((c) => c.campaignId === selectedCampaignId) ||
    SEED_CAMPAIGN_FUNNELS[0];

  return (
    <div className="space-y-6">
      {/* Campaign Selector Bar */}
      <div className="p-4 rounded-2xl border border-white/10 glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Filter className="h-4 w-4 text-[var(--brand-primary)]" />
            <span>Campaign Conversion Funnel & Stage Drop-off</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage-by-stage attrition metrics from initial impression through closed-won customer revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Campaign:</span>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="bg-slate-900 border border-white/15 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[var(--brand-primary)]"
          >
            {SEED_CAMPAIGN_FUNNELS.map((cmp) => (
              <option key={cmp.campaignId} value={cmp.campaignId}>
                {cmp.campaignName} ({cmp.brandName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaign Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Campaign Budget Spent</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            ${campaign.summary.totalSpend.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Channel ad delivery</span>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Attributed GMV Revenue</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            ${campaign.summary.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-500/80 font-mono">Closed conversions</span>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Campaign Blended ROAS</span>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
            {campaign.summary.blendedRoas}x
          </div>
          <span className="text-[10px] text-cyan-500/80 font-mono">Gross revenue ÷ spend</span>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Lead-to-Customer Win Rate</span>
          <div className="text-xl font-bold text-indigo-400 font-mono mt-1">
            {campaign.summary.leadToCustomerRate}%
          </div>
          <span className="text-[10px] text-indigo-400/80 font-mono">Lead capture to closed contract</span>
        </div>
      </div>

      {/* Visual Interactive Funnel */}
      <div className="p-6 rounded-2xl border border-white/10 glass-card space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{campaign.campaignName}</span>
              <Badge variant="brand" size="sm">{campaign.objective}</Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizing attrition barriers across the 6 journey stages.
            </p>
          </div>
        </div>

        {/* Funnel Stage Horizontal Sequence with Annotated Drop-offs */}
        <div className="space-y-4">
          {campaign.stages.map((stage, idx) => {
            const nextStage = campaign.stages[idx + 1];
            // Calculate width percentage relative to stage 0
            const maxCount = campaign.stages[0].count;
            const pctOfMax = stage.key === "revenue" ? 8 : Math.max(8, (stage.count / maxCount) * 100);

            // Dynamic color gradient based on stage depth
            const colors = [
              "bg-indigo-600",
              "bg-blue-600",
              "bg-cyan-600",
              "bg-teal-600",
              "bg-emerald-600",
              "bg-emerald-500",
            ];

            return (
              <div key={stage.key} className="space-y-2">
                {/* Stage Row */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:w-56 flex-shrink-0">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        {stage.name}
                      </div>
                      <div className="text-sm font-extrabold text-white font-mono">
                        {stage.label}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Bar Graphic */}
                  <div className="flex-1 bg-slate-950 h-5 rounded-lg overflow-hidden border border-white/5 relative flex items-center">
                    <div
                      className={`h-full ${colors[idx % colors.length]} transition-all duration-500 rounded-r-md`}
                      style={{ width: `${pctOfMax}%` }}
                    />
                    <span className="absolute right-3 text-[10px] font-mono text-slate-400 font-bold">
                      {stage.key === "impressions"
                        ? "100% Entry"
                        : `${stage.conversionRate}% Overall Conversion`}
                    </span>
                  </div>
                </div>

                {/* Drop-off Annotation Pill between stages */}
                {nextStage && nextStage.dropOffRate !== undefined && nextStage.dropOffRate > 0 && (
                  <div className="flex items-center justify-center my-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-300">
                      <TrendingDown className="h-3 w-3 text-rose-400" />
                      <span>Stage Drop-off:</span>
                      <strong className="text-rose-400 font-bold">-{nextStage.dropOffRate}%</strong>
                      <span className="text-slate-400 text-[10px]">
                        ({(100 - nextStage.dropOffRate).toFixed(1)}% advance to {nextStage.name})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
