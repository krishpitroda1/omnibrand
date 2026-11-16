"use client";

import React, { useState } from "react";
import {
  SEED_90_SEARCH_METRICS,
} from "@/lib/seed/seo-seed";
import { GscQueryItem, GscPageItem } from "@/types/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  MousePointer,
  TrendingUp,
  ArrowUpDown,
  ExternalLink,
  Layers,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

export function SearchConsoleTab() {
  const [subTab, setSubTab] = useState<"QUERIES" | "PAGES">("QUERIES");
  const [metricFilter, setMetricFilter] = useState<"CLICKS" | "IMPRESSIONS" | "CTR" | "POSITION">("CLICKS");

  // Mock Top 15 Search Console Queries
  const topQueries: GscQueryItem[] = [
    { id: "q1", query: "whatsapp business api marketing automation", clicks: 4210, impressions: 38400, ctr: 10.96, position: 1.2, previousPosition: 2.1, movement: 1 },
    { id: "q2", query: "omnichannel marketing platform enterprise", clicks: 3680, impressions: 48900, ctr: 7.52, position: 2.8, previousPosition: 4.5, movement: 2 },
    { id: "q3", query: "rcs messaging for business", clicks: 2950, impressions: 32000, ctr: 9.21, position: 1.4, previousPosition: 1.4, movement: 0 },
    { id: "q4", query: "effort vs outcome marketing matrix", clicks: 2410, impressions: 18500, ctr: 13.02, position: 1.0, previousPosition: 1.0, movement: 0 },
    { id: "q5", query: "multi touch attribution model comparison", clicks: 2180, impressions: 42000, ctr: 5.19, position: 3.6, previousPosition: 5.2, movement: 2 },
    { id: "q6", query: "ai social media auto scheduler", clicks: 1940, impressions: 34500, ctr: 5.62, position: 4.2, previousPosition: 6.0, movement: 2 },
    { id: "q7", query: "whatsapp 24 hour service window rules", clicks: 1820, impressions: 16800, ctr: 10.83, position: 1.1, previousPosition: 1.8, movement: 1 },
    { id: "q8", query: "roas vs roi marketing difference", clicks: 1640, impressions: 29000, ctr: 5.65, position: 2.4, previousPosition: 3.5, movement: 1 },
    { id: "q9", query: "generative engine optimization software", clicks: 1480, impressions: 22400, ctr: 6.60, position: 2.1, previousPosition: 4.8, movement: 3 },
    { id: "q10", query: "ayrshare social posting api", clicks: 1290, impressions: 14200, ctr: 9.08, position: 2.9, previousPosition: 3.0, movement: 0 },
    { id: "q11", query: "lead scoring algorithm for whatsapp", clicks: 1120, impressions: 18900, ctr: 5.92, position: 5.1, previousPosition: 4.8, movement: -1 },
    { id: "q12", query: "omnibrand os pricing", clicks: 980, impressions: 4200, ctr: 23.33, position: 1.0, previousPosition: 1.0, movement: 0 },
  ];

  // Top 10 Landing Pages
  const topPages: GscPageItem[] = [
    { id: "p1", url: "https://omnibrand.io/channels/whatsapp", clicks: 6840, impressions: 58000, ctr: 11.79, position: 1.4, indexStatus: "INDEXED" },
    { id: "p2", url: "https://omnibrand.io/platform/omnichannel", clicks: 5920, impressions: 72000, ctr: 8.22, position: 2.2, indexStatus: "INDEXED" },
    { id: "p3", url: "https://omnibrand.io/blog/effort-outcome-matrix", clicks: 4250, impressions: 31000, ctr: 13.71, position: 1.0, indexStatus: "INDEXED" },
    { id: "p4", url: "https://omnibrand.io/analytics/attribution", clicks: 3890, impressions: 64000, ctr: 6.07, position: 3.1, indexStatus: "INDEXED" },
    { id: "p5", url: "https://omnibrand.io/channels/rcs", clicks: 3410, impressions: 39000, ctr: 8.74, position: 1.8, indexStatus: "INDEXED" },
    { id: "p6", url: "https://omnibrand.io/ai-agent-centre", clicks: 2840, impressions: 48000, ctr: 5.91, position: 3.8, indexStatus: "INDEXED" },
    { id: "p7", url: "https://omnibrand.io/blog/roas-vs-roi", clicks: 2190, impressions: 38000, ctr: 5.76, position: 2.9, indexStatus: "INDEXED" },
    { id: "p8", url: "https://omnibrand.io/guides/whatsapp-rules", clicks: 1980, impressions: 22000, ctr: 9.00, position: 1.5, indexStatus: "INDEXED" },
  ];

  return (
    <div className="space-y-6">
      {/* 90-Day GSC Trend Visualizer */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-400" />
              <span>Google Search Console 90-Day Performance</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified first-party crawl telemetry, organic clicks, and average SERP rankings.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {(["CLICKS", "IMPRESSIONS", "CTR", "POSITION"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetricFilter(m)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  metricFilter === m
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 90-Day SVG Visual Area */}
        <div className="h-44 w-full flex items-end gap-1 pt-6 pb-2 px-2 border-b border-white/10">
          {Array.from({ length: 45 }).map((_, idx) => {
            const progress = idx / 45;
            let val = 30 + progress * 55 + ((idx * 5) % 15);
            if (metricFilter === "POSITION") {
              // Position: lower is better (top of chart)
              val = 80 - progress * 40 - ((idx * 3) % 10);
            }

            return (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/20 p-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  {metricFilter}: {Math.round(val)}
                </div>
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    metricFilter === "CLICKS"
                      ? "bg-blue-500/80 group-hover:bg-blue-400"
                      : metricFilter === "IMPRESSIONS"
                      ? "bg-indigo-500/80 group-hover:bg-indigo-400"
                      : metricFilter === "CTR"
                      ? "bg-emerald-500/80 group-hover:bg-emerald-400"
                      : "bg-amber-500/80 group-hover:bg-amber-400"
                  }`}
                  style={{ height: `${val}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono px-2">
          <span>90 Days Ago</span>
          <span>45 Days Ago</span>
          <span>Today (Live Ingestion)</span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="rounded-2xl border border-white/10 glass-card overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubTab("QUERIES")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subTab === "QUERIES"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Top Queries (Search Terms)
            </button>
            <button
              onClick={() => setSubTab("PAGES")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subTab === "PAGES"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Top Landing Pages (URLs)
            </button>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {subTab === "QUERIES" ? "12 Top Organic Queries" : "8 Top URLs"}
          </span>
        </div>

        {/* Queries Table */}
        {subTab === "QUERIES" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 text-[11px] font-mono">
                  <th className="py-2.5 px-3">QUERY</th>
                  <th className="py-2.5 px-3 text-right">CLICKS</th>
                  <th className="py-2.5 px-3 text-right">IMPRESSIONS</th>
                  <th className="py-2.5 px-3 text-right">CTR</th>
                  <th className="py-2.5 px-3 text-right">AVG POSITION</th>
                  <th className="py-2.5 px-3 text-right">MOVEMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topQueries.map((q) => (
                  <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      {q.query}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                      {q.clicks.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {q.impressions.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400">
                      {q.ctr}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-white font-bold">
                      #{q.position.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {q.movement > 0 ? (
                        <span className="inline-flex items-center text-emerald-400 font-bold">
                          <ArrowUp className="h-3 w-3 mr-0.5" /> +{q.movement}
                        </span>
                      ) : q.movement < 0 ? (
                        <span className="inline-flex items-center text-rose-400 font-bold">
                          <ArrowDown className="h-3 w-3 mr-0.5" /> {q.movement}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-500">
                          <Minus className="h-3 w-3 mr-0.5" /> 0
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Pages Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 text-[11px] font-mono">
                  <th className="py-2.5 px-3">LANDING PAGE URL</th>
                  <th className="py-2.5 px-3 text-right">CLICKS</th>
                  <th className="py-2.5 px-3 text-right">IMPRESSIONS</th>
                  <th className="py-2.5 px-3 text-right">CTR</th>
                  <th className="py-2.5 px-3 text-right">AVG POSITION</th>
                  <th className="py-2.5 px-3 text-right">INDEX STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topPages.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-300">
                      <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center gap-1">
                        <span>{p.url}</span>
                        <ExternalLink className="h-3 w-3 text-slate-500" />
                      </a>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                      {p.clicks.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {p.impressions.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400">
                      {p.ctr}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-white font-bold">
                      #{p.position.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {p.indexStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
