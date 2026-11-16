"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Building,
} from "lucide-react";

export function ReportsTab() {
  const [reportTitle, setReportTitle] = useState("Q4 Omnichannel Board Performance Brief");
  const [selectedKpis, setSelectedKpis] = useState<string[]>([
    "Attributed Revenue",
    "Marketing Spend",
    "ROAS",
    "Blended ROI",
    "Qualified Leads",
  ]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "Google Search",
    "Instagram",
    "WhatsApp",
    "Email",
    "LinkedIn",
    "RCS",
  ]);
  const [dateRange, setDateRange] = useState<string>("Last 90 Days");
  const [isWhiteLabel, setIsWhiteLabel] = useState<boolean>(true);
  const [companyTitle, setCompanyTitle] = useState<string>("OmniBrand Enterprise Agency Client");
  const [schedule, setSchedule] = useState<string>("WEEKLY_MONDAY");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const allKpis = [
    "Attributed Revenue",
    "Marketing Spend",
    "ROAS",
    "Blended ROI",
    "Qualified Leads",
    "Closed Conversions",
    "Customer Acquisition Cost (CAC)",
    "Customer Lifetime Value (LTV)",
  ];

  const allChannels = [
    "Google Search",
    "Instagram",
    "WhatsApp",
    "LinkedIn",
    "Email",
    "RCS",
    "SMS",
    "X",
    "Voice/IVR",
  ];

  const toggleKpi = (kpi: string) => {
    setSelectedKpis((prev) =>
      prev.includes(kpi) ? prev.filter((k) => k !== kpi) : [...prev, kpi]
    );
  };

  const toggleChannel = (ch: string) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value,DataQuality,Period\n" +
      "Attributed Revenue,$368420,ACTUAL,Last 90 Days\n" +
      "Marketing Spend,$76950,ACTUAL,Last 90 Days\n" +
      "ROAS,4.79x,ACTUAL,Last 90 Days\n" +
      "Blended ROI,278.4%,ESTIMATED,Last 90 Days\n" +
      "Qualified Leads,2418,ACTUAL,Last 90 Days\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `omnibrand-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Certified Executive PDF "${reportTitle}" has been generated and downloaded.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--brand-primary)]" />
            <span>Custom Executive Report & Export Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Assemble multi-channel attribution briefs, customize white-label branding, and schedule recurring delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="h-3.5 w-3.5" />
            <span>Export Raw CSV</span>
          </Button>
          <Button variant="brand" size="sm" onClick={handleExportPdf} disabled={isExporting}>
            <Printer className="h-3.5 w-3.5" />
            <span>{isExporting ? "Compiling PDF..." : "Generate PDF Brief"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration Controls (2 Cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Report Metadata */}
          <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              1. Report Details & Date Range
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Report Document Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Reporting Period
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--brand-primary)]"
                >
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                  <option value="Last 12 Months">Last 12 Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Select KPIs */}
          <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              2. Selected Financial KPIs & Unit Economics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allKpis.map((kpi) => {
                const isSelected = selectedKpis.includes(kpi);
                return (
                  <button
                    key={kpi}
                    onClick={() => toggleKpi(kpi)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? "bg-[var(--brand-primary)]/15 border-[var(--brand-primary)] text-white font-bold"
                        : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{kpi}</span>
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-[var(--brand-primary)] flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Select Channels */}
          <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              3. Channel Telemetry Inclusions
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {allChannels.map((ch) => {
                const isSelected = selectedChannels.includes(ch);
                return (
                  <button
                    key={ch}
                    onClick={() => toggleChannel(ch)}
                    className={`p-2 rounded-xl border text-center text-xs transition-all ${
                      isSelected
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold"
                        : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. White-Label & Enterprise Branding */}
          <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building className="h-4 w-4 text-cyan-400" />
                  <span>White-Label Branding (ENTERPRISE Plan)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Replace OmniBrand OS badges with agency client credentials.
                </p>
              </div>
              <button
                onClick={() => setIsWhiteLabel(!isWhiteLabel)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  isWhiteLabel ? "bg-[var(--brand-primary)]" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isWhiteLabel ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {isWhiteLabel && (
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Custom Client Header Label
                </label>
                <input
                  type="text"
                  value={companyTitle}
                  onChange={(e) => setCompanyTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Document Live Preview & Schedule */}
        <div className="space-y-5">
          {/* Document Preview Card */}
          <div className="p-5 rounded-2xl border border-white/15 bg-slate-950 space-y-4 shadow-xl">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                PDF LIVE PREVIEW
              </span>
              <Badge variant="brand" size="sm">Confidential</Badge>
            </div>

            <div className="space-y-3 font-sans">
              <div className="text-sm font-bold text-white leading-tight">
                {reportTitle}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Prepared for: <span className="text-cyan-400 font-semibold">{companyTitle}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Window: {dateRange} • Generated: {new Date().toLocaleDateString()}
              </div>

              {/* Sample Metrics Mini Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <div className="p-2 rounded bg-slate-900 border border-white/5">
                  <div className="text-[9px] text-slate-400">Attributed Revenue</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono">$368,420</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-white/5">
                  <div className="text-[9px] text-slate-400">Blended ROAS</div>
                  <div className="text-xs font-bold text-cyan-400 font-mono">4.79x</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-white/5">
                  <div className="text-[9px] text-slate-400">Ad Spend</div>
                  <div className="text-xs font-bold text-white font-mono">$76,950</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-white/5">
                  <div className="text-[9px] text-slate-400">Total Leads</div>
                  <div className="text-xs font-bold text-white font-mono">2,418</div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 pt-1">
                Included Channels ({selectedChannels.length}): {selectedChannels.slice(0, 4).join(", ")}
                {selectedChannels.length > 4 && ` +${selectedChannels.length - 4} more`}
              </div>
            </div>

            <Button variant="brand" className="w-full text-xs" onClick={handleExportPdf}>
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              <span>Download High-Res PDF</span>
            </Button>
          </div>

          {/* Automated Schedule Card */}
          <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>Automated Delivery Schedule</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { id: "WEEKLY_MONDAY", label: "Every Monday at 08:00 AM", sub: "Delivered to CFO & Marketing VP" },
                { id: "MONTHLY_FIRST", label: "1st of Every Month", sub: "Board of Directors comprehensive audit" },
                { id: "DAILY_DIGEST", label: "Daily 24h Telemetry Digest", sub: "Operational campaign manager update" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    schedule === opt.id
                      ? "bg-slate-900 border-[var(--brand-primary)] text-white"
                      : "bg-slate-950/60 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="schedule"
                    checked={schedule === opt.id}
                    onChange={() => setSchedule(opt.id)}
                    className="mt-0.5 text-[var(--brand-primary)]"
                  />
                  <div>
                    <div className="font-bold text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-500">{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => alert(`Saved recurring schedule: ${schedule}`)}
            >
              <span>Save Schedule</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
