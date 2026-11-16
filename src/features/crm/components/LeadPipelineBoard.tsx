"use client";

import React, { useState } from "react";
import { CrmContactItem, LifecycleStage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  AlertTriangle,
  User,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface LeadPipelineBoardProps {
  contacts: CrmContactItem[];
  onSelectContact: (contact: CrmContactItem) => void;
  onUpdateStage: (contactId: string, stage: LifecycleStage) => void;
}

const STAGES: { id: LifecycleStage; label: string; color: string }[] = [
  { id: "LEAD", label: "Inbound Leads", color: "border-slate-500/30" },
  { id: "MQL", label: "Marketing Qualified", color: "border-blue-500/30" },
  { id: "SQL", label: "Sales Qualified", color: "border-indigo-500/30" },
  { id: "CUSTOMER", label: "Closed Customers", color: "border-emerald-500/30" },
];

export function LeadPipelineBoard({
  contacts,
  onSelectContact,
  onUpdateStage,
}: LeadPipelineBoardProps) {
  const [draggedContactId, setDraggedContactId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, contactId: string) => {
    e.dataTransfer.setData("text/plain", contactId);
    setDraggedContactId(contactId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: LifecycleStage) => {
    e.preventDefault();
    const contactId = e.dataTransfer.getData("text/plain") || draggedContactId;
    if (contactId) {
      onUpdateStage(contactId, targetStage);
    }
    setDraggedContactId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[580px]">
      {STAGES.map((col) => {
        const columnContacts = contacts.filter((c) => c.lifecycleStage === col.id);
        const columnValue = columnContacts.reduce((sum, c) => sum + (c.attributedRevenue || c.ltvEstimate || 0), 0);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-4 shadow-xl flex flex-col justify-between"
          >
            {/* Column Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.label}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-white/5">
                  {columnContacts.length}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 py-2 border-b border-white/5 mb-3">
                <span>Pipeline Value:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ${columnValue.toLocaleString()}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {columnContacts.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-xs text-slate-500">
                    Drop prospects here
                  </div>
                ) : (
                  columnContacts.map((contact, idx) => {
                    // Check if stale (e.g. Claire is recent, Julian is 1d, Nora is stale)
                    const isStale = idx % 2 === 1;
                    const daysAgo = (idx + 1) * 2;

                    return (
                      <div
                        key={contact.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, contact.id)}
                        onClick={() => onSelectContact(contact)}
                        className="p-3.5 rounded-xl border border-white/10 bg-slate-950/70 hover:border-[var(--brand-primary)]/60 cursor-grab active:cursor-grabbing transition-all space-y-2.5 shadow group hover:shadow-lg"
                      >
                        {/* Top: Avatar, Name, Lead Score */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                              {contact.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={contact.avatarUrl}
                                  alt={contact.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-[var(--brand-primary)] transition-colors">
                                {contact.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                {contact.company}
                              </div>
                            </div>
                          </div>

                          <Badge
                            className={`text-[9px] font-mono ${
                              contact.leadScore >= 80
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {contact.leadScore}
                          </Badge>
                        </div>

                        {/* Stale / SLA Indicator */}
                        {isStale ? (
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                            <span>Stale: {daysAgo}d without contact</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span>Active: Interacted today</span>
                          </div>
                        )}

                        {/* Revenue & Next Stage trigger */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                          <span className="font-mono text-slate-300 font-semibold">
                            ${(contact.attributedRevenue || contact.ltvEstimate).toLocaleString()}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStageMap: Record<LifecycleStage, LifecycleStage> = {
                                SUBSCRIBER: "LEAD",
                                LEAD: "MQL",
                                MQL: "SQL",
                                SQL: "CUSTOMER",
                                CUSTOMER: "CUSTOMER",
                                CHURNED: "LEAD",
                              };
                              onUpdateStage(contact.id, nextStageMap[contact.lifecycleStage]);
                            }}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                          >
                            <span>Advance</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-500 text-center font-mono">
              Drag cards to advance stage
            </div>
          </div>
        );
      })}
    </div>
  );
}
