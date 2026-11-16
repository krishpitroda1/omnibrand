"use client";

import React, { useState } from "react";
import { CampaignItem } from "@/lib/mock-data/campaigns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Target,
  Layers,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Sliders,
  ExternalLink,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CampaignDetailViewProps {
  campaign: CampaignItem;
  onClose: () => void;
}

type TabKey =
  | "Overview"
  | "Channels"
  | "Content"
  | "Audience"
  | "Budget"
  | "Performance"
  | "Approvals";

export function CampaignDetailView({ campaign, onClose }: CampaignDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");
  const [channelBudgets, setChannelBudgets] = useState(campaign.channelBudgets);

  const totalAllocated = channelBudgets.reduce((acc, c) => acc + c.allocatedBudget, 0);
  const isOverAllocated = totalAllocated > campaign.budget;

  const handleBudgetSliderChange = (platform: string, newAmount: number) => {
    setChannelBudgets((prev) =>
      prev.map((c) =>
        c.platform === platform ? { ...c, allocatedBudget: newAmount } : c
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 p-6 overflow-y-auto z-10 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: campaign.brandColor }}
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{campaign.brandName}</span>
                <Badge variant="brand" size="sm">{campaign.objective}</Badge>
                <Badge variant={campaign.status === "PUBLISHED" ? "success" : "default"} size="sm">
                  {campaign.status}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{campaign.name}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{campaign.description}</p>
            </div>

            <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-white/10 text-xs">
            {(
              [
                "Overview",
                "Channels",
                "Content",
                "Audience",
                "Budget",
                "Performance",
                "Approvals",
              ] as TabKey[]
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-5">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Budget</span>
                  <div className="text-lg font-bold text-white">${campaign.budget.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Spend: ${campaign.spendToDate.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Leads Captured</span>
                  <div className="text-lg font-bold text-emerald-400">{campaign.leadsCount}</div>
                  <span className="text-[10px] text-slate-500 font-mono">Verified Opt-Ins</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Channels Active</span>
                  <div className="text-lg font-bold text-white">{campaign.channels.length}</div>
                  <span className="text-[10px] text-slate-500 font-mono">Partial Failure Isolated</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Flight Status</span>
                  <div className="text-lg font-bold text-[var(--brand-primary)]">{campaign.status}</div>
                  <span className="text-[10px] text-slate-500 font-mono">{formatDate(campaign.startDate)}</span>
                </div>
              </div>

              {/* Gantt-Lite Timeline */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3">
                <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                  Flight Timeline Gantt-Lite Schedule
                </span>
                <div className="space-y-2">
                  {campaign.channels.map((ch, idx) => (
                    <div key={ch.platform} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-white">{ch.platform}</span>
                        <span className="font-mono text-[10px]">{formatDate(ch.scheduledAt)}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-[var(--brand-primary)] rounded-full"
                          style={{
                            width: `${Math.min(100, 35 + idx * 22)}%`,
                            marginLeft: `${idx * 12}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Mix Bar Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold uppercase tracking-wider">Channel Mix Distribution</span>
                  <span className="font-mono text-slate-400">${campaign.spendToDate.toLocaleString()} spent</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  {channelBudgets.map((cb, idx) => (
                    <div
                      key={cb.platform}
                      className="h-full transition-all"
                      style={{
                        width: `${(cb.allocatedBudget / campaign.budget) * 100}%`,
                        backgroundColor:
                          idx === 0 ? "var(--brand-primary)" : idx === 1 ? "#38bdf8" : "#a855f7",
                      }}
                      title={`${cb.platform}: $${cb.allocatedBudget}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHANNELS */}
          {activeTab === "Channels" && (
            <div className="space-y-4">
              <span className="text-xs text-slate-400 block">
                Manage per-channel budget caps, delivery statistics, and consent verification requirements.
              </span>
              <div className="space-y-3">
                {channelBudgets.map((cb) => (
                  <div
                    key={cb.platform}
                    className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{cb.platform}</h4>
                        <Badge variant={cb.status === "PUBLISHED" ? "success" : "default"} size="sm">
                          {cb.status}
                        </Badge>
                        {cb.consentGated && (
                          <Badge variant="warning" size="sm">Consent-Gated</Badge>
                        )}
                      </div>
                      <span className="text-xs font-mono text-emerald-400">
                        {cb.deliveryRate}% Delivery Rate
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Budget Cap: ${cb.allocatedBudget.toLocaleString()}</span>
                        <span className="font-mono text-slate-300">Spent: ${cb.spent.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min={500}
                        max={campaign.budget}
                        step={500}
                        value={cb.allocatedBudget}
                        onChange={(e) =>
                          handleBudgetSliderChange(cb.platform, Number(e.target.value))
                        }
                        className="w-full accent-[var(--brand-primary)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT */}
          {activeTab === "Content" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Creative Artwork & Seed
                </span>
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10 max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={campaign.mediaUrl} alt="Content" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-white">Master Copy Narrative:</span>
                  <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-white/5">
                    &ldquo;{campaign.caption}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIENCE */}
          {activeTab === "Audience" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Target Audience Persona
                </span>
                <p className="text-xs text-white leading-relaxed">{campaign.targetAudience}</p>
                <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                  <Users className="h-4 w-4 text-[var(--brand-primary)]" />
                  <span>Estimated Total Addressable Audience: ~180,000 Verified Profiles</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BUDGET */}
          {activeTab === "Budget" && (
            <div className="space-y-4">
              {isOverAllocated && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Warning: Channel allocations (${totalAllocated.toLocaleString()}) exceed total campaign budget (${campaign.budget.toLocaleString()})!
                  </span>
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] text-slate-400">
                    <tr>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Cap Allocation</th>
                      <th className="p-3">Spend To Date</th>
                      <th className="p-3">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {channelBudgets.map((cb) => (
                      <tr key={cb.platform}>
                        <td className="p-3 font-semibold text-white">{cb.platform}</td>
                        <td className="p-3 font-mono">${cb.allocatedBudget.toLocaleString()}</td>
                        <td className="p-3 font-mono">${cb.spent.toLocaleString()}</td>
                        <td className="p-3 font-mono text-emerald-400">
                          ${(cb.allocatedBudget - cb.spent).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: PERFORMANCE */}
          {activeTab === "Performance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Estimated Impressions</span>
                  <div className="text-lg font-bold text-white">418.2K</div>
                  <Badge variant="metric-estimated" size="sm">ESTIMATED</Badge>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Verified CTR</span>
                  <div className="text-lg font-bold text-white">3.48%</div>
                  <Badge variant="metric-actual" size="sm">ACTUAL</Badge>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Attributed ROAS</span>
                  <div className="text-lg font-bold text-emerald-400">4.2x</div>
                  <Badge variant="metric-actual" size="sm">ACTUAL</Badge>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Cost Per Lead (CPL)</span>
                  <div className="text-lg font-bold text-white">$28.40</div>
                  <Badge variant="metric-actual" size="sm">ACTUAL</Badge>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: APPROVALS */}
          {activeTab === "Approvals" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    ApprovalRecord Compliance Check
                  </span>
                  <Badge variant="success" size="sm">Approved</Badge>
                </div>
                <p className="text-xs text-slate-300">
                  Signed off by <strong>{campaign.approvalRecord?.actorName || "Elena Rostova"}</strong> &bull; {campaign.approvalRecord?.notes || "Compliance verified"}
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Timestamp: {formatDate(campaign.approvalRecord?.createdAt || campaign.startDate)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Close */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Flight Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}
