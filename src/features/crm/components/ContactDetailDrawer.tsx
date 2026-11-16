"use client";

import React, { useState } from "react";
import {
  CrmContactItem,
  ContactIdentityItem,
  LifecycleStage,
  ConsentStatus,
} from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  User,
  Fingerprint,
  ShieldCheck,
  Activity,
  TrendingUp,
  Brain,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  QrCode,
  Instagram,
  Linkedin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  GitMerge,
  Unlink,
  Clock,
  DollarSign,
  Tag,
  Sparkles,
  Zap,
} from "lucide-react";

interface ContactDetailDrawerProps {
  contact: CrmContactItem | null;
  onClose: () => void;
  onUpdateStage?: (contactId: string, stage: LifecycleStage) => void;
  onExecuteAiAction?: (contactId: string, actionText: string) => void;
}

type DetailTab =
  | "PROFILE"
  | "IDENTITY"
  | "CONSENT"
  | "INTERACTIONS"
  | "ATTRIBUTION"
  | "AI_INSIGHTS";

export function ContactDetailDrawer({
  contact,
  onClose,
  onUpdateStage,
  onExecuteAiAction,
}: ContactDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("AI_INSIGHTS");
  const [identities, setIdentities] = useState<ContactIdentityItem[]>(
    contact?.identities || []
  );
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  if (!contact) return null;

  const handleMergeIdentity = (id: string) => {
    setIdentities((prev) =>
      prev.map((ident) =>
        ident.id === id ? { ...ident, confidenceScore: 1.0, isPrimary: true } : ident
      )
    );
    setActionAlert("Identity verified and merged into canonical profile hash.");
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleUnmergeIdentity = (id: string) => {
    setIdentities((prev) => prev.filter((ident) => ident.id !== id));
    setActionAlert("Identifier detached and split into separate contact record.");
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleExecuteAction = () => {
    if (onExecuteAiAction) {
      onExecuteAiAction(contact.id, contact.aiInsights.recommendedNextAction);
    }
    setActionAlert(`✓ Executed recommended action: "${contact.aiInsights.recommendedNextAction}"`);
    setTimeout(() => setActionAlert(null), 4000);
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case "WHATSAPP":
        return <MessageSquare className="h-4 w-4 text-emerald-400" />;
      case "INSTAGRAM":
        return <Instagram className="h-4 w-4 text-rose-400" />;
      case "LINKEDIN":
        return <Linkedin className="h-4 w-4 text-blue-400" />;
      case "EMAIL":
        return <Mail className="h-4 w-4 text-cyan-400" />;
      case "QR_CODE":
        return <QrCode className="h-4 w-4 text-amber-400" />;
      default:
        return <Globe className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/15 flex items-center justify-center shrink-0">
              {contact.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={contact.avatarUrl}
                  alt={contact.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {contact.name}
                </h3>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300"
                >
                  {contact.lifecycleStage}
                </Badge>
                <Badge
                  className={`text-[10px] font-mono ${
                    contact.leadScore >= 80
                      ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                      : "bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30"
                  }`}
                >
                  Score: {contact.leadScore}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {contact.role} at <strong className="text-slate-900 dark:text-white">{contact.company}</strong> • Owner: {contact.owner}
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

        {actionAlert && (
          <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{actionAlert}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 border-b border-white/10 px-5 pt-2 bg-slate-950/40 overflow-x-auto no-scrollbar">
          {(
            [
              { id: "AI_INSIGHTS", label: "AI Insights", icon: Brain },
              { id: "INTERACTIONS", label: `Timeline (${contact.interactions.length})`, icon: Activity },
              { id: "IDENTITY", label: `Identity (${identities.length})`, icon: Fingerprint },
              { id: "CONSENT", label: "Consent Audit", icon: ShieldCheck },
              { id: "ATTRIBUTION", label: "Attribution & LTV", icon: TrendingUp },
              { id: "PROFILE", label: "Full Profile", icon: User },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === t.id
                    ? "border-[var(--brand-primary)] text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: AI INSIGHTS */}
          {activeTab === "AI_INSIGHTS" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[var(--brand-primary)]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      AI Synthesized Executive Summary
                    </h4>
                  </div>
                  <Badge
                    className={`text-[10px] ${
                      contact.aiInsights.predictedChurnRisk === "LOW"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : contact.aiInsights.predictedChurnRisk === "MEDIUM"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    }`}
                  >
                    Churn Risk: {contact.aiInsights.predictedChurnRisk}
                  </Badge>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {contact.aiInsights.summary}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-[var(--brand-primary)] font-bold">
                      Recommended Next Action
                    </span>
                    <Badge variant="outline" className="text-[9px] border-white/10 text-slate-400">
                      High Confidence (96%)
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-white">
                    {contact.aiInsights.recommendedNextAction}
                  </p>
                  <Button
                    size="sm"
                    onClick={handleExecuteAction}
                    className="w-full bg-[var(--brand-primary)] hover:brightness-110 text-white text-xs font-semibold py-1.5 rounded-xl shadow-md"
                  >
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    <span>Execute Recommended Action Now</span>
                  </Button>
                </div>
              </div>

              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Lead Score</span>
                  <span className="text-base font-bold text-white font-mono mt-0.5 block">{contact.leadScore}/100</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Attributed Rev</span>
                  <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">${contact.attributedRevenue.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Estimated LTV</span>
                  <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">${contact.ltvEstimate.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIONS (Unified Timeline) */}
          {activeTab === "INTERACTIONS" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Unified cross-channel touchpoint stream across Instagram, WhatsApp, Email, Web Forms, and QR passes.
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {contact.interactions.map((evt) => (
                  <div key={evt.id} className="relative group">
                    {/* Circle marker */}
                    <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center">
                      {getChannelIcon(evt.channel)}
                    </div>

                    <div className="p-3.5 rounded-xl border border-white/10 bg-slate-950/70 space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <span>{evt.channel}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({evt.eventType})</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(evt.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {evt.contentSnippet}
                      </p>
                      {evt.campaignName && (
                        <div className="text-[10px] text-[var(--brand-primary)] font-mono pt-0.5">
                          Campaign: {evt.campaignName}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IDENTITY (Identity Graph) */}
          {activeTab === "IDENTITY" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Deterministic identity graph linking verified emails, mobile numbers, social handles, and tracking cookies.
              </div>

              <div className="space-y-3">
                {identities.map((ident) => (
                  <div
                    key={ident.id}
                    className="p-3.5 rounded-xl border border-white/10 bg-slate-950/70 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono border-white/15 bg-white/5 text-slate-300">
                          {ident.type}
                        </Badge>
                        <span className="font-semibold text-white font-mono">
                          {ident.value}
                        </span>
                        {ident.isPrimary && (
                          <Badge className="bg-[var(--brand-primary)]/20 text-white border-[var(--brand-primary)]/30 text-[9px]">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Confidence Score: <strong className="text-emerald-400">{(ident.confidenceScore * 100).toFixed(0)}%</strong> • Verified: {new Date(ident.verifiedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!ident.isPrimary && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMergeIdentity(ident.id)}
                          className="border-white/10 text-[10px] h-7"
                        >
                          <GitMerge className="h-3 w-3 mr-1 text-[var(--brand-primary)]" />
                          Set Primary
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUnmergeIdentity(ident.id)}
                        className="text-slate-500 hover:text-red-400 text-[10px] h-7"
                      >
                        <Unlink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONSENT */}
          {activeTab === "CONSENT" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-white">Cryptographic Consent Ledger</div>
                  <div className="text-slate-300">
                    Status: <strong className="text-emerald-400">{contact.consentStatus}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Source: {contact.source} • Timestamped under TCPA & GDPR standards.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {contact.channels.map((chan) => (
                  <div
                    key={chan}
                    className="p-3 rounded-xl border border-white/5 bg-slate-950/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {getChannelIcon(chan)}
                      <span className="font-semibold text-slate-200">{chan}</span>
                    </div>
                    <Badge
                      className={
                        contact.consentStatus === "OPTED_IN"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]"
                          : "bg-red-500/20 text-red-300 border-red-500/30 text-[10px]"
                      }
                    >
                      {contact.consentStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ATTRIBUTION */}
          {activeTab === "ATTRIBUTION" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">First Touch Origin</span>
                  <div className="font-bold text-white">{contact.firstTouchCampaign || "Organic Search"}</div>
                  <div className="text-[11px] text-[var(--brand-primary)]">
                    Creative: {contact.firstTouchCreative || "Main Portal"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Last Touch Conversion</span>
                  <div className="font-bold text-white">{contact.lastTouchCampaign || "Executive Studio Keynote"}</div>
                  <div className="text-[11px] text-[var(--brand-primary)]">
                    Creative: {contact.lastTouchCreative || "Standard Lookbook"}
                  </div>
                </div>
              </div>

              {/* Journey Membership */}
              {contact.journeyMembership && contact.journeyMembership.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                    Active Automation Journeys
                  </label>
                  <div className="space-y-2">
                    {contact.journeyMembership.map((jrn) => (
                      <div
                        key={jrn}
                        className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-white font-mono">{jrn}</span>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                          ENROLLED (Step 3/7)
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === "PROFILE" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-slate-500 block mb-0.5">Primary Email</span>
                  <span className="text-white font-mono font-medium">{contact.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-slate-500 block mb-0.5">Mobile Phone</span>
                  <span className="text-white font-mono font-medium">{contact.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-slate-500 block mb-0.5">Company</span>
                  <span className="text-white font-medium">{contact.company}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-slate-500 block mb-0.5">Account Owner</span>
                  <span className="text-white font-medium">{contact.owner}</span>
                </div>
              </div>

              {/* Lifecycle Stage Switcher */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                  Change Lifecycle Stage
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["SUBSCRIBER", "LEAD", "MQL", "SQL", "CUSTOMER", "CHURNED"] as LifecycleStage[]).map(
                    (stg) => (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => onUpdateStage && onUpdateStage(contact.id, stg)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          contact.lifecycleStage === stg
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-sm"
                            : "border-white/10 bg-slate-950/60 text-slate-400 hover:text-white"
                        }`}
                      >
                        {stg}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                  Assigned Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs border-white/10 bg-white/5 text-slate-300">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            ID: {contact.id} • Created {new Date(contact.createdAt).toLocaleDateString()}
          </span>
          <Button
            size="sm"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-4"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
