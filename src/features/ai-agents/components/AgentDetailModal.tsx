"use client";

import React, { useState } from "react";
import { AgentItem, AgentRunItem, AgentMode } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Settings,
  History,
  Brain,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Zap,
  Info,
  Sliders,
  DollarSign,
  AlertOctagon,
} from "lucide-react";

interface AgentDetailModalProps {
  agent: AgentItem | null;
  runs: AgentRunItem[];
  onClose: () => void;
  onUpdateMode: (agentId: string, mode: AgentMode) => void;
  onUpdateSpendCap: (agentId: string, cap: number) => void;
}

type DetailTab = "CONFIGURATION" | "ACTIVITY_LOG" | "DECISIONS" | "GUARDRAILS";

export function AgentDetailModal({
  agent,
  runs,
  onClose,
  onUpdateMode,
  onUpdateSpendCap,
}: AgentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("DECISIONS");
  const [logFilter, setLogFilter] = useState<string>("ALL");
  const [decisionSearch, setDecisionSearch] = useState<string>("");

  if (!agent) return null;

  const agentRuns = runs.filter((r) => r.agentId === agent.id);

  const filteredRuns = agentRuns.filter((r) => {
    if (logFilter !== "ALL" && r.outcome !== logFilter) return false;
    return true;
  });

  const filteredDecisions = agentRuns.filter((r) => {
    if (!decisionSearch.trim()) return true;
    const q = decisionSearch.toLowerCase();
    return (
      r.input.toLowerCase().includes(q) ||
      r.decisionExplanation.toLowerCase().includes(q) ||
      r.whySuggested.toLowerCase().includes(q)
    );
  });

  const isSpendCapReached = agent.spendToday >= agent.spendCapDaily;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 text-blue-700 dark:text-[var(--brand-primary)]">
              <Brain className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {agent.name}
                </h2>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    agent.mode === "HUMAN_ONLY"
                      ? "border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 font-medium"
                      : "border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 font-medium"
                  }`}
                >
                  {agent.mode.replace("_", " ")}
                </Badge>
                {isSpendCapReached && (
                  <Badge className="bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/40 text-xs font-semibold">
                    CAP REACHED
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {agent.role} • Success Rate: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{agent.successRate}%</strong> • Daily Runs: <strong className="text-slate-900 dark:text-white font-mono">{agent.runsToday}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 px-5 pt-3 bg-slate-50/50 dark:bg-slate-950/40">
          {(
            [
              { id: "DECISIONS", label: "Decisions & 'Why' Engine", icon: Brain },
              { id: "ACTIVITY_LOG", label: `Activity Log (${agentRuns.length})`, icon: History },
              { id: "CONFIGURATION", label: "Configuration & Limits", icon: Sliders },
              { id: "GUARDRAILS", label: "Enforced Guardrails", icon: ShieldCheck },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === t.id
                    ? "border-[var(--brand-primary)] text-blue-700 dark:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 max-h-[62vh]">
          {/* TAB 1: DECISIONS (Never a black box) */}
          {activeTab === "DECISIONS" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--brand-primary)]" />
                  <span className="text-xs font-semibold text-white">
                    Transparent Reasoning Architecture
                  </span>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search rationale..."
                    value={decisionSearch}
                    onChange={(e) => setDecisionSearch(e.target.value)}
                    className="w-full pl-8 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredDecisions.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No decisions found matching search query.
                  </div>
                ) : (
                  filteredDecisions.map((run) => (
                    <div
                      key={run.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 space-y-3 shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-[10px] ${
                              run.outcome === "SUCCESS"
                                ? "bg-emerald-950/70 border-emerald-500/30 text-emerald-300"
                                : run.outcome === "ESCALATED"
                                ? "bg-amber-950/70 border-amber-500/30 text-amber-300"
                                : "bg-red-950/70 border-red-500/30 text-red-300"
                            }`}
                          >
                            {run.outcome}
                          </Badge>
                          <span className="text-xs font-mono text-slate-400">
                            {run.id} • {new Date(run.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {run.creditsCost} credits ({run.durationMs}ms)
                        </span>
                      </div>

                      {/* Input */}
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-mono text-slate-400">
                          Trigger Input
                        </div>
                        <div className="text-xs text-slate-200 font-medium bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                          {run.input}
                        </div>
                      </div>

                      {/* Plain-Language Explanation */}
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-mono text-[var(--brand-primary)]">
                          Autonomous Decision Rationale
                        </div>
                        <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                          {run.decisionExplanation}
                        </div>
                      </div>

                      {/* Why this was suggested panel */}
                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
                        <div className="font-semibold text-cyan-300 flex items-center gap-1.5 text-[11px]">
                          <Info className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Why this was suggested by AI</span>
                        </div>
                        <p className="leading-relaxed text-[11px] text-cyan-200/90">
                          {run.whySuggested}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY LOG */}
          {activeTab === "ACTIVITY_LOG" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs text-slate-400">Execution Telemetry</span>
                <select
                  aria-label="Filter by Outcome"
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white"
                >
                  <option value="ALL">All Outcomes</option>
                  <option value="SUCCESS">Success Only</option>
                  <option value="ESCALATED">Escalated Only</option>
                  <option value="FAILED">Failed / Blocked</option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 overflow-hidden shadow">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/60 text-[10px] font-semibold uppercase text-slate-400">
                      <th className="py-2.5 px-3">Run ID</th>
                      <th className="py-2.5 px-3">Action Summary</th>
                      <th className="py-2.5 px-3">Outcome</th>
                      <th className="py-2.5 px-3 text-right">Tokens / Credits</th>
                      <th className="py-2.5 px-3 text-right">Latency</th>
                      <th className="py-2.5 px-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRuns.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{r.id}</td>
                        <td className="py-2.5 px-3 text-slate-200 truncate max-w-xs font-medium">
                          {r.outputSummary}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge
                            className={`text-[9px] ${
                              r.outcome === "SUCCESS"
                                ? "bg-emerald-950/70 border-emerald-500/30 text-emerald-300"
                                : r.outcome === "ESCALATED"
                                ? "bg-amber-950/70 border-amber-500/30 text-amber-300"
                                : "bg-red-950/70 border-red-500/30 text-red-300"
                            }`}
                          >
                            {r.outcome}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                          {r.tokensUsed} / {r.creditsCost} cr
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                          {r.durationMs}ms
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">
                          {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIGURATION */}
          {activeTab === "CONFIGURATION" && (
            <div className="space-y-5">
              {/* Operating Mode */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Autonomy Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["AUTO", "AI_PLUS_HUMAN", "HUMAN_ONLY"] as AgentMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onUpdateMode(agent.id, m)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                        agent.mode === m
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/20 text-white shadow-sm"
                          : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="font-bold">{m.replace("_", " ")}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {m === "AUTO"
                          ? "Full execution without human gate"
                          : m === "AI_PLUS_HUMAN"
                          ? "Escalates when thresholds breach"
                          : "Routes 100% of actions to Inbox"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spend Cap */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Daily Spend Cap & Ceiling
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    max="50000"
                    value={agent.spendCapDaily}
                    onChange={(e) => onUpdateSpendCap(agent.id, parseInt(e.target.value) || 1000)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-white w-40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                  <span className="text-xs text-slate-400">AI Credits / Day</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  If this threshold is reached, the agent enters an automatic safety lockdown to protect the workspace budget.
                </p>
              </div>

              {/* Escalation Rules */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Active Escalation Triggers
                </label>
                <div className="space-y-2">
                  {agent.escalationRules.map((r, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{r.rule}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Condition: <span className="font-mono text-amber-300">{r.condition}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-300">
                        {r.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allowed Channels */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Allowed Channels Scope
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {agent.allowedChannels.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs border-white/10 bg-slate-900 text-slate-300">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GUARDRAILS */}
          {activeTab === "GUARDRAILS" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Non-negotiable compliance rules deterministically audited prior to any model completion or API transmission.
              </div>
              <div className="space-y-3">
                {agent.guardrails.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{g.name}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px]">
                          ENFORCED HARD GATE
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {g.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-end">
          <Button
            onClick={onClose}
            className="bg-[var(--brand-primary)] hover:brightness-110 text-white text-xs font-semibold px-5 py-2 rounded-xl"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
