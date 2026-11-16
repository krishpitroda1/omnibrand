"use client";

import React, { useState } from "react";
import { AgentEscalationItem, EscalationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Brain,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface EscalationInboxProps {
  escalations: AgentEscalationItem[];
  onApprove: (id: string) => void;
  onEditAndApprove: (id: string, editedAction: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function EscalationInbox({
  escalations,
  onApprove,
  onEditAndApprove,
  onReject,
}: EscalationInboxProps) {
  const [filterStatus, setFilterStatus] = useState<string>("PENDING");
  const [editingItem, setEditingItem] = useState<AgentEscalationItem | null>(null);
  const [editedActionText, setEditedActionText] = useState("");
  const [rejectingItem, setRejectingItem] = useState<AgentEscalationItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = escalations.filter((item) => {
    if (filterStatus !== "ALL" && item.status !== filterStatus) return false;
    return true;
  });

  const pendingCount = escalations.filter((e) => e.status === "PENDING").length;

  const handleStartEdit = (item: AgentEscalationItem) => {
    setEditingItem(item);
    setEditedActionText(item.proposedAction);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    onEditAndApprove(editingItem.id, editedActionText);
    setEditingItem(null);
  };

  const handleStartReject = (item: AgentEscalationItem) => {
    setRejectingItem(item);
    setRejectReason("Action rejected by compliance manager. Discarded.");
  };

  const handleConfirmReject = () => {
    if (!rejectingItem) return;
    onReject(rejectingItem.id, rejectReason);
    setRejectingItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Inbox Control Header */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
            <Inbox className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Escalation Inbox & Human-in-the-Loop Gateway
              </h3>
              {pendingCount > 0 && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                  {pendingCount} Pending Review
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Actions flagged by guardrails, negative sentiment triggers, or agents set to HUMAN_ONLY mode.
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setFilterStatus("PENDING")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "PENDING"
                ? "bg-amber-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "ALL"
                ? "bg-[var(--brand-primary)] text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All History
          </button>
        </div>
      </div>

      {/* Escalation Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-400">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">Escalation Inbox Clear</div>
            <p className="text-xs text-slate-400 mt-1">
              No actions currently awaiting human verification.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isPending = item.status === "PENDING";
            const isUrgent = item.slaMinutesRemaining <= 30;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 backdrop-blur-xl shadow-xl transition-all space-y-4 ${
                  isPending
                    ? isUrgent
                      ? "border-amber-500/40 bg-amber-950/15"
                      : "border-white/10 bg-slate-900/60"
                    : "border-white/5 bg-slate-950/40 opacity-75"
                }`}
              >
                {/* Header row: Agent badge, Title, SLA countdown timer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant="outline"
                      className="border-white/15 bg-slate-950 text-slate-300 font-mono text-[10px]"
                    >
                      {item.agentName}
                    </Badge>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* SLA Timer */}
                    {isPending ? (
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
                          isUrgent
                            ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>SLA: {item.slaMinutesRemaining}m remaining</span>
                      </div>
                    ) : (
                      <Badge
                        className={`text-[10px] ${
                          item.status === "APPROVED" || item.status === "EDITED_APPROVED"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/30"
                            : "bg-red-950 text-red-300 border-red-500/30"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Context & Trigger Reason */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                      Incident Context
                    </span>
                    <p className="text-slate-200 leading-relaxed">{item.context}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-amber-400 block font-semibold flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" />
                      <span>Trigger Reason</span>
                    </span>
                    <p className="text-amber-200/90 leading-relaxed">{item.reason}</p>
                  </div>
                </div>

                {/* Proposed Action Box */}
                <div className="p-3.5 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-[var(--brand-primary)] font-bold block">
                    AI Proposed Action Plan
                  </span>
                  <div className="text-xs text-white leading-relaxed font-medium">
                    {item.editedAction || item.proposedAction}
                  </div>
                  {item.editedAction && (
                    <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-300 bg-emerald-950/60">
                      Human Edited
                    </Badge>
                  )}
                </div>

                {item.rejectionReason && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/20 text-red-300 text-xs">
                    <strong>Rejection Reason:</strong> {item.rejectionReason}
                  </div>
                )}

                {/* Bottom Decision Actions */}
                {isPending && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartReject(item)}
                      className="border-red-500/30 text-red-300 hover:bg-red-950/40 text-xs h-8"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      <span>Reject</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartEdit(item)}
                      className="border-white/10 hover:bg-white/5 text-xs text-slate-200 h-8"
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                      <span>Edit & Approve</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => onApprove(item.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-8 px-4 shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      <span>Approve Flight</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit & Approve Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Edit & Authorize Action</h3>
            <p className="text-xs text-slate-400">
              Adjust the proposed text or payload before authorizing dispatch.
            </p>
            <textarea
              rows={4}
              value={editedActionText}
              onChange={(e) => setEditedActionText(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 resize-none font-mono"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Approve with Edits
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Reject Proposed Action</h3>
            <p className="text-xs text-slate-400">
              Please specify the audit reason for discarding this action.
            </p>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="bg-slate-950 border-white/10 text-xs text-white"
              placeholder="e.g. Inappropriate response tone, incorrect product reference"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectingItem(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmReject}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
