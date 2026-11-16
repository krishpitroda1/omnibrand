"use client";

import React, { useState, useMemo } from "react";
import { MediaAssetItem } from "@/types";
import { CampaignItem, PublishJobItem } from "@/lib/mock-data/campaigns";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  Clock,
  Plus,
  Layers,
  Send,
} from "lucide-react";

export interface CalendarDayItem {
  id: string;
  type: "ASSET" | "CAMPAIGN" | "JOB";
  title: string;
  mediaUrl: string;
  badgeLabel: string;
  platform?: string;
  status: string;
  time?: string;
  rawAsset?: MediaAssetItem;
  rawCampaign?: CampaignItem;
  rawJob?: PublishJobItem;
}

interface AssetCalendarViewProps {
  assets: MediaAssetItem[];
  campaigns?: CampaignItem[];
  publishJobs?: PublishJobItem[];
  onPreviewAsset: (asset: MediaAssetItem) => void;
  onSelectCampaign?: (campaign: CampaignItem) => void;
}

export function AssetCalendarView({
  assets,
  campaigns: propCampaigns,
  publishJobs: propJobs,
  onPreviewAsset,
  onSelectCampaign,
}: AssetCalendarViewProps) {
  const store = useAppStore();
  const allCampaigns = propCampaigns || store.campaigns || [];
  const allJobs = propJobs || store.publishJobs || [];

  // Default to November 2026 (index 10) for continuity with campaign schedule
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10);
  const [currentYear, setCurrentYear] = useState(2026);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Dynamic calendar calculation
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  }, [currentYear, currentMonthIndex]);

  const startDayOfWeek = useMemo(() => {
    return new Date(currentYear, currentMonthIndex, 1).getDay();
  }, [currentYear, currentMonthIndex]);

  // Group items by day of the selected month & year
  const itemsByDay = useMemo(() => {
    const map: Record<number, CalendarDayItem[]> = {};

    // 1. Map assets
    assets.forEach((ast) => {
      try {
        const d = new Date(ast.createdAt);
        if (d.getMonth() === currentMonthIndex && d.getFullYear() === currentYear) {
          const day = d.getDate();
          if (!map[day]) map[day] = [];
          map[day].push({
            id: ast.id,
            type: "ASSET",
            title: ast.promptUsed?.slice(0, 30) || "Media Asset",
            mediaUrl: ast.thumbnailUrl || ast.url,
            badgeLabel: ast.aspectRatio.split("_")[0],
            status: ast.status,
            time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            rawAsset: ast,
          });
        }
      } catch (e) {
        // invalid date fallback
      }
    });

    // 2. Map campaigns
    allCampaigns.forEach((camp) => {
      try {
        const d = new Date(camp.startDate);
        if (d.getMonth() === currentMonthIndex && d.getFullYear() === currentYear) {
          const day = d.getDate();
          if (!map[day]) map[day] = [];
          // Avoid duplicate display if already added
          if (!map[day].some((item) => item.id === camp.id)) {
            map[day].push({
              id: camp.id,
              type: "CAMPAIGN",
              title: camp.name,
              mediaUrl:
                camp.mediaUrl ||
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
              badgeLabel: camp.channels?.[0]?.platform || "FLIGHT",
              platform: camp.channels?.[0]?.platform,
              status: camp.status,
              time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              rawCampaign: camp,
            });
          }
        }
      } catch (e) {
        // invalid date fallback
      }
    });

    // 3. Map publish jobs
    allJobs.forEach((job) => {
      try {
        const d = new Date(job.scheduledAt);
        if (d.getMonth() === currentMonthIndex && d.getFullYear() === currentYear) {
          const day = d.getDate();
          if (!map[day]) map[day] = [];
          if (!map[day].some((item) => item.id === job.id || item.title === job.campaignName)) {
            map[day].push({
              id: job.id,
              type: "JOB",
              title: job.campaignName || `${job.platform} Post`,
              mediaUrl:
                job.mediaUrl ||
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
              badgeLabel: job.platform,
              platform: job.platform,
              status: job.status,
              time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              rawJob: job,
            });
          }
        }
      } catch (e) {
        // invalid date fallback
      }
    });

    return map;
  }, [assets, allCampaigns, allJobs, currentMonthIndex, currentYear]);

  const totalItemsInMonth = Object.values(itemsByDay).reduce(
    (sum, list) => sum + list.length,
    0
  );

  const handleItemClick = (item: CalendarDayItem) => {
    if (item.rawAsset) {
      onPreviewAsset(item.rawAsset);
    } else if (item.rawCampaign && onSelectCampaign) {
      onSelectCampaign(item.rawCampaign);
    } else {
      // Create a transient asset for preview
      onPreviewAsset({
        id: item.id,
        workspaceId: "ws-growth-lab",
        brandId: "brand-active",
        brandName: item.title,
        url: item.mediaUrl,
        thumbnailUrl: item.mediaUrl,
        aspectRatio: "SQUARE_1_1",
        format: "PNG",
        mimeType: "image/png",
        fileSize: 2048000,
        tags: [item.platform ? `#${item.platform}` : "#flight"],
        promptUsed: item.title,
        isFavorite: false,
        usageCount: 1,
        status: "APPROVED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation & Stats Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-xs">
            <CalendarIcon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {monthNames[currentMonthIndex]} {currentYear}
              </h3>
              <Badge variant="brand" size="sm">
                {totalItemsInMonth} Scheduled {totalItemsInMonth === 1 ? "Flight" : "Flights"}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Live omnichannel distribution timeline, AI asset flight dates & publishing queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrevMonth}
            className="border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 text-xs h-8 px-2.5"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCurrentMonthIndex(10);
              setCurrentYear(2026);
            }}
            className="border-slate-200 dark:border-white/10 text-xs h-8 font-semibold text-slate-800 dark:text-slate-200"
          >
            Nov 2026
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNextMonth}
            className="border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 text-xs h-8 px-2.5"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="brand"
            onClick={() => store.setCreateModalOpen(true)}
            className="text-xs h-8 ml-2 flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Flight</span>
          </Button>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-sm overflow-hidden p-4">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <div className="text-red-500/80">Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div className="text-blue-500/80">Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty spacer slots for month starting offset */}
          {Array.from({ length: startDayOfWeek }).map((_, spacerIdx) => (
            <div
              key={`spacer-${spacerIdx}`}
              className="min-h-[115px] rounded-xl border border-dashed border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-slate-950/20 opacity-40"
            />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayItems = itemsByDay[dayNum] || [];
            const hasItems = dayItems.length > 0;

            return (
              <div
                key={dayNum}
                className={`min-h-[115px] rounded-xl border p-2 flex flex-col justify-between transition-all duration-150 ${
                  hasItems
                    ? "border-blue-200 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20 shadow-xs hover:border-blue-400"
                    : "border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-slate-950/30 hover:border-slate-200 dark:hover:border-white/10"
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold ${
                      hasItems
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {hasItems && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-600 text-white font-bold leading-none shadow-xs">
                      {dayItems.length}
                    </span>
                  )}
                </div>

                {/* Day Content Thumbnails */}
                <div className="space-y-1.5 my-1.5">
                  {dayItems.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      title={`${item.title} (${item.status}) - Click to preview`}
                      className="group flex items-center gap-1.5 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-blue-500 cursor-pointer transition-all shadow-xs"
                    >
                      <div className="h-7 w-7 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-900 dark:text-white font-semibold truncate block leading-tight">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-mono">
                            {item.badgeLabel}
                          </span>
                          {item.time && (
                            <span className="text-[8px] text-slate-500 dark:text-slate-400 font-mono">
                              {item.time}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {dayItems.length > 2 && (
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold block text-center">
                      +{dayItems.length - 2} more flights
                    </span>
                  )}
                </div>

                {/* Day Status Footer */}
                <div className="text-[9px] font-mono text-right text-slate-500 dark:text-slate-400">
                  {hasItems ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-end gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                      Queued
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helpful Info Banner when empty */}
      {totalItemsInMonth === 0 && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-center space-y-3 shadow-sm">
          <div className="h-10 w-10 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              No Flights Scheduled in {monthNames[currentMonthIndex]} {currentYear}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1">
              Create and schedule a flight in the Campaign Composer to automatically distribute creatives to your calendar timeline.
            </p>
          </div>
          <Button
            size="sm"
            variant="brand"
            onClick={() => store.setCreateModalOpen(true)}
            className="text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            <span>Launch Campaign Composer</span>
          </Button>
        </div>
      )}
    </div>
  );
}
