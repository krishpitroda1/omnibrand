"use client";

import React, { useState, useMemo } from "react";
import { useAppStore } from "@/store";
import { CrmContactItem, SavedSegment, LifecycleStage } from "@/types";
import {
  MOCK_CRM_CONTACTS,
  MOCK_SAVED_SEGMENTS,
} from "@/lib/mock-data/crm";
import { ContactTableView } from "@/features/crm/components/ContactTableView";
import { ContactDetailDrawer } from "@/features/crm/components/ContactDetailDrawer";
import { LeadPipelineBoard } from "@/features/crm/components/LeadPipelineBoard";
import { SegmentRuleBuilder } from "@/features/crm/components/SegmentRuleBuilder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Kanban,
  Filter,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type CrmView = "TABLE" | "PIPELINE" | "SEGMENTS";

export default function CustomerCrmPage() {
  const { brands, activeBrandId, setCreateModalOpen } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const [contacts, setContacts] = useState<CrmContactItem[]>([]);
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([]);
  const [activeView, setActiveView] = useState<CrmView>("TABLE");
  const [selectedContact, setSelectedContact] = useState<CrmContactItem | null>(null);
  const [crmToast, setCrmToast] = useState<string | null>(null);

  // Global KPIs
  const totalAttributedRevenue = useMemo(() => {
    return contacts.reduce((sum, c) => sum + (c.attributedRevenue || 0), 0);
  }, [contacts]);

  const avgLeadScore = useMemo(() => {
    if (contacts.length === 0) return 0;
    const total = contacts.reduce((sum, c) => sum + c.leadScore, 0);
    return Math.round(total / contacts.length);
  }, [contacts]);

  const customerCount = useMemo(() => {
    return contacts.filter((c) => c.lifecycleStage === "CUSTOMER").length;
  }, [contacts]);

  // Handlers
  const handleUpdateStage = (contactId: string, stage: LifecycleStage) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            lifecycleStage: stage,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    if (selectedContact?.id === contactId) {
      setSelectedContact((prev) => (prev ? { ...prev, lifecycleStage: stage } : null));
    }
    setCrmToast(`Advanced contact stage to '${stage}'.`);
    setTimeout(() => setCrmToast(null), 3000);
  };

  const handleSaveSegment = (segment: SavedSegment) => {
    setSavedSegments([segment, ...savedSegments]);
  };

  const handleUseInCampaign = (segment: SavedSegment) => {
    setCrmToast(`Targeting segment '${segment.name}' (${segment.audienceCount} contacts) in Campaign Composer.`);
    setTimeout(() => {
      setCrmToast(null);
      setCreateModalOpen(true);
    }, 1500);
  };

  const handleExecuteAiAction = (contactId: string, actionText: string) => {
    setCrmToast(`AI Action Dispatched: "${actionText}"`);
    setTimeout(() => setCrmToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Users className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>Customer CRM & Identity Cloud</span>
            </h1>
            <Badge variant="brand" size="sm">
              {activeBrand?.name}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Unified profile resolution, cross-channel touchpoint timelines, lead scoring, and automated journey membership tracking.
          </p>
        </div>

        {/* Global CRM Telemetry KPIs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">TOTAL PROFILES</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{contacts.length} Contacts</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">AVG LEAD SCORE</div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">{avgLeadScore}/100</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">ATTRIBUTED REVENUE</div>
            <div className="text-xs font-bold text-cyan-700 dark:text-cyan-400 font-mono">
              ${totalAttributedRevenue.toLocaleString()}
            </div>
          </div>
          {contacts.length === 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setContacts(MOCK_CRM_CONTACTS);
                setSavedSegments(MOCK_SAVED_SEGMENTS);
                setCrmToast("Sample enterprise CRM contacts loaded.");
                setTimeout(() => setCrmToast(null), 3000);
              }}
              className="text-xs h-9 border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>Load Sample Leads</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setContacts([]);
                setSavedSegments([]);
                setCrmToast("CRM reset to empty state.");
                setTimeout(() => setCrmToast(null), 3000);
              }}
              className="text-xs h-9 text-slate-500 hover:text-slate-800"
            >
              <span>Clear Leads</span>
            </Button>
          )}
        </div>
      </div>

      {crmToast && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{crmToast}</span>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveView("TABLE")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeView === "TABLE"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Unified Profiles</span>
          <span className="text-[10px] opacity-80 font-mono">({contacts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("PIPELINE")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeView === "PIPELINE"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Kanban className="h-4 w-4" />
          <span>Lead Pipeline Kanban</span>
          <span className="text-[10px] opacity-80 font-mono">4 Stages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("SEGMENTS")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeView === "SEGMENTS"
              ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Audience Segments</span>
          <span className="text-[10px] opacity-80 font-mono">({savedSegments.length} Saved)</span>
        </button>
      </div>

      {/* Main Views */}
      {activeView === "TABLE" && (
        <ContactTableView
          contacts={contacts}
          onSelectContact={(c) => setSelectedContact(c)}
        />
      )}

      {activeView === "PIPELINE" && (
        <LeadPipelineBoard
          contacts={contacts}
          onSelectContact={(c) => setSelectedContact(c)}
          onUpdateStage={handleUpdateStage}
        />
      )}

      {activeView === "SEGMENTS" && (
        <SegmentRuleBuilder
          contacts={contacts}
          savedSegments={savedSegments}
          onSaveSegment={handleSaveSegment}
          onUseInCampaign={handleUseInCampaign}
        />
      )}

      {/* Strategic Centerpiece: Contact Detail Drawer (6 Tabs) */}
      <ContactDetailDrawer
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onUpdateStage={handleUpdateStage}
        onExecuteAiAction={handleExecuteAiAction}
      />
    </div>
  );
}
