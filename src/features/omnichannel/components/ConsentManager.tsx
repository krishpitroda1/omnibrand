"use client";

import React, { useState } from "react";
import { ContactItem } from "@/lib/mock-data/omnichannel";
import { OmniChannel, ConsentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Upload,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ConsentManagerProps {
  contacts: ContactItem[];
  onUpdateConsent?: (
    contactId: string,
    channel: OmniChannel,
    status: ConsentStatus,
    reason?: string
  ) => void;
}

export function ConsentManager({ contacts, onUpdateConsent }: ConsentManagerProps) {
  const [search, setSearch] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<OmniChannel | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<ConsentStatus | "ALL">("ALL");

  // Manual Override State
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetContact, setTargetContact] = useState<ContactItem | null>(null);
  const [overrideChannel, setOverrideChannel] = useState<OmniChannel>("WHATSAPP");
  const [overrideStatus, setOverrideStatus] = useState<ConsentStatus>("OPTED_IN");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideError, setOverrideError] = useState("");

  const handleOpenOverride = (contact: ContactItem, channel: OmniChannel) => {
    setTargetContact(contact);
    setOverrideChannel(channel);
    setOverrideStatus(contact.channelConsents[channel]?.status || "OPTED_IN");
    setOverrideReason("");
    setOverrideError("");
    setOverrideModalOpen(true);
  };

  const handleConfirmOverride = () => {
    if (!overrideReason.trim()) {
      setOverrideError("An audited compliance reason is required to manually override consent.");
      return;
    }
    if (targetContact && onUpdateConsent) {
      onUpdateConsent(targetContact.id, overrideChannel, overrideStatus, overrideReason.trim());
    }
    setOverrideModalOpen(false);
  };

  // Flattened row data per contact + channel
  const consentRows: {
    contactId: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    channel: OmniChannel;
    status: ConsentStatus;
    source: string;
    proofReference: string;
    manuallyOverridden?: boolean;
    overrideReason?: string;
    updatedAt: string;
  }[] = [];

  contacts.forEach((contact) => {
    (Object.keys(contact.channelConsents) as OmniChannel[]).forEach((ch) => {
      const c = contact.channelConsents[ch];
      if (selectedChannel !== "ALL" && ch !== selectedChannel) return;
      if (selectedStatus !== "ALL" && c.status !== selectedStatus) return;
      if (
        search &&
        !contact.name.toLowerCase().includes(search.toLowerCase()) &&
        !contact.phone.includes(search) &&
        !contact.email.toLowerCase().includes(search.toLowerCase())
      ) {
        return;
      }

      consentRows.push({
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        channel: ch,
        status: c.status,
        source: c.source,
        proofReference: c.proofReference,
        manuallyOverridden: c.manuallyOverridden,
        overrideReason: c.overrideReason,
        updatedAt: c.updatedAt,
      });
    });
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Consent Manager & Double Opt-In Audit Vault</span>
          </h3>
          <p className="text-xs text-slate-400">
            Mandatory invariant: ConsentRecord gates all outbound sends. Hard block enforced on OPTED_OUT records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Bulk CSV Consent Import dialog ready. Matches hashed phone/email records.")}
            className="text-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Bulk Import Consents</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search consent by contact name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value as OmniChannel | "ALL")}
            className="rounded-xl border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300"
          >
            <option value="ALL">All Channels</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="RCS">RCS</option>
            <option value="SMS">SMS</option>
            <option value="EMAIL">Email</option>
            <option value="VOICE">Voice</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ConsentStatus | "ALL")}
            className="rounded-xl border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300"
          >
            <option value="ALL">All Consent Statuses</option>
            <option value="OPTED_IN">OPTED_IN (Permitted)</option>
            <option value="OPTED_OUT">OPTED_OUT (Hard Block)</option>
            <option value="UNKNOWN">UNKNOWN (Gated)</option>
          </select>
        </div>
      </div>

      {/* Consent Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] text-slate-400">
            <tr>
              <th className="p-3.5">Contact Name & Info</th>
              <th className="p-3.5">Channel</th>
              <th className="p-3.5">Consent Status</th>
              <th className="p-3.5">Acquisition Source</th>
              <th className="p-3.5">Proof Reference</th>
              <th className="p-3.5">Last Verified</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {consentRows.slice(0, 25).map((row) => {
              const isBlocked = row.status === "OPTED_OUT";
              const isApproved = row.status === "OPTED_IN";

              return (
                <tr key={`${row.contactId}-${row.channel}`} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <p className="font-semibold text-white">{row.contactName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{row.contactPhone || row.contactEmail}</p>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="outline" size="sm" className="font-mono text-[9px]">
                      {row.channel}
                    </Badge>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          isApproved ? "success" : isBlocked ? "danger" : "default"
                        }
                        size="sm"
                      >
                        {isBlocked ? "HARD BLOCK: OPTED_OUT" : row.status}
                      </Badge>
                      {row.manuallyOverridden && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                          Overridden
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{row.source}</td>
                  <td className="p-3.5 text-slate-400 font-mono text-[10px]">{row.proofReference}</td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">{formatDate(row.updatedAt)}</td>
                  <td className="p-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const original = contacts.find((c) => c.id === row.contactId);
                        if (original) handleOpenOverride(original, row.channel);
                      }}
                      className="text-xs"
                    >
                      <Sliders className="h-3 w-3" />
                      <span>Override</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Manual Override Confirmation Modal */}
      <Modal
        isOpen={overrideModalOpen}
        onClose={() => setOverrideModalOpen(false)}
        maxWidth="md"
        title="Audited Consent Status Override"
        description={`Modify outbound permission for ${targetContact?.name} on ${overrideChannel}.`}
      >
        <div className="space-y-4">
          {overrideError && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {overrideError}
            </p>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
              New Consent Designation
            </label>
            <select
              value={overrideStatus}
              onChange={(e) => setOverrideStatus(e.target.value as ConsentStatus)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 p-2.5 text-xs text-white"
            >
              <option value="OPTED_IN">OPTED_IN (Permit Outbound Sends)</option>
              <option value="OPTED_OUT">OPTED_OUT (Hard Block All Sends)</option>
              <option value="UNKNOWN">UNKNOWN (Requires Re-verification)</option>
            </select>
          </div>

          <Input
            label="Compliance & Legal Reason (Audited)"
            placeholder="e.g. Inbound signed NDA consent form or verbal agreement"
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <Button variant="ghost" size="sm" onClick={() => setOverrideModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" size="sm" onClick={handleConfirmOverride}>
              Confirm Audit Override
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
