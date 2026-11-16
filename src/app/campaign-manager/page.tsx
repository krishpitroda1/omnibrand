"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { CampaignItem } from "@/lib/mock-data/campaigns";
import { CampaignListView } from "@/features/campaign/components/CampaignListView";
import { CampaignDetailView } from "@/features/campaign/components/CampaignDetailView";
import { CreateCampaignDrawer } from "@/features/campaign/components/CreateCampaignDrawer";
import { ContentCalendar } from "@/features/campaign/components/ContentCalendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Calendar, Table, Plus } from "lucide-react";

export default function CampaignManagerPage() {
  const { campaigns, brands, activeBrandId } = useAppStore();
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const [activeTab, setActiveTab] = useState<"TABLE" | "CALENDAR">("TABLE");
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Megaphone className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>Campaign Manager</span>
            </h1>
            <Badge variant="brand" size="sm">{activeBrand?.name}</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Multi-brand campaign flights, budget caps, objective-driven CTAs, and live publishing queues.
          </p>
        </div>

        {/* View Switcher Tabs & Create Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs shadow-sm">
            <button
              onClick={() => setActiveTab("TABLE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === "TABLE"
                  ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span>Flights Table</span>
            </button>
            <button
              onClick={() => setActiveTab("CALENDAR")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === "CALENDAR"
                  ? "bg-[var(--brand-primary)] text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Calendar & Queue</span>
            </button>
          </div>

          <Button variant="brand" size="sm" onClick={() => setCreateDrawerOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Flight</span>
          </Button>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === "TABLE" ? (
        <CampaignListView
          campaigns={campaigns}
          onSelectCampaign={(c) => setSelectedCampaign(c)}
          onCreateClick={() => setCreateDrawerOpen(true)}
        />
      ) : (
        <ContentCalendar />
      )}

      {/* Detail Inspector Drawer */}
      {selectedCampaign && (
        <CampaignDetailView
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}

      {/* Create Campaign Drawer */}
      <CreateCampaignDrawer
        isOpen={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onCampaignCreated={(newCamp) => setSelectedCampaign(newCamp)}
      />
    </div>
  );
}
