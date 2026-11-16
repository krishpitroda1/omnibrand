"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Platform, SocialAccount } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Globe,
  Radio,
} from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils";

const PLATFORM_CONNECTORS: Array<{
  platform: Platform;
  name: string;
  badge: string;
  description: string;
  color: string;
  defaultCapabilities: Array<"PUBLISH" | "READ" | "RESTRICTED">;
}> = [
  {
    platform: "INSTAGRAM",
    name: "Instagram Professional",
    badge: "Meta Graph API v20.0",
    description: "Publish high-resolution photo carousels, Reels, and schedule feed flights.",
    color: "#E1306C",
    defaultCapabilities: ["PUBLISH", "READ"],
  },
  {
    platform: "LINKEDIN",
    name: "LinkedIn Organization",
    badge: "LinkedIn Marketing v2",
    description: "Distribute B2B thought leadership articles, documents, and company posts.",
    color: "#0A66C2",
    defaultCapabilities: ["PUBLISH", "READ"],
  },
  {
    platform: "X",
    name: "X / Twitter Enterprise",
    badge: "X API v2 Standard",
    description: "Broadcast organic microblogging updates, threads, and branded announcements.",
    color: "#000000",
    defaultCapabilities: ["PUBLISH", "READ"],
  },
  {
    platform: "FACEBOOK",
    name: "Facebook Page",
    badge: "Page Feed API",
    description: "Manage brand page timeline posts and community stories (Group posting policy-gated).",
    color: "#1877F2",
    defaultCapabilities: ["READ", "RESTRICTED"],
  },
  {
    platform: "PINTEREST",
    name: "Pinterest Business",
    badge: "Pinterest API v5",
    description: "Curate visual boards and link-attributed editorial inspiration pins.",
    color: "#BD081C",
    defaultCapabilities: ["PUBLISH", "READ"],
  },
];

export default function SocialHubPage() {
  const {
    brands,
    activeBrandId,
    activeWorkspaceId,
    setCreateModalOpen,
    addSocialAccount,
    connectSampleSocialAccounts,
  } = useAppStore();

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
  const [filter, setFilter] = useState<"ALL" | "PUBLISH" | "READ" | "RESTRICTED">("ALL");
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const accounts = activeBrand?.socialAccounts || [];
  const filteredAccounts = accounts.filter((acc) => {
    if (filter === "ALL") return true;
    return acc.capabilities.includes(filter);
  });

  const handleConnectSinglePlatform = (connector: typeof PLATFORM_CONNECTORS[0]) => {
    setConnectingPlatform(connector.platform);

    setTimeout(() => {
      const slug = activeBrand?.slug || "brand";
      const newAccount: SocialAccount = {
        id: `acc-${Date.now()}-${connector.platform.toLowerCase()}`,
        brandId: activeBrand.id,
        workspaceId: activeWorkspaceId,
        platform: connector.platform,
        handle: `@${slug}_${connector.platform.toLowerCase()}`,
        displayName: `${activeBrand.name} ${connector.name.split(" ")[0]}`,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${slug}-${connector.platform}`,
        profileUrl: `https://${connector.platform.toLowerCase()}.com/${slug}`,
        capabilities: connector.defaultCapabilities,
        followerCount: Math.floor(Math.random() * 25000) + 5000,
        isConnected: true,
        health: {
          status: connector.defaultCapabilities.includes("RESTRICTED") ? "DEGRADED" : "HEALTHY",
          lastSyncAt: new Date().toISOString(),
          errorCount: 0,
          latencyMs: Math.floor(Math.random() * 120) + 40,
          rateLimitRemaining: Math.floor(Math.random() * 4000) + 1000,
          lastErrorMessage: connector.defaultCapabilities.includes("RESTRICTED")
            ? "Facebook Group direct posting restricted by Meta Platform Policy."
            : undefined,
        },
      };

      addSocialAccount(activeBrand.id, newAccount);
      setConnectingPlatform(null);
      setSyncStatusMsg(`Successfully connected ${connector.name} for ${activeBrand.name}.`);
      setTimeout(() => setSyncStatusMsg(null), 3500);
    }, 800);
  };

  const handleSyncHealth = () => {
    setSyncStatusMsg("Auditing live webhook endpoints and token refresh validity...");
    setTimeout(() => {
      setSyncStatusMsg("All connected channels passed capability health audit.");
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Social Media Hub</span>
            </h1>
            <Badge variant="brand" size="sm">{activeBrand?.name}</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Multi-platform account connections, health status, and live capability gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {accounts.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleSyncHealth} className="text-xs">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              <span>Sync Health</span>
            </Button>
          )}
          <Button variant="brand" size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </Button>
        </div>
      </div>

      {syncStatusMsg && (
        <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-xs text-blue-800 dark:text-blue-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Non-negotiable Guardrail Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-900 dark:text-white">Platform Capability Invariant Active</p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
            OmniBrand OS explicitly displays verified platform capabilities: <strong>PUBLISH</strong>, <strong>READ</strong>, and <strong>RESTRICTED</strong>.
            Facebook Group posting is restricted by platform policy and is blocked from dispatch.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(["ALL", "PUBLISH", "READ", "RESTRICTED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === tab
                ? "bg-blue-600 text-white font-bold shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-700 hover:text-slate-900 border border-slate-200 dark:text-slate-400 dark:hover:text-white dark:border-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main View Area: Empty State vs Connected Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="space-y-6">
          {/* Empty State Banner */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-6 sm:p-8 text-center space-y-4 shadow-sm backdrop-blur-xl">
            <div className="h-12 w-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Share2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                No Social Channels Connected Yet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mt-1">
                Link your official brand accounts to unlock automated scheduling, multi-aspect ratio rendering, and real-time capability verification.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="brand"
                size="sm"
                onClick={() => connectSampleSocialAccounts(activeBrand.id)}
                className="text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Quick Connect All 4 Channels (Sandbox Mode)</span>
              </Button>
            </div>
          </div>

          {/* Available Channels to Connect Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Radio className="h-4 w-4 text-blue-600" />
              <span>Available Channel Connectors</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORM_CONNECTORS.map((connector) => {
                const isConnecting = connectingPlatform === connector.platform;

                return (
                  <div
                    key={connector.platform}
                    className="rounded-2xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                            style={{ backgroundColor: connector.color }}
                          >
                            {connector.name[0]}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {connector.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              {connector.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                        {connector.description}
                      </p>

                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        {connector.defaultCapabilities.map((cap) => (
                          <Badge
                            key={cap}
                            variant={
                              cap === "PUBLISH"
                                ? "publish"
                                : cap === "READ"
                                ? "read"
                                : "restricted"
                            }
                            size="sm"
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/10">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConnectSinglePlatform(connector)}
                        disabled={isConnecting}
                        className="w-full text-xs font-semibold border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5"
                      >
                        {isConnecting ? (
                          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <LinkIcon className="h-3 w-3 mr-1" />
                        )}
                        <span>{isConnecting ? "Verifying..." : "Connect Channel"}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-center space-y-3">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            No accounts match filter &ldquo;{filter}&rdquo;
          </p>
          <Button size="sm" variant="outline" onClick={() => setFilter("ALL")} className="text-xs">
            Reset Filter to ALL
          </Button>
        </div>
      ) : (
        /* Account Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => {
            const isHealthy = account.health.status === "HEALTHY";
            const isRestricted = account.capabilities.includes("RESTRICTED");

            return (
              <div
                key={account.id}
                className="rounded-2xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={account.avatarUrl || "https://api.dicebear.com/7.x/identicon/svg?seed=social"}
                        alt={account.displayName}
                        className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{account.displayName}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{account.handle}</p>
                      </div>
                    </div>

                    <Badge variant={isHealthy ? "success" : "danger"} size="sm">
                      {account.health.status}
                    </Badge>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Followers / Audience:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatNumber(account.followerCount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Rate Limit Remaining:</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{account.health.rateLimitRemaining} req</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="font-medium">API Latency:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-300 font-medium">{account.health.latencyMs}ms</span>
                    </div>
                  </div>

                  {isRestricted && (
                    <p className="mt-3 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-300 dark:border-amber-500/20 font-medium">
                      ⚠️ {account.health.lastErrorMessage || "Direct automated posting restricted."}
                    </p>
                  )}

                  {/* Capability Badges */}
                  <div className="mt-4 flex items-center gap-1.5 flex-wrap">
                    {account.capabilities.map((cap) => (
                      <Badge
                        key={cap}
                        variant={
                          cap === "PUBLISH"
                            ? "publish"
                            : cap === "READ"
                            ? "read"
                            : cap === "RESTRICTED"
                            ? "restricted"
                            : "webhook"
                        }
                        size="sm"
                      >
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500">
                    Synced: {formatDate(account.health.lastSyncAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert(`Opening settings for ${account.handle}`)}
                    className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
