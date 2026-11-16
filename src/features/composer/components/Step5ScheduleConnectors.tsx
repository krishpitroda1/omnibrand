"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Platform, AspectRatio } from "@/types";
import { PayloadInspector } from "./PayloadInspector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import confetti from "canvas-confetti";
import {
  Calendar,
  Clock,
  Globe,
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
  Send,
  Sliders,
  CheckCircle2,
} from "lucide-react";

const ALGORITHMIC_PRESETS = [
  { label: "Tomorrow 9:00 AM", iso: "2026-11-14T09:00" },
  { label: "Peak B2B Thursday 10:00 AM", iso: "2026-11-19T10:00" },
  { label: "Peak Instagram 7:00 PM", iso: "2026-11-15T19:00" },
  { label: "Weekend Lifestyle Saturday 11:00 AM", iso: "2026-11-21T11:00" },
];

export function Step5ScheduleConnectors({ onComplete }: { onComplete: () => void }) {
  const {
    brands,
    selectedBrandId,
    activeWorkspaceId,
    campaignName,
    selectedPlatforms,
    platformAspectRatios,
    repurposedVariants,
    generatedVariants,
    selectedVariantId,
    approvalRecord,
    scheduleMode,
    setScheduleMode,
    scheduledDate,
    setScheduledDate,
    timezone,
    setTimezone,
    perChannelSchedule,
    setPerChannelSchedule,
    utmSource,
    utmMedium,
    utmCampaign,
    setUtmValues,
    ctaType,
    ctaUrl,
    setCtaConfig,
    addCampaign,
    addMediaAsset,
    setCreateModalOpen,
    resetComposerWizard,
    setCalendarQueueDrawerOpen,
  } = useAppStore();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];
  const activeVariant =
    generatedVariants.find((v) => v.id === selectedVariantId) || generatedVariants[0];

  // Auto-calculated full URL with UTM params
  const baseTargetUrl = ctaUrl || activeBrand?.website || "https://luminacreative.studio";
  const finalUtmUrl = `${baseTargetUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;

  const handleCopyUtm = () => {
    navigator.clipboard.writeText(finalUtmUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleConfirmAndSchedule = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: [
            activeBrand?.brandKit?.primaryColor || "#E8B04B",
            "#60A5FA",
            "#34D399",
            "#F472B6",
          ],
        });
      } catch (err) {
        // Fallback gracefully
      }

      const campaignId = `cmp-${Date.now()}`;
      const newJobs = selectedPlatforms.map((platform) => ({
        id: `job-${Date.now()}-${platform.toLowerCase()}`,
        workspaceId: activeWorkspaceId,
        campaignId,
        campaignName,
        brandName: activeBrand.name,
        brandColor: activeBrand.brandKit?.primaryColor || "#3B82F6",
        platform,
        idempotencyKey: `idemp_${Date.now()}_${platform.toLowerCase()}`,
        status: "SCHEDULED" as const,
        scheduledAt: perChannelSchedule[platform] || scheduledDate,
        retryCount: 0,
        mediaUrl: activeVariant?.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
        caption:
          repurposedVariants[platform]?.caption ||
          "Campaign announcement flight dispatched through OmniBrand OS.",
      }));

      // Add to store
      addCampaign({
        id: campaignId,
        workspaceId: activeWorkspaceId,
        brandId: activeBrand.id,
        brandName: activeBrand.name,
        brandColor: activeBrand.brandKit?.primaryColor || "#3B82F6",
        name: campaignName,
        description: `Omnichannel campaign across ${selectedPlatforms.join(", ")}`,
        objective: "AWARENESS",
        budget: 5000,
        spendToDate: 0,
        ownerUserId: "usr-01-elena",
        ownerName: "Elena Rostova",
        leadsCount: 0,
        targetAudience: "Global Creative Professionals & Designers",
        ctaLinks: [
          {
            type: "LANDING_PAGE",
            displayText: "Explore Collection",
            targetUrl: finalUtmUrl,
          },
        ],
        channelBudgets: selectedPlatforms.map((p) => ({
          platform: p,
          allocatedBudget: Math.round(5000 / (selectedPlatforms.length || 1)),
          spent: 0,
          status: "SCHEDULED",
          consentGated: false,
          deliveryRate: 100,
        })),
        status: "SCHEDULED",
        startDate: scheduledDate,
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        channels: selectedPlatforms.map((p) => ({
          platform: p,
          aspectRatio: platformAspectRatios[p] || "SQUARE_1_1",
          scheduledAt: perChannelSchedule[p] || scheduledDate,
          status: "SCHEDULED",
        })),
        caption: repurposedVariants[selectedPlatforms[0]]?.caption || "Flight caption",
        hashtags: repurposedVariants[selectedPlatforms[0]]?.hashtags || ["#OmniBrand"],
        mediaUrl: activeVariant?.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
        aiModelUsed: "FLUX_1_PRO",
        approvalRecord: approvalRecord
          ? {
              actorName: approvalRecord.actorName,
              decision: approvalRecord.decision,
              notes: approvalRecord.notes,
              createdAt: approvalRecord.createdAt,
            }
          : {
              actorName: "Elena Rostova",
              decision: "APPROVED",
              notes: "Auto-approved at final schedule stage.",
              createdAt: new Date().toISOString(),
            },
        utmUrl: finalUtmUrl,
        publishJobs: newJobs,
      });

      // Persist scheduled flight directly into the Supabase database
      fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName,
          name: campaignName,
          workspaceId: activeWorkspaceId,
          brandId: activeBrand.id,
          brandName: activeBrand.name,
          objective: "AWARENESS",
          status: scheduleMode === "IMMEDIATE" ? "PUBLISHED" : "SCHEDULED",
          budget: 5000,
          spend: 0,
          startDate: scheduledDate,
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
          channels: selectedPlatforms,
          mediaUrl: activeVariant?.url,
          caption:
            repurposedVariants[selectedPlatforms[0]]?.caption ||
            "Campaign announcement flight dispatched through OmniBrand OS.",
          hashtags: repurposedVariants[selectedPlatforms[0]]?.hashtags || ["#OmniBrand"],
        }),
      }).catch((err) => console.error("Campaign DB persist failed:", err));

      if (activeVariant?.url) {
        fetch("/api/media/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId: activeWorkspaceId,
            url: activeVariant.url,
            thumbnailUrl: activeVariant.url,
            aspectRatio: platformAspectRatios[selectedPlatforms[0]] || "SQUARE_1_1",
            promptUsed: campaignName,
          }),
        }).catch((err) => console.error("Media asset DB persist failed:", err));
      }

      // Close wizard & open Calendar / Queue view
      setTimeout(() => {
        setCreateModalOpen(false);
        resetComposerWizard();
        onComplete();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Step 5: Scheduling, Connectors & Payload Verification</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Configure distribution timing, UTM tracking parameters, and inspect verified live Ayrshare/Buffer connector payloads.
        </p>
      </div>

      {/* Mode & Date Grid */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-sm backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Publishing Mode & Timing</span>
          </div>

          {/* Immediate vs Scheduled toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setScheduleMode("IMMEDIATE")}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                scheduleMode === "IMMEDIATE"
                  ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Post Immediately
            </button>
            <button
              type="button"
              onClick={() => setScheduleMode("SCHEDULED")}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                scheduleMode === "SCHEDULED"
                  ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Schedule for Later
            </button>
          </div>
        </div>

        {scheduleMode === "SCHEDULED" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-1.5 block">
                  Global Release Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-primary)] font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-1.5 block">
                  Timezone Context
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-primary)] font-medium"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">ET (Eastern Time)</option>
                  <option value="America/Los_Angeles">PT (Pacific Time)</option>
                  <option value="Europe/London">GMT / BST (London)</option>
                  <option value="Asia/Singapore">SGT (Singapore)</option>
                  <option value="Asia/Kolkata">IST (India Standard Time)</option>
                </select>
              </div>
            </div>

            {/* Algorithmic Presets Chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                Algorithmic High-Engagement Presets
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {ALGORITHMIC_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setScheduledDate(preset.iso)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-white/5 transition-all font-medium"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Per-Channel Override Table */}
            <div className="pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Per-Channel Schedule Overrides (Optional)
              </label>
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase text-slate-400">
                    <tr>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Suggested Aspect Ratio</th>
                      <th className="p-3">Channel Scheduled Slot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedPlatforms.map((plat) => (
                      <tr key={plat}>
                        <td className="p-3 font-semibold text-white">{plat}</td>
                        <td className="p-3 font-mono text-[11px] text-[var(--brand-primary)]">
                          {platformAspectRatios[plat] || "SQUARE_1_1"}
                        </td>
                        <td className="p-3">
                          <input
                            type="datetime-local"
                            value={perChannelSchedule[plat] || scheduledDate}
                            onChange={(e) => setPerChannelSchedule(plat, e.target.value)}
                            className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UTM BUILDER & CTA SELECTOR */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <LinkIcon className="h-4 w-4 text-[var(--brand-primary)]" />
          <h3 className="text-sm font-bold text-white">
            UTM Tracking Builder & CTA Action
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="utm_source"
            value={utmSource}
            onChange={(e) => setUtmValues({ source: e.target.value })}
            placeholder="e.g. instagram"
          />
          <Input
            label="utm_medium"
            value={utmMedium}
            onChange={(e) => setUtmValues({ medium: e.target.value })}
            placeholder="e.g. social_organic"
          />
          <Input
            label="utm_campaign"
            value={utmCampaign}
            onChange={(e) => setUtmValues({ campaign: e.target.value })}
            placeholder="e.g. lookbook_q4"
          />
        </div>

        {/* CTA Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Call-To-Action (CTA) Object
            </label>
            <select
              value={ctaType}
              onChange={(e) =>
                setCtaConfig(
                  e.target.value as "LINK" | "LEAD_FORM" | "WHATSAPP_CHAT" | "QR_CODE" | "LANDING_PAGE",
                  ctaUrl
                )
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-[var(--brand-primary)]"
            >
              <option value="LINK">External Link / Brand Storefront</option>
              <option value="LEAD_FORM">Integrated CRM Lead Capture Form</option>
              <option value="WHATSAPP_CHAT">WhatsApp Click-to-Chat (WABA)</option>
              <option value="QR_CODE">Dynamic QR Tracking Link</option>
              <option value="LANDING_PAGE">OmniBrand Landing Page Module</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Target Landing URL
            </label>
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaConfig(ctaType, e.target.value)}
              placeholder="https://luminacreative.studio/lookbook"
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>
        </div>

        {/* Copyable Final URL preview */}
        <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="truncate mr-2 select-all">{finalUtmUrl}</span>
          <Button variant="ghost" size="sm" onClick={handleCopyUtm} className="flex-shrink-0 text-xs">
            {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedUrl ? "Copied" : "Copy Final URL"}</span>
          </Button>
        </div>
      </div>

      {/* LIVE PAYLOAD INSPECTOR (Collapsible Per Channel) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Connector Payload Inspector ({selectedPlatforms.length} Channels)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Ayrshare &bull; Buffer &bull; Direct API
          </span>
        </div>

        <div className="space-y-2">
          {selectedPlatforms.map((plat) => (
            <PayloadInspector
              key={plat}
              platform={plat}
              caption={repurposedVariants[plat]?.caption || "Flight caption"}
              mediaUrl={activeVariant?.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80"}
              aspectRatio={platformAspectRatios[plat] || "SQUARE_1_1"}
              scheduledAt={perChannelSchedule[plat] || scheduledDate}
              hashtags={repurposedVariants[plat]?.hashtags || ["#OmniBrand"]}
              ctaUrl={finalUtmUrl}
              brandName={activeBrand.name}
              workspaceId={activeWorkspaceId}
            />
          ))}
        </div>
      </div>

      {/* Final Confirmation Banner & Dispatch */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)]/20 via-slate-900 to-slate-950 border border-[var(--brand-primary)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Ready for Idempotent Multi-Channel Dispatch</span>
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Publish jobs will be created with unique idempotency keys, exponential backoff, and dead-letter queue monitoring.
          </p>
        </div>

        <Button
          variant="brand"
          size="lg"
          onClick={handleConfirmAndSchedule}
          isLoading={isSubmitting}
          className="shadow-glow-brand font-bold text-sm whitespace-nowrap self-stretch sm:self-auto"
        >
          <Send className="h-4 w-4" />
          <span>Confirm & Schedule Campaign</span>
        </Button>
      </div>
    </div>
  );
}
