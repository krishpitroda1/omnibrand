"use client";

import React, { useState, useMemo } from "react";
import { useAppStore } from "@/store";
import {
  MOCK_AGENTS,
  MOCK_AGENT_RUNS,
  MOCK_ESCALATIONS,
} from "@/lib/mock-data/ai-agents";
import {
  AgentItem,
  AgentRunItem,
  AgentEscalationItem,
  AgentMode,
  AgentStatus,
} from "@/types";
import { AgentCard } from "@/features/ai-agents/components/AgentCard";
import { AgentDetailModal } from "@/features/ai-agents/components/AgentDetailModal";
import { EscalationInbox } from "@/features/ai-agents/components/EscalationInbox";
import { SpendCapBanner } from "@/features/ai-agents/components/SpendCapBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Brain,
  Inbox,
  Activity,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Search,
} from "lucide-react";

type AgentCentreTab = "ROSTER" | "ESCALATIONS" | "ACTIVITY";

export default function AiAgentCentrePage() {
  const { brands, activeBrandId } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const [agents, setAgents] = useState<AgentItem[]>(MOCK_AGENTS);
  const [runs, setRuns] = useState<AgentRunItem[]>(MOCK_AGENT_RUNS);
  const [escalations, setEscalations] = useState<AgentEscalationItem[]>(MOCK_ESCALATIONS);
  const [activeTab, setActiveTab] = useState<AgentCentreTab>("ROSTER");
  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  // Check which agents have reached their spend cap
  const cappedAgents = useMemo(() => {
    return agents.filter((a) => a.spendToday >= a.spendCapDaily);
  }, [agents]);

  // Total daily credit spend across all agents
  const totalDailyCredits = useMemo(() => {
    return agents.reduce((sum, a) => sum + a.spendToday, 0);
  }, [agents]);

  const totalDailyRuns = useMemo(() => {
    return agents.reduce((sum, a) => sum + a.runsToday, 0);
  }, [agents]);

  // Handlers
  const handleUpdateMode = (agentId: string, mode: AgentMode) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          return { ...a, mode, updatedAt: new Date().toISOString() };
        }
        return a;
      })
    );

    const targetAgent = agents.find((a) => a.id === agentId);
    if (mode === "HUMAN_ONLY" && targetAgent) {
      // Invariant: switching to HUMAN_ONLY routes next action to Escalation Inbox
      const newEscalation: AgentEscalationItem = {
        id: `esc-auto-${Date.now().toString().slice(-4)}`,
        workspaceId: targetAgent.workspaceId,
        agentId: targetAgent.id,
        agentName: targetAgent.name,
        agentType: targetAgent.type,
        title: `${targetAgent.name} Switched to HUMAN_ONLY Autonomy Mode`,
        context: `${targetAgent.name} initiated action proposal while in HUMAN_ONLY mode. Full human sign-off mandatory before wire dispatch.`,
        proposedAction: `Authorize standard ${targetAgent.name} operational queue flight with manual verification stamp.`,
        reason: "Agent Mode set to HUMAN_ONLY: Policy gate routed task to Escalation Inbox.",
        status: "PENDING",
        slaDeadline: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        slaMinutesRemaining: 60,
        createdAt: new Date().toISOString(),
      };
      setEscalations([newEscalation, ...escalations]);
      setActionAlert(
        `✓ ${targetAgent.name} switched to HUMAN_ONLY. Next action queued in Escalation Inbox.`
      );
      setTimeout(() => setActionAlert(null), 5000);
    } else {
      setActionAlert(`Updated ${targetAgent?.name} mode to ${mode}.`);
      setTimeout(() => setActionAlert(null), 3000);
    }
  };

  const handleToggleStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          const nextStatus: AgentStatus = a.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
          return { ...a, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return a;
      })
    );
  };

  const handleUpdateSpendCap = (agentId: string, cap: number) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          return { ...a, spendCapDaily: cap, updatedAt: new Date().toISOString() };
        }
        return a;
      })
    );
  };

  const handleIncreaseCap = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          const newCap = a.spendCapDaily + 2500;
          return {
            ...a,
            spendCapDaily: newCap,
            status: "ACTIVE",
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    setActionAlert(`Increased daily spend cap by +2,500 credits. Agent re-activated.`);
    setTimeout(() => setActionAlert(null), 4000);
  };

  // Escalation actions
  const handleApproveEscalation = (id: string) => {
    setEscalations((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: "APPROVED",
            resolvedAt: new Date().toISOString(),
            resolvedByName: "Elena Rostova",
          };
        }
        return e;
      })
    );
    setActionAlert("Action approved and queued for immediate flight dispatch.");
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleEditAndApproveEscalation = (id: string, editedAction: string) => {
    setEscalations((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: "EDITED_APPROVED",
            editedAction,
            resolvedAt: new Date().toISOString(),
            resolvedByName: "Elena Rostova",
          };
        }
        return e;
      })
    );
    setActionAlert("Action updated with editorial edits and authorized.");
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleRejectEscalation = (id: string, reason: string) => {
    setEscalations((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: "REJECTED",
            rejectionReason: reason,
            resolvedAt: new Date().toISOString(),
            resolvedByName: "Elena Rostova",
          };
        }
        return e;
      })
    );
    setActionAlert("Proposed action rejected and discarded.");
    setTimeout(() => setActionAlert(null), 3000);
  };

  const pendingEscalationsCount = escalations.filter((e) => e.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Bot className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>AI Agent Centre</span>
            </h1>
            <Badge variant="brand" size="sm">
              {activeBrand?.name}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Autonomous multi-agent orchestration engine. 9 specialized agents executing continuous creative synthesis, tone protection, schedule optimization, and customer engagement.
          </p>
        </div>

        {/* Global Fleet Telemetry */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">ACTIVE FLEET</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">9 Agents Configured</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">RUNS TODAY</div>
            <div className="text-xs font-bold text-sky-700 dark:text-cyan-400">{totalDailyRuns} Actions</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">DAILY CREDITS</div>
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
              {totalDailyCredits.toLocaleString()} cr
            </div>
          </div>
        </div>
      </div>

      {/* Spend Cap Reached Warning Banners */}
      <SpendCapBanner
        cappedAgents={cappedAgents}
        onIncreaseCap={handleIncreaseCap}
        onOpenDetail={(a) => setSelectedAgent(a)}
      />

      {/* Action Toast Alert */}
      {actionAlert && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("ROSTER")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "ROSTER"
              ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Bot className="h-4 w-4" />
          <span>Agent Roster</span>
          <span className="text-[10px] opacity-80 font-mono">9 Agents</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ESCALATIONS")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "ESCALATIONS"
              ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Inbox className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          <span>Escalation Inbox</span>
          {pendingEscalationsCount > 0 ? (
            <Badge className="bg-amber-500 text-white font-bold text-[10px] px-1.5 py-0">
              {pendingEscalationsCount}
            </Badge>
          ) : (
            <span className="text-[10px] font-mono text-slate-500">0</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ACTIVITY")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "ACTIVITY"
              ? "bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Global Telemetry Stream</span>
          <span className="text-[10px] opacity-80 font-mono">60 Runs</span>
        </button>
      </div>

      {/* TAB 1: AGENT ROSTER GRID (Exactly 9 Agents) */}
      {activeTab === "ROSTER" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onUpdateMode={handleUpdateMode}
              onToggleStatus={handleToggleStatus}
              onUpdateSpendCap={handleUpdateSpendCap}
              onOpenDetail={(a) => setSelectedAgent(a)}
            />
          ))}
        </div>
      )}

      {/* TAB 2: ESCALATION INBOX */}
      {activeTab === "ESCALATIONS" && (
        <EscalationInbox
          escalations={escalations}
          onApprove={handleApproveEscalation}
          onEditAndApprove={handleEditAndApproveEscalation}
          onReject={handleRejectEscalation}
        />
      )}

      {/* TAB 3: GLOBAL ACTIVITY STREAM */}
      {activeTab === "ACTIVITY" && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Real-Time Agent Execution Feed
              </h3>
              <p className="text-xs text-slate-400">
                Audited telemetry logs capturing input stimuli, AI reasoning duration, token burns, and approval routing.
              </p>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono text-xs">
              Live Stream Active
            </Badge>
          </div>

          <div className="space-y-3">
            {runs.slice(0, 15).map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-white/5 bg-slate-950/60 hover:border-white/15 transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-slate-300">
                      {r.agentName}
                    </Badge>
                    <span className="font-semibold text-white">{r.input}</span>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(r.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {r.outputSummary}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Tokens: {r.tokensUsed} • Credits: {r.creditsCost} cr • Latency: {r.durationMs}ms</span>
                  <span className="text-[var(--brand-primary)] font-sans">
                    Reasoning: {r.decisionExplanation.slice(0, 75)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Detail Modal (Tabs: Configuration, Activity Log, Decisions, Guardrails) */}
      <AgentDetailModal
        agent={selectedAgent}
        runs={runs}
        onClose={() => setSelectedAgent(null)}
        onUpdateMode={handleUpdateMode}
        onUpdateSpendCap={handleUpdateSpendCap}
      />
    </div>
  );
}
