"use client";

import React, { useState } from "react";
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGE_TEMPLATES,
  ConversationItem,
  MessageTemplateItem,
} from "@/lib/mock-data/omnichannel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Clock,
  Lock,
  Unlock,
  Send,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  User,
  ShieldAlert,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";

export function ConversationWindowView() {
  const [conversations, setConversations] =
    useState<ConversationItem[]>(MOCK_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string>("conv-01-claire");
  const [inputText, setInputText] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplateItem | null>(null);
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({
    "1": "Julian",
    "2": "Winter Design Lookbook",
  });
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const activeConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const isExpired = activeConv.windowHoursRemaining === 0;
  const isBoundary =
    activeConv.windowHoursRemaining > 0 && activeConv.windowHoursRemaining <= 2;

  const handleSendMessage = () => {
    if (isExpired && !selectedTemplate) {
      alert(
        "WhatsApp Policy Violation: Direct free-form text is strictly blocked outside the 24-hour customer window. You must select an approved HSM template."
      );
      return;
    }

    let finalMessage = inputText.trim();
    let isTemplate = false;
    let templateName: string | undefined = undefined;

    if (selectedTemplate) {
      isTemplate = true;
      templateName = selectedTemplate.name;
      finalMessage = selectedTemplate.body
        .replace("{{1}}", templateVars["1"] || activeConv.contactName)
        .replace("{{2}}", templateVars["2"] || "Editorial Catalog")
        .replace("{{3}}", templateVars["3"] || "Tomorrow 2:00 PM");
    }

    if (!finalMessage) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "OUTBOUND" as const,
      text: finalMessage,
      timestamp: "Just now",
      status: "SENT" as const,
      isTemplate,
      templateName,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastOutboundAt: new Date().toISOString(),
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText("");
    setSelectedTemplate(null);
    setShowTemplatePicker(false);
  };

  const approvedWhatsAppTemplates = MOCK_MESSAGE_TEMPLATES.filter(
    (t) => t.channel === "WHATSAPP" && t.status === "APPROVED"
  );

  return (
    <div className="space-y-6">
      {/* Policy Explainer Banner */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  WhatsApp 24-Hour Customer Service Window Invariant
                </h3>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 text-amber-300 bg-amber-500/10 font-mono text-[10px]"
                >
                  Meta WABA Enforcement
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                When a user sends an inbound WhatsApp message, a 24-hour timer starts.
                Within this window, businesses can reply with standard conversational text at zero utility template fee.
                Once 24 hours expire, direct text is strictly locked by Meta: you <em>must</em> use a registered, certified Message Template to initiate communication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">
                Active Policy Invariant
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Deterministic Lockdown</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container: Left Thread List (4 cols), Right Active Chat (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left: Conversation Switcher */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[var(--brand-primary)]" />
                <h4 className="text-sm font-semibold text-white">Active Sessions</h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {conversations.length} Threads
              </span>
            </div>

            <div className="space-y-2">
              {conversations.map((c) => {
                const isSelected = c.id === activeConv.id;
                const convExpired = c.windowHoursRemaining === 0;
                const convBoundary =
                  c.windowHoursRemaining > 0 && c.windowHoursRemaining <= 2;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedConvId(c.id);
                      setSelectedTemplate(null);
                      setShowTemplatePicker(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/15 shadow-md"
                        : "border-white/5 bg-slate-950/40 hover:bg-white/[0.03] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                          {c.contactAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={c.contactAvatar}
                              alt={c.contactName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {c.contactName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {c.contactPhone}
                          </div>
                        </div>
                      </div>

                      {/* Window Status Badge */}
                      {convExpired ? (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] shrink-0 font-mono">
                          <Lock className="h-3 w-3 mr-1 text-red-400" />
                          EXPIRED
                        </Badge>
                      ) : convBoundary ? (
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] shrink-0 font-mono">
                          <Clock className="h-3 w-3 mr-1 text-amber-400" />
                          {c.windowHoursRemaining}h remaining
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] shrink-0 font-mono">
                          <Unlock className="h-3 w-3 mr-1 text-emerald-400" />
                          {c.windowHoursRemaining}h active
                        </Badge>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300 truncate mt-2">
                      {c.messages[c.messages.length - 1]?.text}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-slate-400 mt-4">
            <div className="font-semibold text-white text-[11px] mb-1 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-cyan-400" />
              <span>Inspection Tip</span>
            </div>
            Click between <strong>Claire</strong> (Active window) and <strong>Julian</strong> (Expired window) to witness the live input lockdown mechanism.
          </div>
        </div>

        {/* Right: Chat Thread & Locked/Unlocked Composer */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 border-b border-white/10 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                {activeConv.contactAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeConv.contactAvatar}
                    alt={activeConv.contactName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeConv.contactName}</span>
                  <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-slate-300">
                    WhatsApp WABA
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {activeConv.contactPhone} • Last inbound: {new Date(activeConv.lastInboundAt).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Countdown Badge */}
            {isExpired ? (
              <div className="text-right">
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs py-1 px-3">
                  <Lock className="h-3.5 w-3.5 mr-1.5 text-red-400" />
                  Window Expired (0h)
                </Badge>
                <div className="text-[10px] text-red-400/90 mt-1 font-mono">
                  Free-form replies forbidden
                </div>
              </div>
            ) : (
              <div className="text-right">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs py-1 px-3">
                  <Unlock className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  Window Open ({activeConv.windowHoursRemaining}h left)
                </Badge>
                <div className="text-[10px] text-emerald-400/90 mt-1 font-mono">
                  Free conversational text allowed
                </div>
              </div>
            )}
          </div>

          {/* Messages Body */}
          <div className="p-5 overflow-y-auto space-y-4 max-h-[380px] bg-slate-950/30">
            {activeConv.messages.map((m) => {
              if (m.sender === "SYSTEM") {
                return (
                  <div
                    key={m.id}
                    className="mx-auto max-w-lg p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs text-amber-300"
                  >
                    <div className="flex items-center justify-center gap-1.5 font-semibold mb-0.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Service Window Invariant Notification</span>
                    </div>
                    {m.text}
                  </div>
                );
              }

              const isOutbound = m.sender === "OUTBOUND";
              return (
                <div
                  key={m.id}
                  className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs shadow-md ${
                      isOutbound
                        ? "bg-gradient-to-br from-[var(--brand-primary)]/80 to-[var(--brand-primary)] text-white rounded-br-none"
                        : "bg-slate-800/90 border border-white/10 text-slate-100 rounded-bl-none"
                    }`}
                  >
                    {m.isTemplate && (
                      <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-amber-200 mb-1.5 pb-1 border-b border-white/20">
                        <FileCheck2 className="h-3 w-3" />
                        <span>Certified Meta HSM Template ({m.templateName})</span>
                      </div>
                    )}
                    <p className="leading-relaxed">{m.text}</p>
                    <div
                      className={`text-[10px] mt-1.5 text-right font-mono ${
                        isOutbound ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      {m.timestamp} {m.status ? `• ${m.status}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Composer Area */}
          <div className="p-4 border-t border-white/10 bg-slate-950/80 space-y-3">
            {/* If Window is Expired: Red Guardrail Notification */}
            {isExpired && !selectedTemplate && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start justify-between gap-3 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-red-200">
                      WhatsApp Free-Form Direct Messaging is Locked
                    </div>
                    <p className="text-[11px] text-red-300/80 mt-0.5 leading-relaxed">
                      More than 24 hours elapsed since customer&apos;s last inbound. In compliance with Meta Business terms, you must initiate with an approved HSM Template to reopen conversation rights.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowTemplatePicker(true)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shrink-0"
                >
                  <FileCheck2 className="h-3.5 w-3.5 mr-1.5" />
                  Select Template
                </Button>
              </div>
            )}

            {/* Template Selected Banner */}
            {selectedTemplate && (
              <div className="p-3 rounded-xl bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-[var(--brand-primary)]" />
                    <span className="text-xs font-bold text-white">
                      Selected Template: {selectedTemplate.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      APPROVED
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Variable &#123;&#123;1&#125;&#125; (Name)</label>
                    <Input
                      value={templateVars["1"]}
                      onChange={(e) =>
                        setTemplateVars({ ...templateVars, "1": e.target.value })
                      }
                      className="h-7 text-xs bg-slate-900 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Variable &#123;&#123;2&#125;&#125; (Collection / Link)</label>
                    <Input
                      value={templateVars["2"]}
                      onChange={(e) =>
                        setTemplateVars({ ...templateVars, "2": e.target.value })
                      }
                      className="h-7 text-xs bg-slate-900 border-white/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Input Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  disabled={isExpired && !selectedTemplate}
                  placeholder={
                    isExpired && !selectedTemplate
                      ? "Free-form text disabled. Select an Approved Template above to reply."
                      : selectedTemplate
                      ? "Click 'Send Template Dispatch' to transmit certified HSM payload..."
                      : "Type a free-form customer reply..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className={`bg-slate-950 border-white/10 text-sm rounded-xl pr-10 ${
                    isExpired && !selectedTemplate ? "cursor-not-allowed opacity-60" : ""
                  }`}
                />
                {isExpired && !selectedTemplate && (
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                )}
              </div>

              {!isExpired && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                  className="border-white/10 hover:bg-white/5 text-xs text-slate-300"
                >
                  <FileCheck2 className="h-3.5 w-3.5 mr-1.5" />
                  Templates
                </Button>
              )}

              <Button
                onClick={handleSendMessage}
                disabled={isExpired && !selectedTemplate}
                className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  isExpired && !selectedTemplate
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-[var(--brand-primary)] text-white hover:brightness-110 shadow-lg shadow-[var(--brand-primary)]/20"
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                <span>{selectedTemplate ? "Dispatch Template" : "Send"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-[var(--brand-primary)]" />
                <h3 className="text-base font-bold text-white">
                  Select Certified WhatsApp Template
                </h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowTemplatePicker(false)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </Button>
            </div>

            <p className="text-xs text-slate-300">
              Only Meta-certified templates can be sent outside the 24-hour customer window. Select one to populate variables and re-engage.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {approvedWhatsAppTemplates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t);
                    setShowTemplatePicker(false);
                  }}
                  className="p-3.5 rounded-xl border border-white/10 bg-slate-950/60 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.name}</span>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      {t.category}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-300 font-mono leading-relaxed">
                    {t.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
