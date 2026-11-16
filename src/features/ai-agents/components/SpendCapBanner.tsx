"use client";

import React from "react";
import { AgentItem } from "@/types";
import { AlertOctagon, ArrowUpRight, DollarSign, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpendCapBannerProps {
  cappedAgents: AgentItem[];
  onIncreaseCap: (agentId: string) => void;
  onOpenDetail: (agent: AgentItem) => void;
}

export function SpendCapBanner({
  cappedAgents,
  onIncreaseCap,
  onOpenDetail,
}: SpendCapBannerProps) {
  if (cappedAgents.length === 0) return null;

  return (
    <div className="space-y-2">
      {cappedAgents.map((agent) => (
        <div
          key={agent.id}
          className="rounded-2xl border border-red-500/50 bg-red-950/40 backdrop-blur-xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 shrink-0">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  Daily Spend Cap Reached: {agent.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                  DISABLED
                </span>
              </div>
              <p className="text-xs text-red-200/80 mt-0.5">
                Agent consumed {agent.spendToday.toLocaleString()} of {agent.spendCapDaily.toLocaleString()} allocated credits today. Autonomous operations have been paused to protect your budget limit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenDetail(agent)}
              className="border-red-500/30 text-xs text-red-200 hover:bg-red-950/60"
            >
              Audit Activity
            </Button>
            <Button
              size="sm"
              onClick={() => onIncreaseCap(agent.id)}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md"
            >
              + Increase Cap (+2,500 cr)
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
