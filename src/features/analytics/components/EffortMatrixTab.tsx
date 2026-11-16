"use client";

import React, { useState } from "react";
import {
  SEED_EFFORT_ACTIVITIES,
  classifyEffortQuadrant,
} from "@/lib/seed/analytics-seed";
import { EffortLogActivity, MatrixQuadrant } from "@/types/analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Bot,
  ArrowUpRight,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Sliders,
} from "lucide-react";

export function EffortMatrixTab() {
  const [selectedActivity, setSelectedActivity] = useState<EffortLogActivity | null>(null);
  const [hoveredActivity, setHoveredActivity] = useState<EffortLogActivity | null>(null);
  const [filterQuadrant, setFilterQuadrant] = useState<MatrixQuadrant | "ALL">("ALL");

  // Filter activities
  const filteredActivities = SEED_EFFORT_ACTIVITIES.filter((act) => {
    if (filterQuadrant === "ALL") return true;
    return act.quadrant === filterQuadrant;
  });

  const getQuadrantBadge = (quadrant: MatrixQuadrant) => {
    switch (quadrant) {
      case "CONTINUE_INVESTING":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Continue Investing
          </span>
        );
      case "OPTIMISE_OR_AUTOMATE":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Optimise or Automate
          </span>
        );
      case "SCALE_IMMEDIATELY":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            Scale Immediately
          </span>
        );
      case "RECONSIDER":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Reconsider
          </span>
        );
    }
  };

  // Convert hours (0 to 100) and ROI (0 to 700%) to SVG coordinates in 600x440 viewport
  const mapCoords = (hours: number, roi: number) => {
    const minHours = 0;
    const maxHours = 100;
    const minRoi = 0;
    const maxRoi = 720;

    // X axis: Total Effort Hours (0 -> 100)
    // Left padding = 60, Right padding = 40, width = 500
    const x = 60 + (Math.min(maxHours, Math.max(minHours, hours)) / maxHours) * 500;

    // Y axis: Attributed ROI (0% -> 720%), inverted because SVG Y increases downward
    // Top padding = 40, Bottom padding = 60, height = 340
    const y = 40 + (1 - Math.min(maxRoi, Math.max(minRoi, roi)) / maxRoi) * 340;

    return { x, y };
  };

  // Threshold divider lines:
  // Effort threshold = 30 hours
  // ROI threshold = 250%
  const thresholdX = 60 + (30 / 100) * 500; // 210
  const thresholdY = 40 + (1 - 250 / 720) * 340; // ~222

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-[var(--brand-primary)]" />
              <span>Effort vs. Outcome Matrix</span>
            </h2>
            <Badge variant="brand" size="sm">Signature Feature</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            2×2 strategic matrix plotting marketing labor hours against attributed revenue return. Hover for inputs; click any node for AI delegation blueprints.
          </p>
        </div>

        {/* Quadrant Quick Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setFilterQuadrant("ALL")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterQuadrant === "ALL" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            All (16)
          </button>
          <button
            onClick={() => setFilterQuadrant("SCALE_IMMEDIATELY")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterQuadrant === "SCALE_IMMEDIATELY" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-cyan-400"
            }`}
          >
            Scale Immediately (4)
          </button>
          <button
            onClick={() => setFilterQuadrant("CONTINUE_INVESTING")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterQuadrant === "CONTINUE_INVESTING" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-emerald-400"
            }`}
          >
            Continue Investing (4)
          </button>
          <button
            onClick={() => setFilterQuadrant("OPTIMISE_OR_AUTOMATE")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterQuadrant === "OPTIMISE_OR_AUTOMATE" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:text-amber-400"
            }`}
          >
            Optimise/Automate (4)
          </button>
          <button
            onClick={() => setFilterQuadrant("RECONSIDER")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterQuadrant === "RECONSIDER" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "text-slate-400 hover:text-rose-400"
            }`}
          >
            Reconsider (4)
          </button>
        </div>
      </div>

      {/* 2x2 Scatter Plot Canvas */}
      <div className="p-6 rounded-2xl border border-white/10 glass-card relative overflow-hidden">
        <div className="relative w-full aspect-[16/10] max-h-[520px] select-none">
          <svg viewBox="0 0 600 440" className="w-full h-full">
            {/* Quadrant Background Zones */}
            {/* Top-Left: Low Effort / High ROI -> SCALE IMMEDIATELY */}
            <rect
              x="60"
              y="40"
              width={thresholdX - 60}
              height={thresholdY - 40}
              fill="#06B6D4"
              fillOpacity="0.05"
            />
            {/* Top-Right: High Effort / High ROI -> CONTINUE INVESTING */}
            <rect
              x={thresholdX}
              y="40"
              width={560 - thresholdX}
              height={thresholdY - 40}
              fill="#10B981"
              fillOpacity="0.06"
            />
            {/* Bottom-Left: Low Effort / Low ROI -> RECONSIDER */}
            <rect
              x="60"
              y={thresholdY}
              width={thresholdX - 60}
              height={380 - thresholdY}
              fill="#F43F5E"
              fillOpacity="0.05"
            />
            {/* Bottom-Right: High Effort / Low ROI -> OPTIMISE OR AUTOMATE */}
            <rect
              x={thresholdX}
              y={thresholdY}
              width={560 - thresholdX}
              height={380 - thresholdY}
              fill="#F59E0B"
              fillOpacity="0.06"
            />

            {/* Quadrant Watermark Labels */}
            <text x="75" y="65" fill="#22D3EE" fontSize="12" fontWeight="bold" opacity="0.85">
              🚀 SCALE IMMEDIATELY
            </text>
            <text x="75" y="80" fill="#94A3B8" fontSize="9" opacity="0.8">
              (Low Effort &lt;30h / High ROI &ge;250%)
            </text>

            <text x="360" y="65" fill="#34D399" fontSize="12" fontWeight="bold" opacity="0.85">
              💎 CONTINUE INVESTING
            </text>
            <text x="360" y="80" fill="#94A3B8" fontSize="9" opacity="0.8">
              (High Effort &ge;30h / High ROI &ge;250%)
            </text>

            <text x="75" y="340" fill="#FB7185" fontSize="12" fontWeight="bold" opacity="0.85">
              ⚠️ RECONSIDER / DEFUND
            </text>
            <text x="75" y="355" fill="#94A3B8" fontSize="9" opacity="0.8">
              (Low Effort &lt;30h / Low ROI &lt;250%)
            </text>

            <text x="360" y="340" fill="#FBBF24" fontSize="12" fontWeight="bold" opacity="0.85">
              ⚙️ OPTIMISE OR AUTOMATE
            </text>
            <text x="360" y="355" fill="#94A3B8" fontSize="9" opacity="0.8">
              (High Effort &ge;30h / Low ROI &lt;250%)
            </text>

            {/* Threshold Dividing Lines */}
            <line
              x1={thresholdX}
              y1="40"
              x2={thresholdX}
              y2="380"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.35"
            />
            <line
              x1="60"
              y1={thresholdY}
              x2="560"
              y2={thresholdY}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.35"
            />

            {/* Axes */}
            <line x1="60" y1="380" x2="560" y2="380" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.5" />
            <line x1="60" y1="40" x2="60" y2="380" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.5" />

            {/* X-Axis Ticks & Labels */}
            <text x="60" y="398" fill="#64748B" fontSize="10" textAnchor="middle">0h</text>
            <text x={thresholdX} y="398" fill="#F59E0B" fontSize="10" textAnchor="middle" fontWeight="bold">30h (Threshold)</text>
            <text x="360" y="398" fill="#64748B" fontSize="10" textAnchor="middle">60h</text>
            <text x="560" y="398" fill="#64748B" fontSize="10" textAnchor="middle">100h</text>
            <text x="310" y="420" fill="#CBD5E1" fontSize="11" textAnchor="middle" fontWeight="bold">
              TOTAL MARKETING EFFORT (HOURS/MONTH) &rarr;
            </text>

            {/* Y-Axis Ticks & Labels */}
            <text x="50" y="384" fill="#64748B" fontSize="10" textAnchor="end">0%</text>
            <text x="50" y={thresholdY + 4} fill="#F59E0B" fontSize="10" textAnchor="end" fontWeight="bold">250%</text>
            <text x="50" y="145" fill="#64748B" fontSize="10" textAnchor="end">500%</text>
            <text x="50" y="48" fill="#64748B" fontSize="10" textAnchor="end">700%</text>
            <text
              x="-210"
              y="22"
              fill="#CBD5E1"
              fontSize="11"
              textAnchor="middle"
              fontWeight="bold"
              transform="rotate(-90)"
            >
              ATTRIBUTED MARKETING ROI (%) &rarr;
            </text>

            {/* Plotted Activity Nodes */}
            {filteredActivities.map((act) => {
              const { x, y } = mapCoords(act.totalEffortHours, act.attributedRoi);
              const isSelected = selectedActivity?.id === act.id;
              const isHovered = hoveredActivity?.id === act.id;

              // Node color by quadrant
              let nodeColor = "#10B981"; // Emerald
              if (act.quadrant === "SCALE_IMMEDIATELY") nodeColor = "#06B6D4"; // Cyan
              if (act.quadrant === "OPTIMISE_OR_AUTOMATE") nodeColor = "#F59E0B"; // Amber
              if (act.quadrant === "RECONSIDER") nodeColor = "#F43F5E"; // Rose

              return (
                <g
                  key={act.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedActivity(act)}
                  onMouseEnter={() => setHoveredActivity(act)}
                  onMouseLeave={() => setHoveredActivity(null)}
                >
                  {/* Outer pulse ring if hovered or selected */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill={nodeColor}
                      fillOpacity="0.25"
                      stroke={nodeColor}
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Main Node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? "9" : "7.5"}
                    fill={nodeColor}
                    stroke="#0F172A"
                    strokeWidth="2"
                    className="hover:scale-125 transition-transform"
                  />

                  {/* Label next to circle */}
                  <text
                    x={x + 10}
                    y={y + 3.5}
                    fill={isSelected ? "#FFFFFF" : "#E2E8F0"}
                    fontSize="9.5"
                    fontWeight={isSelected ? "bold" : "normal"}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {act.activityName.length > 24
                      ? `${act.activityName.substring(0, 24)}...`
                      : act.activityName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Live Hover Tooltip Popover (Bottom overlay) */}
        {hoveredActivity && (
          <div className="absolute bottom-4 left-6 right-6 p-3 rounded-xl bg-slate-950/95 border border-white/20 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs z-30 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{hoveredActivity.activityName}</span>
                {getQuadrantBadge(hoveredActivity.quadrant)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Channel: <strong className="text-slate-300">{hoveredActivity.channel}</strong> | Total Effort:{" "}
                <strong className="text-white font-mono">{hoveredActivity.totalEffortHours} hrs</strong> | Attributed ROI:{" "}
                <strong className="text-emerald-400 font-mono">+{hoveredActivity.attributedRoi}%</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 italic">Click node for AI action plan</span>
              <Button size="sm" variant="brand" onClick={() => setSelectedActivity(hoveredActivity)}>
                <Bot className="h-3.5 w-3.5" />
                <span>Open Recommendation</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendation Modal / Panel for Selected Activity */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--brand-primary)]" />
                <h3 className="text-base font-bold text-white">
                  Strategic AI Optimization Blueprint
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-semibold text-slate-200">{selectedActivity.activityName}</span>
                {getQuadrantBadge(selectedActivity.quadrant)}
              </div>
            </div>

            {/* Effort & Financial Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Total Hours</span>
                <div className="text-sm font-bold text-white">{selectedActivity.totalEffortHours} hrs/mo</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Attributed ROI</span>
                <div className="text-sm font-bold text-emerald-400">+{selectedActivity.attributedRoi}%</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Paid Spend</span>
                <div className="text-sm font-bold text-indigo-400">${selectedActivity.paidSpend.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Publishing Actions</span>
                <div className="text-sm font-bold text-cyan-400">{selectedActivity.publishingActions} posts</div>
              </div>
            </div>

            {/* Granular Hours Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Labor Breakdown:
              </span>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">
                  Content: {selectedActivity.contentCreationHours}h
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">
                  Design: {selectedActivity.designHours}h
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">
                  Video: {selectedActivity.videoProductionHours}h
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">
                  Responses: {selectedActivity.communityResponses} msgs
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">
                  Mgmt: {selectedActivity.campaignManagementHours}h
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">
                  SEO: {selectedActivity.seoWorkHours}h
                </span>
              </div>
            </div>

            {/* AI Recommendation & Reasoning Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-[var(--brand-primary)]/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-primary)]">
                <Bot className="h-4 w-4" />
                <span>Autonomous Agent Recommendation:</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-medium">
                &ldquo;{selectedActivity.aiRecommendation}&rdquo;
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Analytical Reasoning:</strong> {selectedActivity.reasoning}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Recommended Agent: <strong className="text-white">{selectedActivity.suggestedAgent}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedActivity(null)}>
                  Close
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => {
                    alert(`Created automated optimization task for ${selectedActivity.suggestedAgent}!`);
                    setSelectedActivity(null);
                  }}
                >
                  <Bot className="h-3.5 w-3.5 mr-1" />
                  <span>Execute Recommendation</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
