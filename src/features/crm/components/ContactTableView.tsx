"use client";

import React, { useState, useMemo } from "react";
import { CrmContactItem, LifecycleStage, ConsentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  User,
  MessageSquare,
  Instagram,
  Linkedin,
  Mail,
  QrCode,
  Globe,
  ArrowUpDown,
  Download,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

interface ContactTableViewProps {
  contacts: CrmContactItem[];
  onSelectContact: (contact: CrmContactItem) => void;
}

export function ContactTableView({
  contacts,
  onSelectContact,
}: ContactTableViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const [consentFilter, setConsentFilter] = useState<string>("ALL");
  const [savedView, setSavedView] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"leadScore" | "attributedRevenue" | "lastInteractionAt">("lastInteractionAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    return contacts.filter((item) => {
      // Saved views shortcut
      if (savedView === "HOT_LEADS" && item.leadScore < 80) return false;
      if (savedView === "ENTERPRISE" && item.attributedRevenue < 20000) return false;
      if (savedView === "OPTED_OUT" && item.consentStatus !== "OPTED_OUT") return false;

      if (stageFilter !== "ALL" && item.lifecycleStage !== stageFilter) return false;
      if (consentFilter !== "ALL" && item.consentStatus !== consentFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchEmail = item.email.toLowerCase().includes(q);
        const matchPhone = item.phone.toLowerCase().includes(q);
        const matchCompany = item.company.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchCompany) return false;
      }

      return true;
    });
  }, [contacts, savedView, stageFilter, consentFilter, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: number | string = a[sortField] || 0;
      let valB: number | string = b[sortField] || 0;
      if (sortField === "lastInteractionAt") {
        valA = new Date(a.lastInteractionAt).getTime();
        valB = new Date(b.lastInteractionAt).getTime();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const toggleSort = (field: "leadScore" | "attributedRevenue" | "lastInteractionAt") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case "WHATSAPP":
        return <MessageSquare key={ch} className="h-3 w-3 text-emerald-400" />;
      case "INSTAGRAM":
        return <Instagram key={ch} className="h-3 w-3 text-rose-400" />;
      case "LINKEDIN":
        return <Linkedin key={ch} className="h-3 w-3 text-blue-400" />;
      case "EMAIL":
        return <Mail key={ch} className="h-3 w-3 text-cyan-400" />;
      default:
        return <Globe key={ch} className="h-3 w-3 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Saved Views Dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 text-[var(--brand-primary)]" />
            <select
              aria-label="Saved Views"
              value={savedView}
              onChange={(e) => {
                setSavedView(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Contacts View ({contacts.length})</option>
              <option value="HOT_LEADS">Hot Leads (Score ≥ 80)</option>
              <option value="ENTERPRISE">Enterprise Customers ($20k+)</option>
              <option value="OPTED_OUT">Opted-Out Suppression Pool</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search name, email, company..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 h-8 text-xs bg-slate-950/70 border-white/10 rounded-xl text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            aria-label="Filter by Stage"
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 bg-slate-950/80 border border-white/10 rounded-xl px-2.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Stages</option>
            <option value="LEAD">Lead</option>
            <option value="MQL">MQL</option>
            <option value="SQL">SQL</option>
            <option value="CUSTOMER">Customer</option>
            <option value="CHURNED">Churned</option>
          </select>

          <select
            aria-label="Filter by Consent"
            value={consentFilter}
            onChange={(e) => {
              setConsentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 bg-slate-950/80 border border-white/10 rounded-xl px-2.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Consent</option>
            <option value="OPTED_IN">Opted In</option>
            <option value="OPTED_OUT">Opted Out</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const csv = filtered
                .map((c) => `"${c.id}","${c.name}","${c.email}","${c.company}","${c.lifecycleStage}","${c.leadScore}","${c.attributedRevenue}"`)
                .join("\n");
              const blob = new Blob([`"ID","Name","Email","Company","Stage","LeadScore","AttributedRevenue"\n${csv}`], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `omnibrand-crm-contacts-${Date.now()}.csv`;
              a.click();
            }}
            className="border-white/10 hover:bg-white/5 text-xs text-slate-300 h-8 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Unified Profile Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Contact & Company</th>
                <th className="py-3 px-4">Primary Identifier</th>
                <th className="py-3 px-4">Channels</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Lifecycle Stage</th>
                <th className="py-3 px-4">Consent</th>
                <th className="py-3 px-4 text-center cursor-pointer hover:text-white" onClick={() => toggleSort("leadScore")}>
                  Lead Score {sortField === "leadScore" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="py-3 px-4 text-right cursor-pointer hover:text-white" onClick={() => toggleSort("attributedRevenue")}>
                  Attributed Rev {sortField === "attributedRevenue" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="py-3 px-4 text-right cursor-pointer hover:text-white" onClick={() => toggleSort("lastInteractionAt")}>
                  Last Interaction {sortField === "lastInteractionAt" && (sortAsc ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No contacts found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectContact(item)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    {/* Name & Company */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                          {item.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.avatarUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[var(--brand-primary)] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.company}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Primary Identifier */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                      {item.primaryIdentifier}
                    </td>

                    {/* Channel chips */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {item.channels.map((ch) => (
                          <div
                            key={ch}
                            className="p-1 rounded bg-slate-950 border border-white/5"
                            title={ch}
                          >
                            {getChannelIcon(ch)}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4 text-slate-300 text-[11px]">
                      {item.source}
                    </td>

                    {/* Lifecycle stage */}
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono border-white/10 bg-slate-950/60 text-slate-300"
                      >
                        {item.lifecycleStage}
                      </Badge>
                    </td>

                    {/* Consent status */}
                    <td className="py-3 px-4">
                      <Badge
                        className={`text-[10px] ${
                          item.consentStatus === "OPTED_IN"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20 font-bold"
                        }`}
                      >
                        {item.consentStatus}
                      </Badge>
                    </td>

                    {/* Lead score */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                          item.leadScore >= 80
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : item.leadScore >= 60
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {item.leadScore}
                      </span>
                    </td>

                    {/* Attributed Revenue */}
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      ${item.attributedRevenue.toLocaleString()}
                    </td>

                    {/* Last interaction */}
                    <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(item.lastInteractionAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} contacts
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="border-white/10 text-xs h-8"
            >
              Previous
            </Button>
            <span className="text-white font-mono px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="border-white/10 text-xs h-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
