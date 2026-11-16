"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Calendar,
  ShieldCheck,
  Zap,
  Info,
} from "lucide-react";
import { SEED_OVERVIEW_KPIS, SEED_DAILY_90_METRICS } from "@/lib/seed/analytics-seed";
import { DataQualityTag } from "@/types/analytics";

interface OverviewTabProps {
  activeBrandName: string;
}

export function OverviewTab({ activeBrandName }: OverviewTabProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("90d");

  // Multiplier depending on selected time range
  const multiplier = timeRange === "7d" ? 0.08 : timeRange === "30d" ? 0.33 : 1;

  // Render a mini SVG sparkline
  const renderSparkline = (points: number[], isPositive: boolean) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 110;
    const height = 32;

    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    const pathData = `M ${coords.join(" L ")}`;
    const strokeColor = isPositive ? "#10B981" : "#F43F5E";

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Glow point on last coordinate */}
        {coords.length > 0 && (
          <circle
            cx={coords[coords.length - 1].split(",")[0]}
            cy={coords[coords.length - 1].split(",")[1]}
            r="3.5"
            fill={strokeColor}
          />
        )}
      </svg>
    );
  };

  const getTagBadge = (tag: DataQualityTag) => {
    switch (tag) {
      case "ACTUAL":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30">
            ACTUAL
          </span>
        );
      case "ESTIMATED":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-amber-50 text-amber-900 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30">
            ESTIMATED
          </span>
        );
      case "MOCK":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30">
            MOCK
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Executive Performance & Unit Economics</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">({activeBrandName})</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Full-funnel financial metrics with multi-touch revenue attribution and certified data provenance.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-white/10">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeRange === range
                  ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              {range === "7d" ? "Last 7 Days" : range === "30d" ? "Last 30 Days" : "Last 90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Invariant Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-slate-900/90 border border-emerald-300 dark:border-emerald-500/30 flex items-start gap-3 text-xs text-slate-800 dark:text-slate-300 shadow-sm">
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-white">Data Integrity Classification Invariant:</span>
          <p className="text-[11px] text-slate-700 dark:text-slate-400 mt-0.5">
            Every metric reported in OmniBrand OS carries an explicit provenance tag:{" "}
            <strong className="text-emerald-800 dark:text-emerald-300">ACTUAL</strong> (verified first-party telemetry & bank/stripe ledger),{" "}
            <strong className="text-amber-800 dark:text-amber-300">ESTIMATED</strong> (statistical multi-touch projection), or{" "}
            <strong className="text-indigo-800 dark:text-indigo-300">MOCK</strong> (seed sandbox fixture).
          </p>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SEED_OVERVIEW_KPIS.map((kpi) => {
          // Adjust display values based on multiplier if absolute dollar/count
          let displayVal = kpi.value;
          if (timeRange !== "90d" && !kpi.value.includes("x") && !kpi.value.includes("%") && !kpi.value.includes(".")) {
            const raw = Math.round(kpi.numericValue * multiplier);
            displayVal = kpi.value.startsWith("$") ? `$${raw.toLocaleString()}` : raw.toLocaleString();
          }

          return (
            <div
              key={kpi.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 glass-card flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
                  {kpi.title}
                </span>
                {getTagBadge(kpi.dataQuality)}
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[var(--brand-primary)] transition-colors">
                    {displayVal}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`inline-flex items-center text-[11px] font-bold ${
                        kpi.isPositive ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {kpi.isPositive ? (
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-0.5" />
                      )}
                      {kpi.change}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {timeRange === "7d" ? "vs prior 7d" : timeRange === "30d" ? "vs prior 30d" : "vs prior 90d"}
                    </span>
                  </div>
                </div>

                <div className="pl-2">{renderSparkline(kpi.trend, kpi.isPositive)}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="truncate max-w-[190px]">{kpi.subtext}</span>
                <Info className="h-3 w-3 text-slate-400 hover:text-slate-700 dark:text-slate-600 dark:hover:text-slate-300 cursor-pointer flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 90-Day Macro Trajectory Chart: Marketing Spend vs Attributed Revenue */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>90-Day Revenue vs Ad Spend Trajectory</span>
            </h3>
            <p className="text-xs text-slate-400">
              Daily trend demonstrating compounding marketing efficiency and widening contribution margin.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Attributed Revenue ($368.4K)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-slate-300">Marketing Spend ($76.9K)</span>
            </div>
          </div>
        </div>

        {/* Visual Trend Bars (90-day aggregation buckets) */}
        <div className="h-48 w-full flex items-end gap-1 pt-6 pb-2 px-2 border-b border-white/10">
          {Array.from({ length: 45 }).map((_, idx) => {
            const dayIdx = idx * 2;
            const progress = dayIdx / 90;
            // Spend curve
            const spendHeight = 25 + progress * 15 + ((idx * 3) % 8);
            // Revenue curve
            const revHeight = 35 + progress * 55 + ((idx * 7) % 12);

            return (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-0.5 h-full group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/20 p-1.5 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                  <div className="text-emerald-400 font-bold">Rev: ${Math.round(revHeight * 95)}</div>
                  <div className="text-indigo-400">Spend: ${Math.round(spendHeight * 22)}</div>
                </div>

                <div
                  className="w-full bg-emerald-400/80 rounded-t-sm group-hover:bg-emerald-300 transition-colors"
                  style={{ height: `${revHeight}%` }}
                />
                <div
                  className="w-full bg-indigo-500/70 rounded-t-sm group-hover:bg-indigo-400 transition-colors"
                  style={{ height: `${spendHeight}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono px-2">
          <span>90 Days Ago</span>
          <span>45 Days Ago</span>
          <span>Today (Live)</span>
        </div>
      </div>
    </div>
  );
}
