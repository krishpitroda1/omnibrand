"use client";

import React, { useState, useMemo } from "react";
import { CrmContactItem, SavedSegment, SegmentRule } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Plus,
  Trash2,
  Users,
  Save,
  Rocket,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface SegmentRuleBuilderProps {
  contacts: CrmContactItem[];
  savedSegments: SavedSegment[];
  onSaveSegment: (segment: SavedSegment) => void;
  onUseInCampaign: (segment: SavedSegment) => void;
}

export function SegmentRuleBuilder({
  contacts,
  savedSegments,
  onSaveSegment,
  onUseInCampaign,
}: SegmentRuleBuilderProps) {
  const [segmentName, setSegmentName] = useState("High Propensity Architecture Leads");
  const [rules, setRules] = useState<SegmentRule[]>([
    { id: "r1", field: "leadScore", operator: "greater_than", value: "75", combinator: "AND" },
    { id: "r2", field: "consentStatus", operator: "equals", value: "OPTED_IN", combinator: "AND" },
  ]);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Live audience calculation
  const matchingContacts = useMemo(() => {
    return contacts.filter((c) => {
      return rules.every((rule) => {
        if (rule.field === "leadScore") {
          const target = parseInt(rule.value) || 0;
          if (rule.operator === "greater_than") return c.leadScore > target;
          if (rule.operator === "less_than") return c.leadScore < target;
          return c.leadScore === target;
        }
        if (rule.field === "consentStatus") {
          return c.consentStatus === rule.value;
        }
        if (rule.field === "lifecycleStage") {
          return c.lifecycleStage === rule.value;
        }
        if (rule.field === "channels") {
          return c.channels.some((ch) => ch.toLowerCase().includes(rule.value.toLowerCase()));
        }
        return true;
      });
    });
  }, [contacts, rules]);

  const handleAddRule = () => {
    const newRule: SegmentRule = {
      id: `r-${Date.now()}`,
      field: "leadScore",
      operator: "greater_than",
      value: "50",
      combinator: "AND",
    };
    setRules([...rules, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    const newSeg: SavedSegment = {
      id: `seg-${Date.now().toString().slice(-4)}`,
      name: segmentName,
      description: `Targeting ${matchingContacts.length} verified contacts`,
      rules,
      audienceCount: matchingContacts.length,
      createdAt: new Date().toISOString(),
    };
    onSaveSegment(newSeg);
    setSaveSuccess(`Segment '${segmentName}' saved with ${matchingContacts.length} matching contacts.`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Builder Container */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)]/30 text-[var(--brand-primary)]">
                <Filter className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Audience Segment Rule Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Construct boolean filters across lead scores, verified consent, channel tags, and lifecycle stages.
            </p>
          </div>

          {/* Live Audience Count Badge */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-3">
            <Users className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Live Audience Match
              </span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {matchingContacts.length} Contacts ({((matchingContacts.length / (contacts.length || 1)) * 100).toFixed(0)}% of CRM)
              </span>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Segment Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Segment Identifier
          </label>
          <Input
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            className="bg-slate-950/80 border-white/10 text-xs text-white max-w-md rounded-xl"
            placeholder="e.g. VIP Lookbook Re-engagement Pool"
          />
        </div>

        {/* Rules Rows */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Filter Rules (AND Logic)
          </label>

          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-xl border border-white/10 bg-slate-950/60 flex flex-col sm:flex-row items-center gap-3 text-xs"
            >
              <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-slate-400 shrink-0">
                Rule {idx + 1}
              </Badge>

              {/* Field */}
              <select
                aria-label="Select Filter Field"
                value={rule.field}
                onChange={(e) => {
                  const val = e.target.value;
                  setRules(rules.map((r) => (r.id === rule.id ? { ...r, field: val } : r)));
                }}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="leadScore">Lead Score</option>
                <option value="consentStatus">Consent Status</option>
                <option value="lifecycleStage">Lifecycle Stage</option>
                <option value="channels">Channels Included</option>
              </select>

              {/* Operator */}
              <select
                aria-label="Select Operator"
                value={rule.operator}
                onChange={(e) => {
                  const op = e.target.value as SegmentRule["operator"];
                  setRules(rules.map((r) => (r.id === rule.id ? { ...r, operator: op } : r)));
                }}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="greater_than">Greater than (&gt;)</option>
                <option value="less_than">Less than (&lt;)</option>
                <option value="equals">Equals (==)</option>
                <option value="contains">Contains</option>
              </select>

              {/* Value */}
              <Input
                aria-label="Rule Target Value"
                value={rule.value}
                onChange={(e) => {
                  const v = e.target.value;
                  setRules(rules.map((r) => (r.id === rule.id ? { ...r, value: v } : r)));
                }}
                className="bg-slate-900 border-white/10 text-xs text-white rounded-xl h-8 max-w-[200px]"
                placeholder="Value..."
              />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveRule(rule.id)}
                disabled={rules.length <= 1}
                className="text-slate-500 hover:text-red-400 text-xs h-8 ml-auto"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}

          <Button
            size="sm"
            variant="outline"
            onClick={handleAddRule}
            className="border-white/10 text-xs text-slate-300 hover:bg-white/5"
          >
            <Plus className="h-3.5 w-3.5 mr-1 text-[var(--brand-primary)]" />
            <span>Add Condition Row</span>
          </Button>
        </div>

        {/* Builder Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="text-xs text-slate-400">
            Targeting <strong>{matchingContacts.length}</strong> active profiles
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              className="border-white/15 text-xs text-white hover:bg-white/5"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              <span>Save as Segment</span>
            </Button>

            <Button
              size="sm"
              onClick={() => {
                const seg: SavedSegment = {
                  id: `seg-active`,
                  name: segmentName,
                  description: `Targeting ${matchingContacts.length} profiles`,
                  rules,
                  audienceCount: matchingContacts.length,
                  createdAt: new Date().toISOString(),
                };
                onUseInCampaign(seg);
              }}
              className="bg-[var(--brand-primary)] hover:brightness-110 text-white text-xs font-semibold px-4 shadow-md"
            >
              <Rocket className="h-3.5 w-3.5 mr-1" />
              <span>Use in Campaign</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Saved Segments Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Saved Segments Library
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedSegments.map((seg) => (
            <div
              key={seg.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between shadow-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-xs">{seg.name}</span>
                  <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-300 bg-emerald-950/40">
                    {seg.audienceCount} Contacts
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400">{seg.description}</p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onUseInCampaign(seg)}
                className="border-white/10 hover:bg-[var(--brand-primary)] hover:text-white text-xs h-7 text-slate-300"
              >
                Use
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
