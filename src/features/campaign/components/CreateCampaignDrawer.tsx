"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { CampaignObjective, Platform, AspectRatio } from "@/types";
import { CampaignItem } from "@/lib/mock-data/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  AlertCircle,
  Target,
  DollarSign,
  Calendar,
  Layers,
  Link as LinkIcon,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface CreateCampaignDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated?: (campaign: CampaignItem) => void;
}

const OBJECTIVE_INFO: Record<
  CampaignObjective,
  { label: string; description: string; recommendedCta: string }
> = {
  AWARENESS: {
    label: "Brand Awareness",
    description: "Maximize creative impressions, video views, and brand recall.",
    recommendedCta: "LANDING_PAGE",
  },
  LEADS: {
    label: "Lead Generation",
    description: "Capture verified first-party contacts with double opt-in consent.",
    recommendedCta: "LEAD_FORM",
  },
  SALES: {
    label: "Direct Sales & Revenue",
    description: "Drive attributable purchases via tagged storefront links.",
    recommendedCta: "LINK",
  },
  ENGAGEMENT: {
    label: "Social & Community Engagement",
    description: "Foster comments, shares, saves, and discussion threads.",
    recommendedCta: "WHATSAPP_CHAT",
  },
  RETENTION: {
    label: "Customer Retention & LTV",
    description: "Re-engage existing clients with exclusive updates.",
    recommendedCta: "WHATSAPP_CHAT",
  },
  APP_DOWNLOAD: {
    label: "App & Resource Downloads",
    description: "Prompt whitepaper, lookbook, or application downloads.",
    recommendedCta: "LINK",
  },
  FEEDBACK: {
    label: "Customer Insights & Feedback",
    description: "Collect survey responses and Net Promoter Scores.",
    recommendedCta: "LEAD_FORM",
  },
};

export function CreateCampaignDrawer({ isOpen, onClose, onCampaignCreated }: CreateCampaignDrawerProps) {
  const { brands, activeBrandId, activeWorkspaceId, addCampaign } = useAppStore();

  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState(activeBrandId);
  const [objective, setObjective] = useState<CampaignObjective>("LEADS");
  const [budget, setBudget] = useState(15000);
  const [startDate, setStartDate] = useState("2026-11-20T09:00");
  const [endDate, setEndDate] = useState("2026-11-30T18:00");
  const [targetAudience, setTargetAudience] = useState("Enterprise decision-makers and marketing directors.");
  const [selectedChannels, setSelectedChannels] = useState<Platform[]>(["INSTAGRAM", "LINKEDIN"]);
  
  // CTA fields - mandatory validation requirement!
  const [ctaType, setCtaType] = useState<"LINK" | "LEAD_FORM" | "WHATSAPP_CHAT" | "QR_CODE" | "LANDING_PAGE">("LEAD_FORM");
  const [ctaText, setCtaText] = useState("Request Private Consultation");
  const [ctaUrl, setCtaUrl] = useState("https://luminacreative.studio/consultation");

  // Error validation states
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const activeBrand = brands.find((b) => b.id === brandId) || brands[0];

  const toggleChannel = (plat: Platform) => {
    if (selectedChannels.includes(plat)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((p) => p !== plat));
      }
    } else {
      setSelectedChannels([...selectedChannels, plat]);
    }
  };

  const handleObjectiveChange = (obj: CampaignObjective) => {
    setObjective(obj);
    const rec = OBJECTIVE_INFO[obj].recommendedCta as "LINK" | "LEAD_FORM" | "WHATSAPP_CHAT" | "QR_CODE" | "LANDING_PAGE";
    setCtaType(rec);
    if (obj === "LEADS") {
      setCtaText("Download Studio Whitepaper & Spec Sheet");
    } else if (obj === "SALES") {
      setCtaText("Shop New Lookbook Collection");
    } else if (obj === "ENGAGEMENT") {
      setCtaText("Join VIP WhatsApp Channel");
    }
  };

  const validateAndSubmit = () => {
    const errors: string[] = [];

    if (!name.trim()) {
      errors.push("Campaign name is required.");
    }
    if (!objective) {
      errors.push("Every campaign must have a measurable objective.");
    }
    if (selectedChannels.length === 0) {
      errors.push("At least one publishing channel must be selected.");
    }
    if (budget <= 0) {
      errors.push("Campaign budget must be greater than zero.");
    }
    // Mandatory Guardrail: Must have at least one CTA!
    if (!ctaText.trim() || !ctaUrl.trim()) {
      errors.push("Validation Rule: Every campaign must specify at least one Call-To-Action (CTA).");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const campaignId = `cmp-${Date.now()}`;
    const budgetPerChannel = Math.round(budget / selectedChannels.length);

    const newCampaign: CampaignItem = {
      id: campaignId,
      workspaceId: activeWorkspaceId,
      brandId: activeBrand.id,
      brandName: activeBrand.name,
      brandColor: activeBrand.brandKit?.primaryColor || "#3B82F6",
      name: name.trim(),
      description: `Flight targeting ${objective} across ${selectedChannels.join(", ")}`,
      objective,
      budget,
      spendToDate: 0,
      status: "SCHEDULED",
      startDate,
      endDate,
      ownerUserId: "usr-elena-01",
      ownerName: "Elena Rostova",
      leadsCount: 0,
      targetAudience,
      ctaLinks: [
        {
          type: ctaType,
          displayText: ctaText.trim(),
          targetUrl: ctaUrl.trim(),
        },
      ],
      channelBudgets: selectedChannels.map((p) => ({
        platform: p,
        allocatedBudget: budgetPerChannel,
        spent: 0,
        status: "SCHEDULED",
        consentGated: p === "GOOGLE_BUSINESS",
        deliveryRate: 100,
      })),
      channels: selectedChannels.map((p) => ({
        platform: p,
        aspectRatio: p === "LINKEDIN" ? "LANDSCAPE_16_9" : "PORTRAIT_4_5",
        scheduledAt: startDate,
        status: "SCHEDULED",
      })),
      caption: `Announcing ${name}. Crafted with intentionality for ${activeBrand.name}.`,
      hashtags: ["#OmniBrand", "#CreativeOps", `#${activeBrand.slug}`],
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
      aiModelUsed: "FLUX_1_PRO",
      approvalRecord: {
        actorName: "Elena Rostova",
        decision: "APPROVED",
        notes: `Validated against ${objective} goal criteria. Measurable CTA confirmed.`,
        createdAt: new Date().toISOString(),
      },
      utmUrl: `${ctaUrl}?utm_source=omnibrand&utm_medium=campaign&utm_campaign=${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      publishJobs: selectedChannels.map((p) => ({
        id: `job-${Date.now()}-${p.toLowerCase()}`,
        workspaceId: activeWorkspaceId,
        campaignId,
        campaignName: name,
        brandName: activeBrand.name,
        brandColor: activeBrand.brandKit?.primaryColor || "#3B82F6",
        platform: p,
        idempotencyKey: `idemp_${Date.now()}_${p.toLowerCase()}`,
        status: "SCHEDULED",
        scheduledAt: startDate,
        retryCount: 0,
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
        caption: `Announcing ${name}. Crafted with intentionality.`,
      })),
    };

    addCampaign(newCampaign);

    // Save directly to Supabase database
    fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignName: newCampaign.name,
        name: newCampaign.name,
        workspaceId: activeWorkspaceId,
        brandId: activeBrand.id,
        brandName: activeBrand.name,
        objective: newCampaign.objective,
        status: newCampaign.status,
        budget: newCampaign.budget,
        spend: 0,
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
        channels: selectedChannels,
        mediaUrl: newCampaign.mediaUrl,
        caption: newCampaign.caption,
      }),
    }).catch((err) => console.error("CreateCampaignDrawer DB persist failed:", err));

    if (onCampaignCreated) onCampaignCreated(newCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 p-6 overflow-y-auto z-10 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--brand-primary)]" />
                <span>Create Campaign Flight</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Every campaign requires a verified objective, allocated budget, and mandatory CTA.
              </p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Validation Errors Notice */}
          {validationErrors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="h-4 w-4 text-rose-400" />
                <span>Validation Invariant Triggered:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-2">
                {validationErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Core Info */}
          <div className="space-y-4">
            <Input
              label="Campaign Flight Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Executive Architectural Thought Leadership"
            />

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Brand Context
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-[var(--brand-primary)]"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.industry})
                  </option>
                ))}
              </select>
            </div>

            {/* Objective Selector (Drives CTA & Metrics) */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Measurable Objective
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(OBJECTIVE_INFO) as CampaignObjective[]).map((obj) => {
                  const isSelected = objective === obj;
                  return (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => handleObjectiveChange(obj)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-[var(--brand-primary)]/15 border-[var(--brand-primary)] text-white shadow-sm font-bold"
                          : "bg-slate-950/60 border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[11px] block">{OBJECTIVE_INFO[obj].label}</span>
                      <span className="text-[9px] text-slate-500 line-clamp-1">
                        {OBJECTIVE_INFO[obj].recommendedCta}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                {OBJECTIVE_INFO[objective].description}
              </p>
            </div>

            {/* Budget & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Input
                type="number"
                label="Allocated Budget (USD)"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Target Audience Description
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                  Flight Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                  Flight End Date
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Publishing Channels */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Target Channels
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {(["INSTAGRAM", "LINKEDIN", "X", "PINTEREST", "FACEBOOK", "THREADS"] as Platform[]).map(
                  (plat) => {
                    const isSelected = selectedChannels.includes(plat);
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => toggleChannel(plat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-[var(--brand-primary)]/20 border-[var(--brand-primary)] text-white font-bold"
                            : "bg-slate-950 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {plat}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* MANDATORY CTA REQUIREMENT SECTION */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                  Mandatory Call-To-Action (CTA) Gate
                </span>
                <Badge variant="brand" size="sm">Required Invariant</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">CTA Action Type</label>
                  <select
                    value={ctaType}
                    onChange={(e) =>
                      setCtaType(
                        e.target.value as "LINK" | "LEAD_FORM" | "WHATSAPP_CHAT" | "QR_CODE" | "LANDING_PAGE"
                      )
                    }
                    className="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-xs text-white"
                  >
                    <option value="LEAD_FORM">Integrated CRM Lead Capture Form</option>
                    <option value="LINK">External Link / Brand Storefront</option>
                    <option value="WHATSAPP_CHAT">WhatsApp Click-to-Chat (WABA)</option>
                    <option value="QR_CODE">Dynamic QR Tracking Link</option>
                    <option value="LANDING_PAGE">OmniBrand Landing Page Module</option>
                  </select>
                </div>

                <Input
                  label="Button / Action Text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Request Private Consultation"
                />
              </div>

              <Input
                label="Destination URL / Target Link"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://luminacreative.studio/consultation"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900 pb-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="brand" size="sm" onClick={validateAndSubmit} className="shadow-glow-brand font-bold">
            Validate & Create Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
