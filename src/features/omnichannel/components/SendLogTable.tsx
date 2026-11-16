"use client";

import React, { useState, useMemo } from "react";
import {
  MOCK_MESSAGE_SENDS,
  MessageSendItem,
} from "@/lib/mock-data/omnichannel";
import { OmniChannel, SendStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  MousePointerClick,
  Send,
  AlertOctagon,
  ArrowUpDown,
  FileCode2,
  Download,
  Copy,
  Check,
} from "lucide-react";

const STATUS_CONFIG: Record<
  SendStatus,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  DELIVERED: {
    label: "Delivered",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
  },
  READ: {
    label: "Read",
    badgeClass: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    icon: <Eye className="h-3.5 w-3.5 text-teal-400" />,
  },
  CLICKED: {
    label: "Clicked",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    icon: <MousePointerClick className="h-3.5 w-3.5 text-cyan-400" />,
  },
  QUEUED: {
    label: "Queued",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: <Clock className="h-3.5 w-3.5 text-amber-400" />,
  },
  SENT: {
    label: "Sent",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: <Send className="h-3.5 w-3.5 text-blue-400" />,
  },
  FAILED: {
    label: "Failed",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: <XCircle className="h-3.5 w-3.5 text-red-400" />,
  },
  OPTED_OUT: {
    label: "Blocked (Opted Out)",
    badgeClass: "bg-rose-950 text-rose-300 border-rose-500/30",
    icon: <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />,
  },
};

export function SendLogTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pageSize = 12;

  const filteredSends = useMemo(() => {
    return MOCK_MESSAGE_SENDS.filter((item) => {
      if (channelFilter !== "ALL" && item.channel !== channelFilter) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.contactName.toLowerCase().includes(query);
        const matchRecipient = item.recipient.toLowerCase().includes(query);
        const matchTemplate = item.templateName?.toLowerCase().includes(query) || false;
        const matchId = item.id.toLowerCase().includes(query);
        if (!matchName && !matchRecipient && !matchTemplate && !matchId) return false;
      }
      return true;
    });
  }, [channelFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredSends.length / pageSize) || 1;
  const paginatedSends = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSends.slice(start, start + pageSize);
  }, [filteredSends, currentPage, pageSize]);

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleCopyPayload = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by contact, phone, template..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-slate-950/60 border-white/10 text-sm placeholder:text-slate-500 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Channel Filter */}
          <select
            aria-label="Filter by Channel"
            value={channelFilter}
            onChange={(e) => {
              setChannelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
          >
            <option value="ALL">All Channels</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="RCS">RCS</option>
            <option value="SMS">A2P SMS</option>
            <option value="VOICE">Voice</option>
            <option value="EMAIL">Email</option>
            <option value="WEB_PUSH">Web Push</option>
          </select>

          {/* Status Filter */}
          <select
            aria-label="Filter by Delivery Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
          >
            <option value="ALL">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="READ">Read</option>
            <option value="CLICKED">Clicked</option>
            <option value="QUEUED">Queued</option>
            <option value="SENT">Sent</option>
            <option value="FAILED">Failed</option>
            <option value="OPTED_OUT">Blocked (Opted Out)</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const csv = filteredSends
                .map(
                  (s) =>
                    `"${s.id}","${s.contactName}","${s.recipient}","${s.channel}","${s.status}","${s.cost}","${s.sentAt}"`
                )
                .join("\n");
              const blob = new Blob([`"ID","Contact","Recipient","Channel","Status","Cost","SentAt"\n${csv}`], {
                type: "text/csv",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `omnibrand-send-logs-${Date.now()}.csv`;
              a.click();
            }}
            className="border-white/10 hover:bg-white/5 text-xs text-slate-300 flex items-center gap-1.5 rounded-xl ml-auto md:ml-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Sends Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 w-10"></th>
                <th className="py-3.5 px-4">Contact & Target</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Template / Subject</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Cost</th>
                <th className="py-3.5 px-4 text-right">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {paginatedSends.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No message dispatches found matching filters.
                  </td>
                </tr>
              ) : (
                paginatedSends.map((item) => {
                  const isExpanded = expandedRowId === item.id;
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.SENT;

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => toggleRow(item.id)}
                        className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                          isExpanded ? "bg-white/[0.04]" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-slate-500">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-[var(--brand-primary)]" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-white">{item.contactName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {item.recipient}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className="text-[11px] font-mono border-white/10 bg-slate-950/60 text-slate-300"
                          >
                            {item.channel}
                          </Badge>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-slate-200 truncate max-w-xs font-medium">
                            {item.templateName || "Free-Form Outbound"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            ID: {item.id}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${cfg.badgeClass}`}
                          >
                            {cfg.icon}
                            <span>{cfg.label}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-slate-300">
                          ${item.cost.toFixed(3)}
                        </td>

                        <td className="py-3 px-4 text-right text-slate-400">
                          {new Date(item.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <span className="block text-[10px] text-slate-500">
                            {new Date(item.sentAt).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/70 border-b border-white/10">
                          <td colSpan={7} className="p-5">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                              {/* Policy Gate Check Panel (6 cols) */}
                              <div className="lg:col-span-6 rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                                  <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                                      Dispatch Policy Evaluation Audit
                                    </h4>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] ${
                                      item.policyCheckResult.passed
                                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                                        : "border-red-500/30 text-red-400 bg-red-500/10"
                                    }`}
                                  >
                                    {item.policyCheckResult.passed ? "ALL CHECKS PASSED" : "FAILED GATE"}
                                  </Badge>
                                </div>

                                <div className="space-y-2">
                                  {item.policyCheckResult.checks.map((chk, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-slate-950/40 border border-white/5"
                                    >
                                      {chk.status === "PASS" ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                      )}
                                      <div>
                                        <div className="font-semibold text-slate-200">
                                          {chk.rule}
                                        </div>
                                        <div className="text-slate-400 text-[11px] mt-0.5">
                                          {chk.details}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {item.errorMessage && (
                                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                                    <strong>Gateway Error:</strong> {item.errorMessage}
                                  </div>
                                )}
                              </div>

                              {/* Raw Payload JSON Panel (6 cols) */}
                              <div className="lg:col-span-6 rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                                  <div className="flex items-center gap-2">
                                    <FileCode2 className="h-4 w-4 text-cyan-400" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                                      Raw Carrier Dispatch Payload
                                    </h4>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyPayload(
                                        item.id,
                                        JSON.stringify(item.payload, null, 2)
                                      );
                                    }}
                                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                                  >
                                    {copiedId === item.id ? (
                                      <>
                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3.5 w-3.5" />
                                        <span>Copy JSON</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <pre className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-48 leading-relaxed">
                                  {JSON.stringify(item.payload, null, 2)}
                                </pre>

                                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                                  <div>
                                    <span className="text-slate-500">Delivered At:</span>{" "}
                                    {item.deliveredAt ? new Date(item.deliveredAt).toLocaleTimeString() : "N/A"}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Read At:</span>{" "}
                                    {item.readAt ? new Date(item.readAt).toLocaleTimeString() : "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredSends.length)} of {filteredSends.length} dispatches
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
