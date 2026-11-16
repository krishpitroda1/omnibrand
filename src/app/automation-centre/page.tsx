"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import {
  MOCK_JOURNEYS,
  MOCK_TRIGGER_LIBRARY,
  MOCK_AUTOMATION_RULES,
  MOCK_EVENT_LOGS,
  MOCK_INTEGRATIONS_REGISTRY,
} from "@/lib/mock-data/automation";
import {
  JourneyItem,
  TriggerCardItem,
  AutomationRuleItem,
  EventLogItem,
  IntegrationRegistryItem,
} from "@/types";
import { JourneyCanvas } from "@/features/automation/components/JourneyCanvas";
import { TriggerLibraryView } from "@/features/automation/components/TriggerLibraryView";
import { RuleEngineView } from "@/features/automation/components/RuleEngineView";
import { EventLogViewer } from "@/features/automation/components/EventLogViewer";
import { IntegrationRegistryView } from "@/features/automation/components/IntegrationRegistryView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Workflow,
  Plus,
  Play,
  Pause,
  AlertTriangle,
  RotateCw,
  CheckCircle2,
  GitBranch,
  Zap,
  Sliders,
  Activity,
  Webhook,
  Sparkles,
  Layers,
} from "lucide-react";

type AutomationTab =
  | "JOURNEY_CANVAS"
  | "JOURNEY_LIST"
  | "TRIGGERS"
  | "RULES"
  | "EVENT_LOGS"
  | "INTEGRATIONS";

export default function AutomationCentrePage() {
  const { brands, activeBrandId } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const [journeys, setJourneys] = useState<JourneyItem[]>(MOCK_JOURNEYS);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("jrn-01-lead-nurture");
  const [rules, setRules] = useState<AutomationRuleItem[]>(MOCK_AUTOMATION_RULES);
  const [eventLogs, setEventLogs] = useState<EventLogItem[]>(MOCK_EVENT_LOGS);
  const [activeTab, setActiveTab] = useState<AutomationTab>("JOURNEY_CANVAS");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeJourney =
    journeys.find((j) => j.id === selectedJourneyId) || journeys[0];

  // Handlers
  const handleSaveJourney = (updatedJourney: JourneyItem) => {
    setJourneys((prev) =>
      prev.map((j) => (j.id === updatedJourney.id ? updatedJourney : j))
    );
    setToastMsg(`Saved draft for '${updatedJourney.name}'.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePublishJourney = (updatedJourney: JourneyItem) => {
    setJourneys((prev) => {
      const exists = prev.some((j) => j.id === updatedJourney.id);
      if (exists) {
        return prev.map((j) => (j.id === updatedJourney.id ? updatedJourney : j));
      }
      return [updatedJourney, ...prev];
    });
    setToastMsg(`✓ Validated & Published '${updatedJourney.name}'! Live in Active Journeys list.`);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const handlePauseJourney = (updatedJourney: JourneyItem) => {
    setJourneys((prev) =>
      prev.map((j) => (j.id === updatedJourney.id ? updatedJourney : j))
    );
    setToastMsg(`Paused journey '${updatedJourney.name}'.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateNewJourney = () => {
    const newId = `jrn-${Date.now().toString().slice(-4)}`;
    const newJourney: JourneyItem = {
      id: newId,
      workspaceId: "ws-growth-lab",
      brandId: activeBrand?.id || "brand-lumina",
      brandName: activeBrand?.name || "Lumina Creative",
      name: `New Custom Customer Flow #${journeys.length + 1}`,
      description: "Visual multi-channel orchestration sequence",
      status: "DRAFT",
      version: 1,
      triggerType: "WEBSITE_ENQUIRY",
      enrolledCount: 0,
      completedCount: 0,
      conversionRate: 0.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setJourneys([newJourney, ...journeys]);
    setSelectedJourneyId(newId);
    setActiveTab("JOURNEY_CANVAS");
    setToastMsg(`Created new journey draft '${newJourney.name}'.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateWithTrigger = (trigger: TriggerCardItem) => {
    const newId = `jrn-${Date.now().toString().slice(-4)}`;
    const newJourney: JourneyItem = {
      id: newId,
      workspaceId: "ws-growth-lab",
      brandId: activeBrand?.id || "brand-lumina",
      brandName: activeBrand?.name || "Lumina Creative",
      name: `${trigger.name} Flow`,
      description: `Sequence initiated by ${trigger.channel} trigger`,
      status: "DRAFT",
      version: 1,
      triggerType: trigger.triggerType,
      enrolledCount: 0,
      completedCount: 0,
      conversionRate: 0.0,
      canvasData: {
        nodes: [
          {
            id: "node-1",
            type: "triggerNode",
            position: { x: 250, y: 50 },
            data: { label: trigger.name, triggerType: trigger.triggerType },
          },
          {
            id: "node-2",
            type: "goalNode",
            position: { x: 250, y: 240 },
            data: { label: "Goal: Conversion Registered", targetMetric: "Goal Target" },
          },
        ],
        edges: [{ id: "e1-2", source: "node-1", target: "node-2" }],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setJourneys([newJourney, ...journeys]);
    setSelectedJourneyId(newId);
    setActiveTab("JOURNEY_CANVAS");
    setToastMsg(`Initialized Journey Canvas with trigger: '${trigger.name}'.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleRuleStatus = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const next = r.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          return { ...r, status: next };
        }
        return r;
      })
    );
  };

  // Requirement: Replaying a failed event marks it retried
  const handleReplayEvent = (eventId: string) => {
    setEventLogs((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            status: "RETRIED",
            retryCount: e.retryCount + 1,
            errorMessage: undefined,
            processedAt: new Date().toISOString(),
          };
        }
        return e;
      })
    );
    setToastMsg(`✓ Replayed event '${eventId}'. Marked as RETRIED and dispatched.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Workflow className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>Automation Centre & Journey Canvas</span>
            </h1>
            <Badge variant="brand" size="sm">
              {activeBrand?.name}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Visual node-based customer journey builder, trigger sensor library, rule engine, event stream telemetry, and DLQ replay.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={handleCreateNewJourney}
            className="bg-[var(--brand-primary)] hover:brightness-110 text-white text-xs font-semibold shadow-md"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Create New Journey</span>
          </Button>
        </div>
      </div>

      {toastMsg && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("JOURNEY_CANVAS")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "JOURNEY_CANVAS"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <GitBranch className="h-4 w-4" />
          <span>Visual Journey Canvas</span>
          <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40">
            react-flow
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("JOURNEY_LIST")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "JOURNEY_LIST"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Workflow className="h-4 w-4" />
          <span>Active Journeys</span>
          <span className="text-[10px] font-mono opacity-80">({journeys.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TRIGGERS")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "TRIGGERS"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Zap className="h-4 w-4 text-amber-500" />
          <span>Trigger Library</span>
          <span className="text-[10px] font-mono opacity-80">(9 Cards)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("RULES")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "RULES"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Rule Engine</span>
          <span className="text-[10px] font-mono opacity-80">({rules.length} Rules)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("EVENT_LOGS")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "EVENT_LOGS"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Event Stream & DLQ</span>
          <span className="text-[10px] font-mono opacity-80">({eventLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("INTEGRATIONS")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "INTEGRATIONS"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Webhook className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>Integration Registry</span>
          <span className="text-[10px] font-mono opacity-80">(6 Webhooks)</span>
        </button>
      </div>

      {/* TAB 1: VISUAL JOURNEY CANVAS */}
      {activeTab === "JOURNEY_CANVAS" && (
        <div className="space-y-4">
          {/* Journey Switcher Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs text-slate-400 font-semibold mr-1">Select Flow:</span>
            {journeys.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setSelectedJourneyId(j.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  selectedJourneyId === j.id
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/20 text-white shadow-sm"
                    : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white"
                }`}
              >
                {j.name} ({j.status})
              </button>
            ))}
          </div>

          <JourneyCanvas
            journey={activeJourney}
            onSaveJourney={handleSaveJourney}
            onPublishJourney={handlePublishJourney}
            onPauseJourney={handlePauseJourney}
          />
        </div>
      )}

      {/* TAB 2: ACTIVE JOURNEYS LIST */}
      {activeTab === "JOURNEY_LIST" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 shadow-xl flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Orchestration Journeys Catalog
              </h3>
              <p className="text-xs text-slate-400">
                Active lead nurturing, dormant re-engagement, and VIP on-site entrance flows.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {journeys.map((jrn) => (
              <div
                key={jrn.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        jrn.status === "PUBLISHED"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs"
                          : jrn.status === "PAUSED"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs"
                          : "bg-slate-800 text-slate-400 text-xs"
                      }
                    >
                      v{jrn.version}.0 • {jrn.status}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {jrn.triggerType}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {jrn.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {jrn.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Enrolled</span>
                      <span className="font-bold text-white font-mono mt-0.5 block">{jrn.enrolledCount}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Completed</span>
                      <span className="font-bold text-emerald-400 font-mono mt-0.5 block">{jrn.completedCount}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Conversion</span>
                      <span className="font-bold text-cyan-400 font-mono mt-0.5 block">{jrn.conversionRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedJourneyId(jrn.id);
                      setActiveTab("JOURNEY_CANVAS");
                    }}
                    className="w-full border-white/10 hover:bg-[var(--brand-primary)] hover:text-white text-xs h-8 text-slate-200"
                  >
                    Open in Canvas Editor
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRIGGER LIBRARY */}
      {activeTab === "TRIGGERS" && (
        <TriggerLibraryView
          triggers={MOCK_TRIGGER_LIBRARY}
          onCreateWithTrigger={handleCreateWithTrigger}
        />
      )}

      {/* TAB 4: RULE ENGINE */}
      {activeTab === "RULES" && (
        <RuleEngineView
          rules={rules}
          onToggleRuleStatus={handleToggleRuleStatus}
        />
      )}

      {/* TAB 5: EVENT LOGS STREAM & DLQ */}
      {activeTab === "EVENT_LOGS" && (
        <EventLogViewer
          events={eventLogs}
          onReplayEvent={handleReplayEvent}
        />
      )}

      {/* TAB 6: INTEGRATION REGISTRY */}
      {activeTab === "INTEGRATIONS" && (
        <IntegrationRegistryView
          integrations={MOCK_INTEGRATIONS_REGISTRY}
        />
      )}
    </div>
  );
}
