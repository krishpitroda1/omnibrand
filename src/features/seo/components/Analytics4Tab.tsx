"use client";

import React, { useState } from "react";
import { Ga4ChannelItem, Ga4LandingPageItem } from "@/types/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Users,
  Clock,
  TrendingUp,
  ExternalLink,
  Target,
  ArrowUpDown,
} from "lucide-react";

export function Analytics4Tab() {
  const channelData: Ga4ChannelItem[] = [
    { id: "c1", channelGroup: "Organic Search", sessions: 54200, engagementRate: 64.2, conversions: 2180, revenue: 142000, bounceRate: 35.8 },
    { id: "c2", channelGroup: "Paid Search (Google Ads)", sessions: 38400, engagementRate: 58.5, conversions: 1840, revenue: 118400, bounceRate: 41.5 },
    { id: "c3", channelGroup: "Direct Traffic", sessions: 28900, engagementRate: 72.1, conversions: 1420, revenue: 84500, bounceRate: 27.9 },
    { id: "c4", channelGroup: "Organic Social", sessions: 24500, engagementRate: 51.4, conversions: 890, revenue: 46200, bounceRate: 48.6 },
    { id: "c5", channelGroup: "Email Newsletter & Sequences", sessions: 19800, engagementRate: 78.6, conversions: 1240, revenue: 68400, bounceRate: 21.4 },
    { id: "c6", channelGroup: "Referral & Backlinks", sessions: 11200, engagementRate: 61.0, conversions: 480, revenue: 26800, bounceRate: 39.0 },
  ];

  const landingPages: Ga4LandingPageItem[] = [
    { id: "lp1", path: "/platform/omnichannel", title: "Omnichannel Marketing Platform", sessions: 32400, avgEngagementTime: "2m 48s", bounceRate: 32.4, conversions: 1420 },
    { id: "lp2", path: "/channels/whatsapp", title: "WhatsApp Business API Marketing", sessions: 28500, avgEngagementTime: "3m 15s", bounceRate: 28.1, conversions: 1680 },
    { id: "lp3", path: "/pricing", title: "Transparent SaaS Pricing & Plans", sessions: 22100, avgEngagementTime: "1m 55s", bounceRate: 34.0, conversions: 1140 },
    { id: "lp4", path: "/blog/effort-outcome-matrix", title: "Effort vs Outcome Marketing Matrix", sessions: 18900, avgEngagementTime: "4m 12s", bounceRate: 24.5, conversions: 890 },
    { id: "lp5", path: "/ai-agent-centre", title: "Autonomous Marketing AI Agents", sessions: 16400, avgEngagementTime: "3m 40s", bounceRate: 31.8, conversions: 740 },
    { id: "lp6", path: "/channels/rcs", title: "RCS Enterprise Messaging Hub", sessions: 12800, avgEngagementTime: "2m 20s", bounceRate: 38.2, conversions: 460 },
  ];

  const totalSessions = channelData.reduce((acc, curr) => acc + curr.sessions, 0);
  const totalConversions = channelData.reduce((acc, curr) => acc + curr.conversions, 0);

  return (
    <div className="space-y-6">
      {/* GA4 Macro Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">GA4 Total Sessions</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {totalSessions.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">+16.8% vs prior 90d</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">GA4 Key Conversions</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {totalConversions.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">4.51% blended conversion rate</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Avg Engagement Time</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            2m 54s
          </div>
          <span className="text-[10px] text-slate-400 font-mono">+28s session depth</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">GA4 Bounce Rate</span>
          <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">
            34.2%
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">-4.1% improvement</span>
        </div>
      </div>

      {/* Channel Grouping Performance Table */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>GA4 Default Channel Grouping Acquisition Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Traffic acquisition volume, on-site engagement rate, and attributed web conversions.
            </p>
          </div>
          <Badge variant="brand" size="sm">GA4 Stream Active</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 text-[11px] font-mono">
                <th className="py-2.5 px-3">CHANNEL GROUP</th>
                <th className="py-2.5 px-3 text-right">SESSIONS</th>
                <th className="py-2.5 px-3 text-right">ENGAGEMENT RATE</th>
                <th className="py-2.5 px-3 text-right">BOUNCE RATE</th>
                <th className="py-2.5 px-3 text-right">CONVERSIONS</th>
                <th className="py-2.5 px-3 text-right">ATTRIBUTED VALUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {channelData.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {c.channelGroup}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {c.sessions.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                    {c.engagementRate}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    {c.bounceRate}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                    {c.conversions.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                    ${c.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Landing Page Performance Table */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <h3 className="text-sm font-bold text-white">
          Landing Page Behavioral Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 text-[11px] font-mono">
                <th className="py-2.5 px-3">PAGE PATH & TITLE</th>
                <th className="py-2.5 px-3 text-right">SESSIONS</th>
                <th className="py-2.5 px-3 text-right">AVG TIME</th>
                <th className="py-2.5 px-3 text-right">BOUNCE RATE</th>
                <th className="py-2.5 px-3 text-right">CONVERSIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {landingPages.map((lp) => (
                <tr key={lp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{lp.title}</div>
                    <div className="font-mono text-slate-400 text-[10px]">{lp.path}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {lp.sessions.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                    {lp.avgEngagementTime}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    {lp.bounceRate}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                    {lp.conversions.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
