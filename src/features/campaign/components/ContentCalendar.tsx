"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  Layers,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Share2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

export function ContentCalendar() {
  const {
    campaigns,
    publishJobs,
    retryPublishJob,
    simulateWorkerTick,
    setCreateModalOpen,
  } = useAppStore();

  const [filterPlatform, setFilterPlatform] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Simulated background publishing worker effect (dev only)
  useEffect(() => {
    const interval = setInterval(() => {
      simulateWorkerTick();
    }, 14000);
    return () => clearInterval(interval);
  }, [simulateWorkerTick]);

  const filteredJobs = publishJobs.filter((job) => {
    if (filterPlatform !== "ALL" && job.platform !== filterPlatform) return false;
    if (filterStatus !== "ALL" && job.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarIcon className="h-6 w-6 text-[var(--brand-primary)]" />
            <span>Content Calendar & Real-Time Job Queue</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Automated queue worker advancing jobs with exponential backoff and isolated partial-failure retry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={simulateWorkerTick}
            className="text-xs flex items-center gap-1.5"
            title="Force immediate worker execution tick"
          >
            <Play className="h-3 w-3 text-emerald-400" />
            <span>Simulate Worker Tick</span>
          </Button>
          <Button variant="brand" size="sm" onClick={() => setCreateModalOpen(true)}>
            <span>+ Create Flight</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-semibold">Filter Channel:</span>
          {(["ALL", "INSTAGRAM", "LINKEDIN", "X", "PINTEREST", "FACEBOOK"] as const).map(
            (plat) => (
              <button
                key={plat}
                onClick={() => setFilterPlatform(plat)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterPlatform === plat
                    ? "bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] font-bold border border-[var(--brand-primary)]/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {plat}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Status:</span>
          {(["ALL", "SCHEDULED", "PUBLISHING", "PUBLISHED", "FAILED"] as const).map(
            (stat) => (
              <button
                key={stat}
                onClick={() => setFilterStatus(stat)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterStatus === stat
                    ? "bg-white/15 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {stat}
              </button>
            )
          )}
        </div>
      </div>

      {/* 2-Column Calendar & Live Job Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scheduled Campaigns Calendar Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>Upcoming Campaign Flights ({campaigns.length})</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              November 2026 Flight Timeline
            </span>
          </div>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 glass-card space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-white/10"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={camp.mediaUrl}
                        alt={camp.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{camp.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{camp.brandName}</p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      camp.status === "PUBLISHED"
                        ? "success"
                        : camp.status === "PUBLISHING"
                        ? "brand"
                        : camp.status === "PARTIAL" || camp.status === "FAILED"
                        ? "warning"
                        : "default"
                    }
                    size="sm"
                  >
                    {camp.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 italic line-clamp-2">
                  &ldquo;{camp.caption}&rdquo;
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {camp.channels?.map((ch) => (
                      <span
                        key={ch.platform}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5 font-mono"
                      >
                        {ch.platform} &bull; {ch.aspectRatio}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] font-mono">
                    {formatDate(camp.startDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-Time Worker Publish Job Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Publish Job Dispatcher ({filteredJobs.length})</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono animate-pulse">
              ● Worker Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredJobs.map((job) => {
              const isFailed = job.status === "FAILED";
              const isPublishing = job.status === "PUBLISHING";
              const isDone = job.status === "PUBLISHED";

              return (
                <div
                  key={job.id}
                  className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                    isPublishing
                      ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]"
                      : isFailed
                      ? "bg-rose-500/10 border-rose-500/30"
                      : isDone
                      ? "bg-slate-950/60 border-white/5"
                      : "bg-slate-900/60 border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{job.platform}</span>
                      <Badge
                        variant={
                          isDone
                            ? "success"
                            : isPublishing
                            ? "brand"
                            : isFailed
                            ? "danger"
                            : "default"
                        }
                        size="sm"
                        className="text-[9px]"
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatTime(job.scheduledAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium truncate">
                    {job.campaignName}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="truncate max-w-[180px]">{job.idempotencyKey}</span>
                    <span>Retries: {job.retryCount}/3</span>
                  </div>

                  {job.errorMessage && (
                    <p className="text-[10px] text-rose-300 bg-rose-500/20 p-2 rounded-lg">
                      {job.errorMessage}
                    </p>
                  )}

                  {isFailed && (
                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => retryPublishJob(job.id)}
                        className="text-xs text-amber-300 border-amber-500/30"
                      >
                        <RotateCw className="h-3 w-3" /> Retry Dispatch
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
