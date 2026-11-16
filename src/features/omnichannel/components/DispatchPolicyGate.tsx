"use client";

import React, { useState, useMemo } from "react";
import {
  MOCK_CONTACTS,
  MOCK_MESSAGE_TEMPLATES,
  ContactItem,
  MessageTemplateItem,
} from "@/lib/mock-data/omnichannel";
import { OmniChannel } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  Zap,
  Info,
  Clock,
  DollarSign,
  UserCheck,
  FileCheck2,
  RefreshCw,
} from "lucide-react";

interface PolicyGateCheck {
  id: string;
  name: string;
  ruleCode: string;
  description: string;
  status: "PASS" | "FAIL" | "WARN";
  message: string;
  remediation?: string;
}

export function DispatchPolicyGate() {
  const [selectedContactId, setSelectedContactId] = useState<string>(MOCK_CONTACTS[0].id);
  const [selectedChannel, setSelectedChannel] = useState<OmniChannel>("WHATSAPP");
  const [useTemplate, setUseTemplate] = useState<boolean>(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(MOCK_MESSAGE_TEMPLATES[0].id);
  const [freeFormText, setFreeFormText] = useState<string>("Hello, following up on your luxury design inquiry.");
  const [forceExpiredWindow, setForceExpiredWindow] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const selectedContact = useMemo(() => {
    return MOCK_CONTACTS.find((c) => c.id === selectedContactId) || MOCK_CONTACTS[0];
  }, [selectedContactId]);

  const channelTemplates = useMemo(() => {
    return MOCK_MESSAGE_TEMPLATES.filter((t) => t.channel === selectedChannel);
  }, [selectedChannel]);

  const selectedTemplate = useMemo(() => {
    return (
      channelTemplates.find((t) => t.id === selectedTemplateId) ||
      channelTemplates[0] ||
      MOCK_MESSAGE_TEMPLATES[0]
    );
  }, [channelTemplates, selectedTemplateId]);

  // Evaluate the 4 policy gate checks in real-time
  const policyEvaluation = useMemo(() => {
    const checks: PolicyGateCheck[] = [];

    // 1. Consent Rule
    const consent = selectedContact.channelConsents[selectedChannel];
    if (!consent || consent.status === "OPTED_OUT") {
      checks.push({
        id: "rule-consent",
        name: "User Consent Verification",
        ruleCode: "POL-001-CONSENT",
        description: "Strict opt-in required prior to dispatch across all digital messaging carriers.",
        status: "FAIL",
        message: `HARD BLOCK: Contact has status '${consent?.status || "UNKNOWN"}' on ${selectedChannel}. Outbound transmission prohibited under TCPA/GDPR.`,
        remediation: "Request manual override in Consent Manager with valid written compliance proof or verify opt-in keyword.",
      });
    } else if (consent.status === "UNKNOWN") {
      checks.push({
        id: "rule-consent",
        name: "User Consent Verification",
        ruleCode: "POL-001-CONSENT",
        description: "Explicit consent records required before marketing dispatch.",
        status: "FAIL",
        message: `Consent is UNKNOWN. Implicit consent is not permitted on ${selectedChannel}.`,
        remediation: "Collect explicit opt-in confirmation before scheduling messages.",
      });
    } else {
      checks.push({
        id: "rule-consent",
        name: "User Consent Verification",
        ruleCode: "POL-001-CONSENT",
        description: "Explicit opt-in verified against cryptographic tamper-evident consent audit trail.",
        status: "PASS",
        message: `Opt-in verified: Source '${consent.source}', Proof Ref '${consent.proofReference}'.`,
      });
    }

    // 2. WhatsApp 24-Hour Customer Window Rule
    if (selectedChannel === "WHATSAPP") {
      // Simulate expired window if contact is Julian Vance or force toggle is on
      const isExpired = forceExpiredWindow || selectedContact.name.includes("Julian");

      if (isExpired && !useTemplate) {
        checks.push({
          id: "rule-24h",
          name: "WhatsApp 24-Hour Service Window",
          ruleCode: "POL-002-WABA-24H",
          description: "Free-form messages are only permitted within 24 hours of user's last inbound message.",
          status: "FAIL",
          message: "HARD BLOCK: 24-hour customer window is EXPIRED (0h remaining). Free-form direct text is rejected by Meta WABA policy.",
          remediation: "Switch from free-form message to a certified Meta-Approved HSM Message Template to re-open the conversation window.",
        });
      } else if (isExpired && useTemplate) {
        checks.push({
          id: "rule-24h",
          name: "WhatsApp 24-Hour Service Window",
          ruleCode: "POL-002-WABA-24H",
          description: "Approved template fallback deployed outside 24-hour window.",
          status: "PASS",
          message: "Customer window expired, but Approved Meta HSM Template is selected. Template initiation authorized.",
        });
      } else {
        checks.push({
          id: "rule-24h",
          name: "WhatsApp 24-Hour Service Window",
          ruleCode: "POL-002-WABA-24H",
          description: "Active customer service window allows bi-directional free-form responses.",
          status: "PASS",
          message: "Customer window ACTIVE (22h remaining since last inbound interaction). Free-form text authorized.",
        });
      }
    } else {
      checks.push({
        id: "rule-24h",
        name: `${selectedChannel} Transport Protocol Gate`,
        ruleCode: "POL-002-TRANSPORT",
        description: "Carrier throughput and rate-limit verification.",
        status: "PASS",
        message: `Direct carrier queue available on ${selectedChannel}. No conversational time-window restriction.`,
      });
    }

    // 3. Spend Cap & Credit Balance
    const creditCost = selectedChannel === "WHATSAPP" ? 38 : selectedChannel === "VOICE" ? 55 : 12;
    const currentCredits = 481580;
    if (currentCredits < creditCost) {
      checks.push({
        id: "rule-spend",
        name: "Workspace Spend Cap & Credit Balance",
        ruleCode: "POL-003-SPEND-CAP",
        description: "Workspace prepaid credit ledger balance verification.",
        status: "FAIL",
        message: `Insufficient credits. Required: ${creditCost}, Available: ${currentCredits}.`,
        remediation: "Top up messaging credits in Billing & Usage settings.",
      });
    } else {
      checks.push({
        id: "rule-spend",
        name: "Workspace Spend Cap & Credit Balance",
        ruleCode: "POL-003-SPEND-CAP",
        description: "Prepaid credit ledger balance verification.",
        status: "PASS",
        message: `Spend verified. Estimated cost: ${creditCost} credits ($${(creditCost / 1000).toFixed(3)}). Remaining: ${(currentCredits - creditCost).toLocaleString()} credits.`,
      });
    }

    // 4. Template Certification Status
    if (useTemplate) {
      if (!selectedTemplate) {
        checks.push({
          id: "rule-template",
          name: "Template Certification Status",
          ruleCode: "POL-004-TEMPLATE-CERT",
          description: "Provider registration and content compliance review.",
          status: "FAIL",
          message: "No template selected for template-based dispatch.",
          remediation: "Select an approved template from the template library.",
        });
      } else if (selectedTemplate.status === "REJECTED") {
        checks.push({
          id: "rule-template",
          name: "Template Certification Status",
          ruleCode: "POL-004-TEMPLATE-CERT",
          description: "Provider registration and content compliance review.",
          status: "FAIL",
          message: `HARD BLOCK: Template '${selectedTemplate.name}' was REJECTED by carrier: ${selectedTemplate.rejectionReason || "Content policy non-compliance"}.`,
          remediation: "Submit a compliant template revision in the Template Library.",
        });
      } else if (selectedTemplate.status === "PENDING") {
        checks.push({
          id: "rule-template",
          name: "Template Certification Status",
          ruleCode: "POL-004-TEMPLATE-CERT",
          description: "Provider registration and content compliance review.",
          status: "FAIL",
          message: `Template '${selectedTemplate.name}' is currently PENDING carrier approval. Messages cannot be dispatched until certified.`,
          remediation: "Wait for provider webhook notification or use an existing approved template.",
        });
      } else {
        checks.push({
          id: "rule-template",
          name: "Template Certification Status",
          ruleCode: "POL-004-TEMPLATE-CERT",
          description: "Provider registration and content compliance review.",
          status: "PASS",
          message: `Template '${selectedTemplate.name}' is officially APPROVED and registered on carrier network.`,
        });
      }
    } else {
      checks.push({
        id: "rule-template",
        name: "Content Quality & Spam Filter",
        ruleCode: "POL-004-SPAM-FILTER",
        description: "Real-time AI scanning for prohibited content, phishing, and spam signals.",
        status: "PASS",
        message: "Free-form payload passed regex & sentiment filters. No restricted financial or adult keywords detected.",
      });
    }

    const hasFailure = checks.some((c) => c.status === "FAIL");
    return {
      allPassed: !hasFailure,
      checks,
    };
  }, [
    selectedContact,
    selectedChannel,
    useTemplate,
    selectedTemplate,
    forceExpiredWindow,
  ]);

  const handleTestDispatch = () => {
    if (!policyEvaluation.allPassed) {
      alert("Policy Gate Block: Message dispatch was rejected by compliance rules. See failed checks below.");
      return;
    }

    setDispatchSuccess(
      `✓ Transmission Authorized! Dispatched to ${selectedContact.name} (${selectedContact.phone || selectedContact.email}) via ${selectedChannel}. Gate latency: 14ms.`
    );
    setTimeout(() => setDispatchSuccess(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-primary)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)]/30 text-[var(--brand-primary)]">
                <ShieldAlert className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Dispatch Policy Gate & Compliance Engine
              </h2>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                Active Enforcer
              </Badge>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              Every outbound message across WhatsApp, RCS, SMS, Voice, and Email must pass 4 deterministic policy gates before touching any carrier wire. Messages failing any rule are immediately blocked with zero carrier charges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-mono">ENFORCEMENT STATS</div>
              <div className="text-sm font-semibold text-white">100% Zero-Leak Guarantee</div>
            </div>
          </div>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 backdrop-blur-xl p-4 text-emerald-200 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{dispatchSuccess}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-300 hover:bg-emerald-900/50"
            onClick={() => setDispatchSuccess(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Main Grid: Left interactive controls, Right live rules checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Dispatch Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-[var(--brand-primary)]" />
                <span>Simulate Dispatch Request</span>
              </h3>
              <Badge variant="outline" className="border-white/20 text-slate-400 font-mono text-[11px]">
                Interactive Tester
              </Badge>
            </div>

            {/* Contact Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Target Contact</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Consent: {selectedContact.channelConsents[selectedChannel]?.status}
                </span>
              </label>
              <select
                aria-label="Target Contact"
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
              >
                {MOCK_CONTACTS.slice(0, 15).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company}) — {c.channelConsents[selectedChannel]?.status}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Select contacts like <strong>Nora Sterling</strong> (OPTED_OUT) or <strong>Julian Vance</strong> (24h window test) to inspect policy triggers.
              </p>
            </div>

            {/* Channel Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Outbound Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["WHATSAPP", "RCS", "SMS", "VOICE", "EMAIL", "WEB_PUSH"] as OmniChannel[]).map(
                  (chan) => (
                    <button
                      key={chan}
                      type="button"
                      onClick={() => setSelectedChannel(chan)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                        selectedChannel === chan
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/20 text-white shadow-sm"
                          : "border-white/10 bg-slate-950/40 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {chan.replace("_", " ")}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Message Mode: Free-form vs Template */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Payload Type
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUseTemplate(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      useTemplate
                        ? "bg-[var(--brand-primary)] text-white shadow"
                        : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    Approved Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseTemplate(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      !useTemplate
                        ? "bg-[var(--brand-primary)] text-white shadow"
                        : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    Free-Form Text
                  </button>
                </div>
              </div>

              {useTemplate ? (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Choose Registered Template</label>
                  <select
                    aria-label="Choose Registered Template"
                    value={selectedTemplate?.id}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
                  >
                    {MOCK_MESSAGE_TEMPLATES.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name} ({tmpl.channel} - {tmpl.status})
                      </option>
                    ))}
                  </select>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 font-mono">
                    {selectedTemplate?.body}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Direct Message Body</label>
                  <textarea
                    rows={3}
                    value={freeFormText}
                    onChange={(e) => setFreeFormText(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 font-mono resize-none"
                    placeholder="Enter free-form customer response..."
                  />
                </div>
              )}
            </div>

            {/* WhatsApp Window Simulator Toggle */}
            {selectedChannel === "WHATSAPP" && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-amber-300">
                      Simulate 24h Customer Window
                    </div>
                    <div className="text-[11px] text-amber-400/80">
                      {forceExpiredWindow ? "Window EXPIRED (>24h since customer reply)" : "Window ACTIVE (<24h since customer reply)"}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setForceExpiredWindow(!forceExpiredWindow)}
                  className="text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                >
                  {forceExpiredWindow ? "Set Active" : "Set Expired"}
                </Button>
              </div>
            )}

            {/* Test Dispatch Button */}
            <div className="pt-2">
              <Button
                onClick={handleTestDispatch}
                disabled={!policyEvaluation.allPassed}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  policyEvaluation.allPassed
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950 hover:brightness-110"
                    : "bg-red-950/40 border border-red-500/30 text-red-400 cursor-not-allowed"
                }`}
              >
                {policyEvaluation.allPassed ? (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Authorize & Dispatch</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Dispatch Blocked by Gate</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Gate Status Lights (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">
                  Real-Time Gate Inspection Matrix
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">System Verdict:</span>
                {policyEvaluation.allPassed ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    CLEAR FOR LAUNCH
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                    TRANSMISSION HALTED
                  </Badge>
                )}
              </div>
            </div>

            {/* Rules Cards */}
            <div className="space-y-3">
              {policyEvaluation.checks.map((check, idx) => {
                const isPass = check.status === "PASS";
                return (
                  <div
                    key={check.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isPass
                        ? "border-emerald-500/20 bg-emerald-950/20"
                        : "border-red-500/30 bg-red-950/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {isPass ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/10">
                              {check.ruleCode}
                            </span>
                            <span className="text-sm font-semibold text-white">
                              {check.name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{check.description}</p>
                          <div
                            className={`text-xs font-medium mt-1 ${
                              isPass ? "text-emerald-300" : "text-red-300"
                            }`}
                          >
                            {check.message}
                          </div>
                          {check.remediation && (
                            <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 mt-2 flex items-start gap-1.5">
                              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-400" />
                              <span>{check.remediation}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={
                          isPass
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shrink-0"
                            : "border-red-500/30 text-red-400 bg-red-500/10 shrink-0 font-bold"
                        }
                      >
                        {check.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
