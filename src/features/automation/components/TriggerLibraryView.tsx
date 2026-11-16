"use client";

import React from "react";
import { TriggerCardItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  MessageSquare,
  Mail,
  QrCode,
  FileCheck,
  Search,
  ArrowRight,
  Zap,
} from "lucide-react";

interface TriggerLibraryViewProps {
  triggers: TriggerCardItem[];
  onCreateWithTrigger: (trigger: TriggerCardItem) => void;
}

const TRIGGER_ICONS: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="h-5 w-5 text-rose-400" />,
  Facebook: <Facebook className="h-5 w-5 text-blue-500" />,
  Linkedin: <Linkedin className="h-5 w-5 text-blue-400" />,
  Globe: <Globe className="h-5 w-5 text-cyan-400" />,
  MessageSquare: <MessageSquare className="h-5 w-5 text-emerald-400" />,
  Mail: <Mail className="h-5 w-5 text-indigo-400" />,
  QrCode: <QrCode className="h-5 w-5 text-amber-400" />,
  FileCheck: <FileCheck className="h-5 w-5 text-teal-400" />,
  Search: <Search className="h-5 w-5 text-amber-400" />,
};

export function TriggerLibraryView({
  triggers,
  onCreateWithTrigger,
}: TriggerLibraryViewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-5 w-5 text-[var(--brand-primary)]" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Universal Omnichannel Trigger Library
          </h3>
          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono">
            9 Canonical Triggers
          </Badge>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl">
          Real-time webhook events and inbound sensors. Any of these triggers can initiate visual customer journeys, autonomous agent executions, or rule-based carrier dispatches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {triggers.map((trg) => (
          <div
            key={trg.id}
            className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between group hover:border-[var(--brand-primary)]/40 hover:shadow-2xl transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 shrink-0">
                  {TRIGGER_ICONS[trg.iconName] || <Zap className="h-5 w-5 text-amber-400" />}
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono border-white/10 text-slate-400 bg-slate-950/60"
                >
                  {trg.category}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-[var(--brand-primary)] transition-colors">
                  {trg.name}
                </h4>
                <div className="text-[11px] text-[var(--brand-primary)] font-mono mt-0.5">
                  Channel: {trg.channel}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                {trg.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4">
              <Button
                onClick={() => onCreateWithTrigger(trg)}
                className="w-full bg-white/10 hover:bg-[var(--brand-primary)] hover:text-white text-slate-200 text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Create Automation</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
