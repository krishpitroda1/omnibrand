"use client";

import React from "react";
import { IntegrationRegistryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Webhook,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface IntegrationRegistryViewProps {
  integrations: IntegrationRegistryItem[];
}

export function IntegrationRegistryView({
  integrations,
}: IntegrationRegistryViewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Webhook className="h-5 w-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Webhook Registry & Ingress Health Matrix
          </h3>
          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono">
            6 Connected Endpoints
          </Badge>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl">
          Monitored remote webhook listeners, active rate-limit ceilings, and live carrier heartbeat latencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((reg) => (
          <div
            key={reg.id}
            className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{reg.name}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {reg.category}
                  </span>
                </div>
                <Badge
                  className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]"
                >
                  {reg.healthStatus}
                </Badge>
              </div>

              {/* Webhook endpoint URL */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Ingress Webhook URI
                </span>
                <div className="text-[11px] font-mono text-cyan-300 truncate">
                  {reg.webhookUrl}
                </div>
              </div>

              {/* Rate limit & telemetry */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5">
                  <span className="text-slate-500 block text-[10px]">Rate Limit</span>
                  <span className="font-semibold text-white font-mono">{reg.rateLimit}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5">
                  <span className="text-slate-500 block text-[10px]">Current Load</span>
                  <span className="font-semibold text-emerald-400 font-mono truncate block">{reg.currentUsage}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-[10px]">
                <Activity className="h-3 w-3 text-emerald-400" />
                {reg.lastHeartbeat}
              </span>
              <span className="text-slate-500">Provider: {reg.provider}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
