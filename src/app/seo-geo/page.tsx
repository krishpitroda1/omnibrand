"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Search,
  BarChart,
  MapPin,
  KeyRound,
  Wrench,
  FileCode,
  Bot,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { SeoOverviewTab } from "@/features/seo/components/SeoOverviewTab";
import { SearchConsoleTab } from "@/features/seo/components/SearchConsoleTab";
import { Analytics4Tab } from "@/features/seo/components/Analytics4Tab";
import { BusinessProfileTab } from "@/features/seo/components/BusinessProfileTab";
import { KeywordsTab } from "@/features/seo/components/KeywordsTab";
import { SiteAuditTab } from "@/features/seo/components/SiteAuditTab";
import { ContentOptimizationTab } from "@/features/seo/components/ContentOptimizationTab";
import { GeoAeoTab } from "@/features/seo/components/GeoAeoTab";

export default function SeoGeoPage() {
  const { brands, activeBrandId } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const [activeTab, setActiveTab] = useState<
    | "OVERVIEW"
    | "SEARCH_CONSOLE"
    | "ANALYTICS_4"
    | "BUSINESS_PROFILE"
    | "KEYWORDS"
    | "SITE_AUDIT"
    | "CONTENT_OPTIMISATION"
    | "GEO_AEO"
  >("OVERVIEW");

  const tabs = [
    { id: "OVERVIEW", label: "Overview", icon: Compass },
    { id: "SEARCH_CONSOLE", label: "Search Console", icon: Search },
    { id: "ANALYTICS_4", label: "Analytics 4", icon: BarChart },
    { id: "BUSINESS_PROFILE", label: "Business Profile", icon: MapPin },
    { id: "KEYWORDS", label: "Keywords", icon: KeyRound, badge: "45 Tracked" },
    { id: "SITE_AUDIT", label: "Site Audit", icon: Wrench, badge: "18 Issues" },
    { id: "CONTENT_OPTIMISATION", label: "Content Optimisation", icon: FileCode },
    { id: "GEO_AEO", label: "GEO / AEO", icon: Bot, badge: "82 Ready" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Compass className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>09 — Search Visibility & Generative Engine Intelligence</span>
            </h1>
            <Badge variant="brand" size="sm">{activeBrand?.name}</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Organic crawl telemetry, SERP keyword tracking, technical crawler audit, local maps, and LLM answer engine readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="brand"
            size="sm"
            onClick={() => setActiveTab("GEO_AEO")}
          >
            <Bot className="h-3.5 w-3.5 mr-1" />
            <span>Audit GEO Readiness</span>
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
                  ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/20 font-bold"
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
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/10"
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
        {activeTab === "OVERVIEW" && <SeoOverviewTab activeBrandName={activeBrand?.name || "Apex"} />}
        {activeTab === "SEARCH_CONSOLE" && <SearchConsoleTab />}
        {activeTab === "ANALYTICS_4" && <Analytics4Tab />}
        {activeTab === "BUSINESS_PROFILE" && <BusinessProfileTab />}
        {activeTab === "KEYWORDS" && <KeywordsTab />}
        {activeTab === "SITE_AUDIT" && <SiteAuditTab />}
        {activeTab === "CONTENT_OPTIMISATION" && <ContentOptimizationTab />}
        {activeTab === "GEO_AEO" && <GeoAeoTab />}
      </div>
    </div>
  );
}
