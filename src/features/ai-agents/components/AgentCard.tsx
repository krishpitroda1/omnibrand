"use client";

import React from "react";
import { AgentItem, AgentMode, AgentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  MessageCircle,
  PhoneCall,
  Target,
  Search,
  BarChart3,
  Compass,
  AlertOctagon,
  CheckCircle2,
  Settings,
  ChevronRight,
  TrendingUp,
  Zap,
} from "lucide-react";

interface AgentCardProps {
  agent: AgentItem;
  onUpdateMode: (agentId: string, mode: AgentMode) => void;
  onToggleStatus: (agentId: string) => void;
  onUpdateSpendCap: (agentId: string, cap: number) => void;
  onOpenDetail: (agent: AgentItem) => void;
}

const AGENT_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-5 w-5 text-amber-400" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
  Clock: <Clock className="h-5 w-5 text-blue-400" />,
  MessageCircle: <MessageCircle className="h-5 w-5 text-indigo-400" />,
  PhoneCall: <PhoneCall className="h-5 w-5 text-emerald-400" />,
  Target: <Target className="h-5 w-5 text-rose-400" />,
  Search: <Search className="h-5 w-5 text-cyan-400" />,
  BarChart3: <BarChart3 className="h-5 w-5 text-purple-400" />,
  Compass: <Compass className="h-5 w-5 text-teal-400" />,
};

export function AgentCard({
  agent,
  onUpdateMode,
  onToggleStatus,
  onUpdateSpendCap,
  onOpenDetail,
}: AgentCardProps) {
  const isSpendCapReached = agent.spendToday >= agent.spendCapDaily;
  const isNearCap = !isSpendCapReached && agent.spendToday >= agent.spendCapDaily * 0.9;
  const isPaused = agent.status === "PAUSED";
  const isHumanOnly = agent.mode === "HUMAN_ONLY";

  const spendPct = Math.min(100, Math.round((agent.spendToday / agent.spendCapDaily) * 100));

  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-xl flex flex-col justify-between transition-all shadow-xl relative overflow-hidden ${
        isSpendCapReached
          ? "border-red-500/40 bg-red-950/20"
          : isPaused
          ? "border-white/10 bg-slate-900/40 opacity-75"
          : "border-white/10 bg-slate-900/60 hover:border-white/20 hover:shadow-2xl"
      }`}
    >
      {/* Top Banner if Spend Cap Reached */}
      {isSpendCapReached && (
        <div className="absolute top-0 inset-x-0 bg-red-600/90 py-1 px-3 text-center text-[10px] font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1 shadow-md z-10">
          <AlertOctagon className="h-3 w-3" />
          <span>Daily Spend Cap Exceeded — Agent Auto-Disabled</span>
        </div>
      )}

      {/* Human Only Mode Notice */}
      {!isSpendCapReached && isHumanOnly && (
        <div className="absolute top-0 inset-x-0 bg-amber-500/90 py-0.5 px-3 text-center text-[10px] font-bold text-slate-950 uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm z-10">
          <ShieldCheck className="h-3 w-3" />
          <span>Human-Only Mode: All Actions Escalate to Inbox</span>
        </div>
      )}

      <div className={`space-y-4 ${isSpendCapReached || isHumanOnly ? "pt-3" : ""}`}>
        {/* Header: Icon, Name, Status Toggle */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 shrink-0">
              {AGENT_ICONS[agent.iconName] || <Sparkles className="h-5 w-5 text-amber-400" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>{agent.name}</span>
              </h3>
              <p className="text-[11px] text-[var(--brand-primary)] font-medium">
                {agent.role}
              </p>
            </div>
          </div>

          {/* Status Toggle Switch */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSpendCapReached}
              onClick={() => onToggleStatus(agent.id)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                isSpendCapReached
                  ? "border-red-500/40 bg-red-950/60 text-red-300 cursor-not-allowed"
                  : agent.status === "ACTIVE"
                  ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40"
                  : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {isSpendCapReached ? "DISABLED" : agent.status}
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 min-h-[32px]">
          {agent.description}
        </p>

        {/* Mode Selector (AUTO | AI_PLUS_HUMAN | HUMAN_ONLY) */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Operating Mode</span>
            <span className="text-[10px] text-slate-500 font-normal">
              {agent.mode === "AUTO"
                ? "Full Autonomous"
                : agent.mode === "AI_PLUS_HUMAN"
                ? "Guardrail Escalation"
                : "100% Human Review"}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5">
            {(["AUTO", "AI_PLUS_HUMAN", "HUMAN_ONLY"] as AgentMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onUpdateMode(agent.id, m)}
                className={`py-1 text-[10px] font-semibold rounded-lg transition-all text-center ${
                  agent.mode === m
                    ? m === "HUMAN_ONLY"
                      ? "bg-amber-500 text-slate-950 font-bold shadow"
                      : "bg-[var(--brand-primary)] text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m === "AUTO" ? "Auto" : m === "AI_PLUS_HUMAN" ? "AI + Human" : "Human Only"}
              </button>
            ))}
          </div>
        </div>

        {/* Spend Cap Meter & Input */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Daily Spend Cap</span>
            <span className="font-mono text-slate-200 text-[11px]">
              {agent.spendToday.toLocaleString()} / {agent.spendCapDaily.toLocaleString()} credits
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-300 ${
                isSpendCapReached
                  ? "bg-red-500"
                  : isNearCap
                  ? "bg-amber-400"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400"
              }`}
              style={{ width: `${spendPct}%` }}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-500">Cap Limit:</span>
            <input
              type="number"
              step="500"
              min="1000"
              max="50000"
              value={agent.spendCapDaily}
              onChange={(e) => onUpdateSpendCap(agent.id, parseInt(e.target.value) || 1000)}
              className="bg-slate-950 border border-white/10 rounded-lg px-2 py-0.5 text-[11px] font-mono text-white w-24 text-right focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            />
            <span className="text-[10px] text-slate-500">credits/day</span>
          </div>
        </div>

        {/* Metric Badges: Runs Today, Success Rate, Last Run */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
          <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Runs Today</span>
            <span className="text-xs font-bold text-white font-mono mt-0.5 block">
              {agent.runsToday}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Success</span>
            <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">
              {agent.successRate}%
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Last Run</span>
            <span className="text-[10px] text-slate-300 font-mono mt-0.5 block truncate">
              {agent.lastRunAt
                ? new Date(agent.lastRunAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Idle"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Detail Button */}
      <div className="pt-4 border-t border-white/10 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenDetail(agent)}
          className="w-full border-white/10 hover:bg-white/5 text-xs text-slate-300 flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Audit & Configure</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
        </Button>
      </div>
    </div>
  );
}
