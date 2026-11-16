"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_CHANNELS_STATUS,
  MOCK_MESSAGE_TEMPLATES,
  MOCK_CONTACTS,
  MessageTemplateItem,
  ContactItem,
} from "@/lib/mock-data/omnichannel";
import { OmniChannel, ConsentStatus } from "@/types";
import { ChannelStatusBoard } from "@/features/omnichannel/components/ChannelStatusBoard";
import { TemplateLibrary } from "@/features/omnichannel/components/TemplateLibrary";
import { ConsentManager } from "@/features/omnichannel/components/ConsentManager";
import { DispatchPolicyGate } from "@/features/omnichannel/components/DispatchPolicyGate";
import { SendLogTable } from "@/features/omnichannel/components/SendLogTable";
import { ConversationWindowView } from "@/features/omnichannel/components/ConversationWindowView";
import {
  Radio,
  Layers,
  FileCheck2,
  ShieldCheck,
  ShieldAlert,
  Send,
  MessageSquare,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type HubTab =
  | "STATUS_BOARD"
  | "TEMPLATES"
  | "CONSENT"
  | "POLICY_GATE"
  | "SEND_LOG"
  | "CONVERSATIONS_24H";

export default function OmnichannelHubPage() {
  const { brands, activeBrandId } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const [activeTab, setActiveTab] = useState<HubTab>("STATUS_BOARD");
  const [templates, setTemplates] = useState<MessageTemplateItem[]>(
    MOCK_MESSAGE_TEMPLATES
  );
  const [contacts, setContacts] = useState<ContactItem[]>(MOCK_CONTACTS);

  // Template update handler
  const handleSaveTemplate = (updatedTpl: MessageTemplateItem) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === updatedTpl.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedTpl;
        return next;
      }
      return [updatedTpl, ...prev];
    });
  };

  // Consent override handler
  const handleUpdateConsent = (
    contactId: string,
    channel: OmniChannel,
    status: ConsentStatus,
    reason?: string
  ) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            channelConsents: {
              ...c.channelConsents,
              [channel]: {
                status,
                source: "MANUAL_COMPLIANCE_OVERRIDE",
                proofReference: `OVERRIDE_AUDIT_${Date.now()}`,
                manuallyOverridden: true,
                overrideReason: reason,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Radio className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>Omnichannel Messaging Hub</span>
            </h1>
            <Badge variant="brand" size="sm">
              {activeBrand?.name}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Unified telecommunication dispatch engine for WhatsApp Business API, RCS, A2P 10DLC SMS, Voice/IVR, and Email — strictly governed by consent verification & the WhatsApp 24-hour service window.
          </p>
        </div>

        {/* Global Hub KPIs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">DELIVERY RATE</div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">99.2% Verified</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">MESSAGING CREDITS</div>
            <div className="text-xs font-bold text-sky-700 dark:text-cyan-400">481,580 Units</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">POLICY GATE</div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Strict Lockdown</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("STATUS_BOARD")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "STATUS_BOARD"
              ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Channel Status Board</span>
          <span className="text-[10px] opacity-80 font-mono">6 Carriers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TEMPLATES")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "TEMPLATES"
              ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Template Library</span>
          <span className="text-[10px] opacity-80 font-mono">{templates.length} HSMs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("CONSENT")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "CONSENT"
              ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Consent Manager</span>
          <span className="text-[10px] opacity-80 font-mono">{contacts.length} Records</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("POLICY_GATE")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "POLICY_GATE"
              ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Dispatch Policy Gate</span>
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/10 font-bold">
            Rules Tester
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SEND_LOG")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "SEND_LOG"
              ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Live Send Log</span>
          <span className="text-[10px] opacity-80 font-mono">120 Dispatches</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("CONVERSATIONS_24H")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "CONVERSATIONS_24H"
              ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>24h Service Window</span>
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-300 text-amber-800 bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:bg-amber-500/10 font-bold">
            WABA Sandbox
          </Badge>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "STATUS_BOARD" && (
        <ChannelStatusBoard channels={MOCK_CHANNELS_STATUS} />
      )}

      {activeTab === "TEMPLATES" && (
        <TemplateLibrary
          templates={templates}
          onSaveTemplate={handleSaveTemplate}
        />
      )}

      {activeTab === "CONSENT" && (
        <ConsentManager
          contacts={contacts}
          onUpdateConsent={handleUpdateConsent}
        />
      )}

      {activeTab === "POLICY_GATE" && <DispatchPolicyGate />}

      {activeTab === "SEND_LOG" && <SendLogTable />}

      {activeTab === "CONVERSATIONS_24H" && <ConversationWindowView />}
    </div>
  );
}
