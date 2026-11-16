"use client";

import React from "react";
import { ChannelStatusInfo } from "@/lib/mock-data/omnichannel";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Smartphone,
  Phone,
  Mail,
  Bell,
  Activity,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface ChannelStatusBoardProps {
  channels: ChannelStatusInfo[];
}

export function ChannelStatusBoard({ channels }: ChannelStatusBoardProps) {
  const getIcon = (ch: string) => {
    switch (ch) {
      case "WHATSAPP":
        return MessageSquare;
      case "RCS":
        return Smartphone;
      case "SMS":
        return Radio;
      case "VOICE":
        return Phone;
      case "EMAIL":
        return Mail;
      case "WEB_PUSH":
        return Bell;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-[var(--brand-primary)]" />
            <span>Channel Status Board & Gateway Health</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time throughput, delivery success metrics, and credit quotas powered by SMSCloud Hub.
          </p>
        </div>
        <Badge variant="success" size="sm">All Systems Operational</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((item) => {
          const Icon = getIcon(item.channel);
          const isHealthy = item.health === "HEALTHY";

          return (
            <div
              key={item.channel}
              className="p-5 rounded-2xl border border-white/10 glass-card space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--brand-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{item.provider}</p>
                    </div>
                  </div>

                  <Badge variant={isHealthy ? "success" : "danger"} size="sm">
                    {item.health}
                  </Badge>
                </div>

                {/* Telemetry numbers */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Delivery Success Rate:</span>
                    <span className="font-mono font-bold text-emerald-400">{item.deliveryRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Today&apos;s Ingested Volume:</span>
                    <span className="font-mono text-white">{formatNumber(item.throughputToday)} msgs</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Remaining Balance:</span>
                    <span className="font-mono text-white">{formatNumber(item.creditsRemaining)} credits</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Round-trip Latency:</span>
                    <span className="font-mono text-slate-300">{item.latencyMs}ms</span>
                  </div>
                </div>

                {item.restrictionsNote && (
                  <p className="mt-3 text-[10px] text-amber-300/80 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 leading-relaxed">
                    ⚠️ {item.restrictionsNote}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                <span>Unit Cost: ${item.costPerUnit} / dispatch</span>
                <span className="text-emerald-400 font-mono">10DLC &bull; WABA Certified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
