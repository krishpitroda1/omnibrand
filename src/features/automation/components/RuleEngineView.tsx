"use client";

import React, { useState } from "react";
import { AutomationRuleItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Sparkles,
  Search,
  Plus,
} from "lucide-react";

interface RuleEngineViewProps {
  rules: AutomationRuleItem[];
  onToggleRuleStatus: (ruleId: string) => void;
}

export function RuleEngineView({
  rules,
  onToggleRuleStatus,
}: RuleEngineViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [testSimulatingRule, setTestSimulatingRule] = useState<AutomationRuleItem | null>(null);
  const [simulationTrace, setSimulationTrace] = useState<{ step: string; status: string; detail: string }[] | null>(null);

  const filteredRules = rules.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.triggerLabel.toLowerCase().includes(q) ||
      r.actionLabel.toLowerCase().includes(q)
    );
  });

  const handleSimulateRule = (rule: AutomationRuleItem) => {
    setTestSimulatingRule(rule);
    setSimulationTrace([
      { step: "1. Webhook Ingest", status: "PASS", detail: `Simulated event stimulus: '${rule.triggerLabel}' received at ingress edge.` },
      { step: "2. Condition Evaluator", status: "PASS", detail: `Condition verified: '${rule.conditionText}' evaluated to TRUE.` },
      { step: "3. Compliance Policy Check", status: "PASS", detail: "Consent verified (OPTED_IN) & Daily spend cap balance checked." },
      { step: "4. Action Dispatcher", status: "PASS", detail: `Executing target action: '${rule.actionLabel}'. Wire latency: 22ms.` },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Rules Controls */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-[var(--brand-primary)]" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Event-Driven Rule Engine
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic &quot;When X then Y&quot; business logic executing across all connected integrations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs bg-slate-950 border-white/10 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Simulation Trace Modal / Card */}
      {testSimulatingRule && simulationTrace && (
        <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 backdrop-blur-xl p-5 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                Live Simulation Execution Trace: {testSimulatingRule.name}
              </h4>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setTestSimulatingRule(null);
                setSimulationTrace(null);
              }}
              className="text-cyan-300 hover:text-white text-xs h-7"
            >
              Close Trace
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {simulationTrace.map((st, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-cyan-500/20 bg-slate-950/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{st.step}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px]">
                    {st.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                  {st.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Rule Name</th>
              <th className="py-3 px-4">When (Trigger Event)</th>
              <th className="py-3 px-4">If (Condition)</th>
              <th className="py-3 px-4">Then (Action)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Executions</th>
              <th className="py-3 px-4 text-right">Test Simulation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-3 px-4 font-semibold text-white">
                  {rule.name}
                  <span className="block text-[10px] text-slate-500 font-mono">
                    ID: {rule.id}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-300 bg-amber-950/40">
                    {rule.triggerLabel}
                  </Badge>
                </td>

                <td className="py-3 px-4 font-mono text-[11px] text-slate-300 max-w-xs truncate">
                  {rule.conditionText}
                </td>

                <td className="py-3 px-4">
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-300 bg-emerald-950/40">
                    {rule.actionLabel}
                  </Badge>
                </td>

                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => onToggleRuleStatus(rule.id)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                      rule.status === "ACTIVE"
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                        : "border-slate-700 bg-slate-800 text-slate-400"
                    }`}
                  >
                    {rule.status}
                  </button>
                </td>

                <td className="py-3 px-4 text-right font-mono text-slate-300">
                  {rule.executionCount.toLocaleString()}
                </td>

                <td className="py-3 px-4 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSimulateRule(rule)}
                    className="border-white/10 hover:bg-cyan-950/40 hover:border-cyan-500/40 text-xs h-7 text-cyan-300"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    <span>Simulate</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
