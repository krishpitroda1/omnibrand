"use client";

import React, { useState } from "react";
import {
  SEED_ATTRIBUTION_COMPARISON,
  SEED_TOP_20_JOURNEY_PATHS,
} from "@/lib/seed/analytics-seed";
import { AttributionModel, AttributionCreditItem, ConvertingPathItem } from "@/types/analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GitFork,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export function AttributionTab() {
  const [activeModel, setActiveModel] = useState<AttributionModel>("POSITION_BASED");

  // Descriptions of mathematical models
  const modelDescriptions: Record<AttributionModel, { title: string; math: string; bestFor: string }> = {
    FIRST_TOUCH: {
      title: "First Touch Attribution (100% Top-of-Funnel)",
      math: "100% of conversion revenue is awarded to the initial channel/creative that first introduced the contact to the brand.",
      bestFor: "Evaluating brand awareness campaigns, content discovery channels, and cold paid search.",
    },
    LAST_TOUCH: {
      title: "Last Touch Attribution (100% Direct Closing)",
      math: "100% of conversion revenue is awarded to the immediate final touchpoint before checkout or contract signing.",
      bestFor: "Measuring closing channels like WhatsApp 1-on-1 conversations, abandoned cart SMS, and retargeting ads.",
    },
    LINEAR: {
      title: "Linear Attribution (Equal Split Across All Touchpoints)",
      math: "Conversion revenue is divided equally across every recorded channel touchpoint in the customer journey.",
      bestFor: "Holistic marketing teams seeking to avoid channel bias and measure collective cross-channel momentum.",
    },
    POSITION_BASED: {
      title: "Position-Based / U-Shaped Attribution (40% First / 40% Last / 20% Middle)",
      math: "40% credit to the discovery touchpoint, 40% credit to the closing touchpoint, and remaining 20% divided among nurture steps.",
      bestFor: "Modern omnichannel B2B & high-consideration consumer journeys with multiple touchpoints.",
    },
  };

  // Helper to extract the currently active credit % and revenue for any channel item
  const getActiveMetrics = (item: AttributionCreditItem) => {
    switch (activeModel) {
      case "FIRST_TOUCH":
        return { credit: item.firstTouchCredit, revenue: item.firstTouchRevenue };
      case "LAST_TOUCH":
        return { credit: item.lastTouchCredit, revenue: item.lastTouchRevenue };
      case "LINEAR":
        return { credit: item.linearCredit, revenue: item.linearRevenue };
      case "POSITION_BASED":
        return { credit: item.positionBasedCredit, revenue: item.positionBasedRevenue };
    }
  };

  const totalCalculatedRevenue = SEED_ATTRIBUTION_COMPARISON.reduce(
    (acc, curr) => acc + getActiveMetrics(curr).revenue,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header & Interactive Model Selector Buttons */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GitFork className="h-5 w-5 text-[var(--brand-primary)]" />
              <span>Multi-Touch Attribution Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an algorithmic model below to dynamically recalculate channel revenue credit and pipeline weighting.
            </p>
          </div>
          <Badge variant="brand" size="sm">
            Active: {activeModel.replace("_", " ")}
          </Badge>
        </div>

        {/* 4 Interactive Model Toggle Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          {(
            [
              { id: "FIRST_TOUCH", label: "First Touch", sub: "100% Discovery" },
              { id: "LAST_TOUCH", label: "Last Touch", sub: "100% Closing" },
              { id: "LINEAR", label: "Linear", sub: "Equal Distribution" },
              { id: "POSITION_BASED", label: "Position Based", sub: "40 / 20 / 40 Split" },
            ] as const
          ).map((m) => {
            const isSelected = activeModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModel(m.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "bg-slate-900 border-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/10 ring-1 ring-[var(--brand-primary)]"
                    : "bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-slate-900/60"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-bl bg-[var(--brand-primary)]" />
                )}
                <div
                  className={`text-xs font-bold ${
                    isSelected ? "text-white" : "text-slate-300"
                  }`}
                >
                  {m.label}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {m.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Model Explanation Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Sparkles className="h-4 w-4 text-[var(--brand-primary)]" />
            <span>{modelDescriptions[activeModel].title}</span>
          </div>
          <p className="text-[11px] text-slate-300">
            <strong>Formula:</strong> {modelDescriptions[activeModel].math}
          </p>
          <p className="text-[11px] text-slate-400">
            <strong>Ideal Application:</strong> {modelDescriptions[activeModel].bestFor}
          </p>
        </div>
      </div>

      {/* Recalculated Credit Distribution Table */}
      <div className="rounded-2xl border border-white/10 glass-card overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Model Credit Shift & Revenue Re-allocation</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400">
            Total Reallocated Revenue: <strong>${totalCalculatedRevenue.toLocaleString()}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 text-[11px] font-mono">
                <th className="py-2.5 px-3">CHANNEL</th>
                <th
                  className={`py-2.5 px-3 text-right ${
                    activeModel === "FIRST_TOUCH"
                      ? "text-[var(--brand-primary)] font-bold bg-white/5 rounded-t"
                      : ""
                  }`}
                >
                  FIRST TOUCH
                </th>
                <th
                  className={`py-2.5 px-3 text-right ${
                    activeModel === "LAST_TOUCH"
                      ? "text-[var(--brand-primary)] font-bold bg-white/5 rounded-t"
                      : ""
                  }`}
                >
                  LAST TOUCH
                </th>
                <th
                  className={`py-2.5 px-3 text-right ${
                    activeModel === "LINEAR"
                      ? "text-[var(--brand-primary)] font-bold bg-white/5 rounded-t"
                      : ""
                  }`}
                >
                  LINEAR
                </th>
                <th
                  className={`py-2.5 px-3 text-right ${
                    activeModel === "POSITION_BASED"
                      ? "text-[var(--brand-primary)] font-bold bg-white/5 rounded-t"
                      : ""
                  }`}
                >
                  POSITION BASED (40/20/40)
                </th>
                <th className="py-2.5 px-4 text-right text-emerald-400 font-bold">
                  ACTIVE REVENUE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SEED_ATTRIBUTION_COMPARISON.map((row) => {
                const active = getActiveMetrics(row);
                return (
                  <tr key={row.channel} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: row.color }}
                        />
                        <span className="font-semibold text-white">{row.channel}</span>
                      </div>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono ${
                        activeModel === "FIRST_TOUCH"
                          ? "bg-[var(--brand-primary)]/10 text-white font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {row.firstTouchCredit.toFixed(1)}% (${(row.firstTouchRevenue / 1000).toFixed(1)}k)
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono ${
                        activeModel === "LAST_TOUCH"
                          ? "bg-[var(--brand-primary)]/10 text-white font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {row.lastTouchCredit.toFixed(1)}% (${(row.lastTouchRevenue / 1000).toFixed(1)}k)
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono ${
                        activeModel === "LINEAR"
                          ? "bg-[var(--brand-primary)]/10 text-white font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {row.linearCredit.toFixed(1)}% (${(row.linearRevenue / 1000).toFixed(1)}k)
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono ${
                        activeModel === "POSITION_BASED"
                          ? "bg-[var(--brand-primary)]/10 text-white font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {row.positionBasedCredit.toFixed(1)}% (${(row.positionBasedRevenue / 1000).toFixed(1)}k)
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 bg-emerald-500/5">
                      ${active.revenue.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 20 Converting Customer Journey Paths */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>Top 20 Multi-Channel Converting Journey Paths</span>
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated conversion sequences showing most effective channel progressions and latency to sale.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            20 Distinct Archetypes Ranked by Revenue
          </span>
        </div>

        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {SEED_TOP_20_JOURNEY_PATHS.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded bg-white/10 text-slate-300 flex items-center justify-center font-mono font-bold text-[10px]">
                  #{idx + 1}
                </span>

                {/* Path Step Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.path.map((step, stepIdx) => (
                    <React.Fragment key={stepIdx}>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          step === "Purchase" || step === "Direct Checkout"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : step.includes("WhatsApp")
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            : step.includes("Google")
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                            : step.includes("Instagram")
                            ? "bg-pink-500/10 text-pink-300 border border-pink-500/20"
                            : "bg-slate-800 text-slate-300 border border-white/10"
                        }`}
                      >
                        {step}
                      </span>
                      {stepIdx < item.path.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-slate-500" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Path Metrics */}
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-shrink-0">
                <div>
                  <span className="text-white font-bold">{item.conversionsCount}</span> conv.
                </div>
                <div className="text-slate-500">•</div>
                <div>
                  <span className="text-cyan-400 font-bold">{item.conversionRate}%</span> rate
                </div>
                <div className="text-slate-500">•</div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span>{item.avgDaysToConvert}d</span>
                </div>
                <div className="text-slate-500">•</div>
                <div className="text-emerald-400 font-bold">
                  ${item.attributedRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
