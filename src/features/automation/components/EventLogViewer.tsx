"use client";

import React, { useState, useMemo } from "react";
import { EventLogItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertOctagon,
  FileCode2,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

interface EventLogViewerProps {
  events: EventLogItem[];
  onReplayEvent: (eventId: string) => void;
}

export function EventLogViewer({
  events,
  onReplayEvent,
}: EventLogViewerProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "DLQ">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const dlqCount = events.filter((e) => e.status === "DLQ" || e.status === "FAILED").length;

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (activeTab === "DLQ" && e.status !== "DLQ" && e.status !== "FAILED") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.id.toLowerCase().includes(q) ||
          e.eventName.toLowerCase().includes(q) ||
          e.source.toLowerCase().includes(q) ||
          (e.errorMessage?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [events, activeTab, searchQuery]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleCopyPayload = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Event Log Header & Tabs */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Main stream vs DLQ tab */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("ALL");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "ALL"
                  ? "bg-[var(--brand-primary)] text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Ingress Streams ({events.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("DLQ");
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "DLQ"
                  ? "bg-red-600 text-white font-bold shadow"
                  : "text-red-400 hover:text-red-300"
              }`}
            >
              <AlertOctagon className="h-3.5 w-3.5" />
              <span>Dead Letter Queue ({dlqCount})</span>
            </button>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search event type, source, error..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 h-8 text-xs bg-slate-950 border-white/10 rounded-xl"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Event Identifier</th>
                <th className="py-3 px-4">Ingress Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Retries</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No events found.
                  </td>
                </tr>
              ) : (
                paginated.map((evt) => {
                  const isExpanded = expandedEventId === evt.id;

                  return (
                    <React.Fragment key={evt.id}>
                      <tr
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
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
                          <div className="font-semibold text-white font-mono">
                            {evt.eventName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            ID: {evt.id}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-300">
                          {evt.source}
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            className={`text-[10px] ${
                              evt.status === "PROCESSED"
                                ? "bg-emerald-950/70 border-emerald-500/30 text-emerald-300"
                                : evt.status === "RETRIED"
                                ? "bg-blue-950/70 border-blue-500/30 text-blue-300 font-bold"
                                : evt.status === "DLQ"
                                ? "bg-red-600 text-white font-bold"
                                : "bg-red-950/70 border-red-500/30 text-red-300"
                            }`}
                          >
                            {evt.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-center font-mono text-slate-400">
                          {evt.retryCount}/{evt.maxRetries}
                        </td>

                        <td className="py-3 px-4 text-right text-slate-400">
                          {new Date(evt.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReplayEvent(evt.id);
                            }}
                            className="border-white/10 hover:bg-white/5 text-[11px] h-7 text-slate-300"
                          >
                            <RotateCw className="h-3 w-3 mr-1 text-[var(--brand-primary)]" />
                            <span>Replay</span>
                          </Button>
                        </td>
                      </tr>

                      {/* Expanded Payload and Error Info */}
                      {isExpanded && (
                        <tr className="bg-slate-950/80 border-b border-white/10">
                          <td colSpan={7} className="p-4 space-y-3">
                            {evt.errorMessage && (
                              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-300">
                                <strong>Error Log:</strong> {evt.errorMessage}
                              </div>
                            )}

                            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 space-y-2">
                              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                                <span className="text-[10px] uppercase font-mono text-cyan-300 font-bold">
                                  Raw Event Payload
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyPayload(evt.id, JSON.stringify(evt.payload, null, 2))}
                                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                                >
                                  {copiedId === evt.id ? (
                                    <>
                                      <Check className="h-3 w-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>Copy JSON</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-40 leading-relaxed">
                                {JSON.stringify(evt.payload, null, 2)}
                              </pre>
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
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} events
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
