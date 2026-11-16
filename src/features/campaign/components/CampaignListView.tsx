"use client";

import React, { useState } from "react";
import { CampaignItem } from "@/lib/mock-data/campaigns";
import { CampaignObjective, ContentStatus, Platform } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CampaignListViewProps {
  campaigns: CampaignItem[];
  onSelectCampaign: (campaign: CampaignItem) => void;
  onCreateClick: () => void;
}

export function CampaignListView({
  campaigns,
  onSelectCampaign,
  onCreateClick,
}: CampaignListViewProps) {
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [objectiveFilter, setObjectiveFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState<"name" | "budget" | "leadsCount" | "startDate">("startDate");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const brandsList = Array.from(new Set(campaigns.map((c) => c.brandName)));
  const objectivesList: CampaignObjective[] = [
    "AWARENESS",
    "LEADS",
    "SALES",
    "ENGAGEMENT",
    "RETENTION",
    "APP_DOWNLOAD",
    "FEEDBACK",
  ];
  const statusesList: ContentStatus[] = [
    "DRAFT",
    "SCHEDULED",
    "PUBLISHING",
    "PUBLISHED",
    "PARTIAL",
    "FAILED",
  ];

  // Filtering
  const filtered = campaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (brandFilter !== "ALL" && c.brandName !== brandFilter) return false;
    if (objectiveFilter !== "ALL" && c.objective !== objectiveFilter) return false;
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortField === "name") comp = a.name.localeCompare(b.name);
    else if (sortField === "budget") comp = a.budget - b.budget;
    else if (sortField === "leadsCount") comp = a.leadsCount - b.leadsCount;
    else if (sortField === "startDate") comp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return sortAsc ? comp : -comp;
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search campaigns by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <Button variant="brand" size="sm" onClick={onCreateClick} className="flex-shrink-0">
            <Plus className="h-4 w-4" />
            <span>New Campaign</span>
          </Button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <select
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-slate-300"
          >
            <option value="ALL">All Brands</option>
            {brandsList.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={objectiveFilter}
            onChange={(e) => {
              setObjectiveFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-slate-300"
          >
            <option value="ALL">All Objectives</option>
            {objectivesList.map((obj) => (
              <option key={obj} value={obj}>{obj}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            {statusesList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="flex items-center justify-between px-2 text-slate-400 font-mono text-[11px]">
            <span>{filtered.length} Campaigns</span>
            {(search || brandFilter !== "ALL" || objectiveFilter !== "ALL" || statusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setBrandFilter("ALL");
                  setObjectiveFilter("ALL");
                  setStatusFilter("ALL");
                }}
                className="text-amber-400 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] text-slate-400">
            <tr>
              <th className="p-3.5 cursor-pointer" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-1">
                  <span>Name</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3.5">Brand</th>
              <th className="p-3.5">Objective</th>
              <th className="p-3.5">Channels</th>
              <th className="p-3.5 cursor-pointer" onClick={() => toggleSort("budget")}>
                <div className="flex items-center gap-1">
                  <span>Budget</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3.5">Spend</th>
              <th className="p-3.5 cursor-pointer" onClick={() => toggleSort("leadsCount")}>
                <div className="flex items-center gap-1">
                  <span>Leads</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 cursor-pointer" onClick={() => toggleSort("startDate")}>
                <div className="flex items-center gap-1">
                  <span>Timeline</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3.5">Owner</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
                      <Plus className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Campaign Flights Configured</p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Create your first marketing flight to schedule native social dispatch and track multi-channel ROI.
                    </p>
                    <Button variant="brand" size="sm" onClick={onCreateClick} className="mt-2">
                      <Plus className="h-4 w-4" />
                      <span>Create New Flight</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((camp) => (
              <tr
                key={camp.id}
                onClick={() => onSelectCampaign(camp)}
                className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <td className="p-3.5 font-bold text-white group-hover:text-[var(--brand-primary)]">
                  {camp.name}
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: camp.brandColor }}
                    />
                    <span className="truncate max-w-[110px]">{camp.brandName}</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <Badge variant="brand" size="sm" className="text-[9px]">
                    {camp.objective}
                  </Badge>
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-1 flex-wrap">
                    {camp.channels?.map((ch) => (
                      <span
                        key={ch.platform}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 font-mono text-slate-300"
                      >
                        {ch.platform.substring(0, 2)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3.5 font-mono font-semibold text-white">
                  ${camp.budget.toLocaleString()}
                </td>
                <td className="p-3.5 font-mono text-slate-400">
                  ${camp.spendToDate.toLocaleString()}
                </td>
                <td className="p-3.5 font-mono font-bold text-emerald-400">
                  {camp.leadsCount}
                </td>
                <td className="p-3.5">
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
                </td>
                <td className="p-3.5 text-[11px] font-mono text-slate-400 whitespace-nowrap">
                  {formatDate(camp.startDate)}
                </td>
                <td className="p-3.5 text-slate-400 truncate max-w-[90px]">
                  {camp.ownerName}
                </td>
                <td className="p-3.5 text-right">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Inspect</span>
                  </Button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, sorted.length)} of {sorted.length} campaigns
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-white">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="glass"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
