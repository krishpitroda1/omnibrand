"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Layers,
  Filter,
  GitFork,
  Sliders,
  Radio,
  FileText,
  Download,
  ShieldCheck,
} from "lucide-react";
import { OverviewTab } from "@/features/analytics/components/OverviewTab";
import { ChannelPerformanceTab } from "@/features/analytics/components/ChannelPerformanceTab";
import { CampaignFunnelTab } from "@/features/analytics/components/CampaignFunnelTab";
import { AttributionTab } from "@/features/analytics/components/AttributionTab";
import { EffortMatrixTab } from "@/features/analytics/components/EffortMatrixTab";
import { SocialListeningTab } from "@/features/analytics/components/SocialListeningTab";
import { ReportsTab } from "@/features/analytics/components/ReportsTab";

export default function AnalyticsRoiPage() {
  const { brands, activeBrandId } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const [activeTab, setActiveTab] = useState<
    | "OVERVIEW"
    | "CHANNELS"
    | "CAMPAIGNS"
    | "ATTRIBUTION"
    | "EFFORT_MATRIX"
    | "LISTENING"
    | "REPORTS"
  >("OVERVIEW");

  const tabs = [
    { id: "OVERVIEW", label: "Overview", icon: BarChart3 },
    { id: "CHANNELS", label: "Channels", icon: Layers },
    { id: "CAMPAIGNS", label: "Campaigns", icon: Filter },
    { id: "ATTRIBUTION", label: "Attribution", icon: GitFork },
    { id: "EFFORT_MATRIX", label: "Effort Matrix", icon: Sliders, badge: "Signature" },
    { id: "LISTENING", label: "Listening", icon: Radio, badge: "300 Live" },
    { id: "REPORTS", label: "Reports", icon: FileText },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <BarChart3 className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>08 — Analytics & Attribution Engine</span>
            </h1>
            <Badge variant="brand" size="sm">{activeBrand?.name}</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Certified multi-touch revenue attribution, channel capital efficiency, social brand listening, and effort optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("REPORTS")}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-white/10 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/20 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{tab.label}</span>
              {"badge" in tab && tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-white/10"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Area */}
      <div className="pt-2">
        {activeTab === "OVERVIEW" && <OverviewTab activeBrandName={activeBrand?.name || "Apex"} />}
        {activeTab === "CHANNELS" && <ChannelPerformanceTab />}
        {activeTab === "CAMPAIGNS" && <CampaignFunnelTab />}
        {activeTab === "ATTRIBUTION" && <AttributionTab />}
        {activeTab === "EFFORT_MATRIX" && <EffortMatrixTab />}
        {activeTab === "LISTENING" && <SocialListeningTab />}
        {activeTab === "REPORTS" && <ReportsTab />}
      </div>
    </div>
  );
}
