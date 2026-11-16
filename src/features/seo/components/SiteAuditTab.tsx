"use client";

import React, { useState } from "react";
import { SEED_SITE_AUDIT_18_ISSUES } from "@/lib/seed/seo-seed";
import { SiteAuditIssueItem, AuditSeverity } from "@/types/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Wrench,
  ExternalLink,
  Plus,
  Layers,
} from "lucide-react";

export function SiteAuditTab() {
  const [issues, setIssues] = useState<SiteAuditIssueItem[]>(SEED_SITE_AUDIT_18_ISSUES);
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | "ALL">("ALL");

  const criticalCount = issues.filter((i) => i.severity === "CRITICAL").length;
  const highCount = issues.filter((i) => i.severity === "HIGH").length;
  const mediumCount = issues.filter((i) => i.severity === "MEDIUM").length;
  const lowCount = issues.filter((i) => i.severity === "LOW").length;

  const handleCreateTask = (issueId: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, hasTask: true } : i))
    );
    alert("Created technical remediation task in AI Agent Centre (delegated to SEO Agent).");
  };

  const filtered = issues.filter((i) => {
    if (selectedSeverity !== "ALL" && i.severity !== selectedSeverity) return false;
    return true;
  });

  const getSeverityBadge = (sev: AuditSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            MEDIUM
          </span>
        );
      case "LOW":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Audit Scorecard Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Overall Site Health</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">78 / 100</div>
          <span className="text-[10px] text-amber-400 font-mono">18 Technical Issues</span>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-rose-300 uppercase">Critical Blockers</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{criticalCount} Issues</div>
          <span className="text-[10px] text-rose-300/80 font-mono">Indexation & 404 Drops</span>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-amber-300 uppercase">High Priority</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{highCount} Issues</div>
          <span className="text-[10px] text-amber-300/80 font-mono">Core Web Vitals & Meta</span>
        </div>

        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-blue-300 uppercase">Medium Warnings</span>
            <Info className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">{mediumCount} Issues</div>
          <span className="text-[10px] text-blue-300/80 font-mono">Alt Tags & Links</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-500/30 bg-slate-500/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Low Notices</span>
            <ShieldAlert className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-300 font-mono mt-1">{lowCount} Issues</div>
          <span className="text-[10px] text-slate-400 font-mono">Title Lengths & Sitemap</span>
        </div>
      </div>

      {/* Filter Tabs & Issues List */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[var(--brand-primary)]" />
              <span>Technical Crawler Audit Ledger (18 Detected Issues)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Crawl depth, broken canonical loops, Core Web Vitals, and sitemap validation.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedSeverity === sev
                    ? "bg-[var(--brand-primary)] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {getSeverityBadge(item.severity)}
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-white">{item.title}</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>
                    Affected URLs: <strong className="text-white">{item.affectedUrlCount}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Impact Score: <strong className="text-amber-400">{item.impactScore}/100</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-1 border-l-2 border-white/10">
                {item.description}
              </p>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-emerald-500/20 text-xs text-emerald-300 space-y-0.5">
                <span className="font-bold text-emerald-400 block text-[11px]">
                  Recommended Engineering Remediation:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{item.recommendation}</p>
              </div>

              <div className="flex justify-end pt-1">
                {item.hasTask ? (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Task Assigned to SEO Agent</span>
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant={item.severity === "CRITICAL" ? "brand" : "outline"}
                    onClick={() => handleCreateTask(item.id)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    <span>Create Remediation Task</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
