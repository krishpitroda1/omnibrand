"use client";

import React, { useState } from "react";
import {
  SEED_CHANNEL_PERFORMANCE,
} from "@/lib/seed/analytics-seed";
import { ChannelPerformanceItem } from "@/types/analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  TrendingUp,
  DollarSign,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";

export function ChannelPerformanceTab() {
  const [data, setData] = useState<ChannelPerformanceItem[]>(SEED_CHANNEL_PERFORMANCE);
  const [sortBy, setSortBy] = useState<keyof ChannelPerformanceItem>("revenue");
  const [sortAsc, setSortAsc] = useState(false);

  const totalSpend = data.reduce((acc, curr) => acc + curr.spend, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalLeads = data.reduce((acc, curr) => acc + curr.leads, 0);
  const totalConversions = data.reduce((acc, curr) => acc + curr.conversions, 0);

  const handleSort = (key: keyof ChannelPerformanceItem) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(false);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header & Stacked Distribution Bars */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 glass-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-[var(--brand-primary)]" />
              <span>Omnichannel Capital Efficiency & Attribution Stack</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Comparative analysis across 9 primary channels with direct lead capture and acquisition telemetry.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-400">Total Spend: <strong className="text-slate-900 dark:text-white">${totalSpend.toLocaleString()}</strong></span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-400">Total Revenue: <strong className="text-emerald-700 dark:text-emerald-400">${totalRevenue.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Stacked Revenue Contribution Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-800 dark:text-slate-300 font-semibold">Revenue Attribution Mix by Channel</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">100% Normalized</span>
          </div>
          <div className="h-4 w-full rounded-lg overflow-hidden flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
            {data.map((c) => {
              const pct = (c.revenue / totalRevenue) * 100;
              return (
                <div
                  key={c.id}
                  style={{ width: `${pct}%`, backgroundColor: c.color }}
                  className="h-full relative group hover:opacity-90 transition-opacity cursor-pointer"
                  title={`${c.channel}: $${c.revenue.toLocaleString()} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          {/* Stacked Legend Chips */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {data.map((c) => (
              <div key={c.id} className="flex items-center gap-1.5 text-[11px]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{c.channel}</span>
                <span className="text-slate-500 font-mono text-[10px]">
                  {((c.revenue / totalRevenue) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Small Print Explaining ROAS vs ROI */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
        <Info className="h-4 w-4 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-white">Measurement Standard:</strong> Return on Ad Spend (
          <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">ROAS</span>) is calculated strictly as{" "}
          <span className="italic font-mono">attributed revenue ÷ ad spend</span>. In contrast, Marketing Return on Investment (
          <span className="text-sky-700 dark:text-cyan-400 font-bold font-mono">ROI</span>) accounts for total fully-loaded marketing expenditures (agency fees, creative production hours, platform seats) and underlying gross margin contribution. Both figures are presented side-by-side below.
        </p>
      </div>

      {/* Full Channels Performance Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950/80 text-slate-700 dark:text-slate-400 text-[11px] font-mono tracking-wider">
                <th className="py-3 px-4 font-semibold">CHANNEL</th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("spend")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>SPEND</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("impressions")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>IMPRESSIONS</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("clicks")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>CLICKS</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("leads")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>LEADS</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("conversions")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>CONVERSIONS</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("revenue")}>
                  <div className="flex items-center justify-end gap-1 text-emerald-400">
                    <span>REVENUE</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("cpl")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>CPL</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("cpa")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>CPA</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("roas")}>
                  <div className="flex items-center justify-end gap-1 text-emerald-400">
                    <span>ROAS</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort("roi")}>
                  <div className="flex items-center justify-end gap-1 text-cyan-400">
                    <span>ROI (%)</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-white">{item.channel}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                    ${item.spend.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                    {item.impressions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                    {item.clicks.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-200 font-semibold">
                    {item.leads.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-200 font-semibold">
                    {item.conversions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-emerald-400 font-bold">
                    ${item.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                    ${item.cpl.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                    ${item.cpa.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        item.roas >= 4
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : item.roas >= 2
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {item.roas.toFixed(2)}x
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        item.roi >= 200
                          ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                          : item.roi > 0
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {item.roi > 0 ? `+${item.roi.toFixed(1)}%` : `${item.roi.toFixed(1)}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-white/20 bg-slate-950 font-mono text-xs font-bold text-white">
                <td className="py-3.5 px-4">BLENDED TOTAL</td>
                <td className="py-3.5 px-3 text-right">${totalSpend.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right">3,494,000</td>
                <td className="py-3.5 px-3 text-right">248,850</td>
                <td className="py-3.5 px-3 text-right">{totalLeads.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right">{totalConversions.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right text-emerald-400">${totalRevenue.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right">$4.34</td>
                <td className="py-3.5 px-3 text-right">$90.95</td>
                <td className="py-3.5 px-3 text-right text-emerald-400">4.79x</td>
                <td className="py-3.5 px-4 text-right text-cyan-400">+278.4%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
