"use client";

import React, { useState } from "react";
import { MessageTemplateItem } from "@/lib/mock-data/omnichannel";
import { OmniChannel, TemplateCategory, TemplateStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Smartphone,
  MessageSquare,
  Mail,
  Sliders,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TemplateLibraryProps {
  templates: MessageTemplateItem[];
  onSaveTemplate?: (template: MessageTemplateItem) => void;
}

export function TemplateLibrary({ templates, onSaveTemplate }: TemplateLibraryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplateItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Editor states
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<OmniChannel>("WHATSAPP");
  const [category, setCategory] = useState<TemplateCategory>("MARKETING");
  const [language, setLanguage] = useState("en_US");
  const [body, setBody] = useState("");
  const [variables, setVariables] = useState<string[]>(["Name", "Offer"]);

  // Test variable preview replacements
  const [previewVars, setPreviewVars] = useState<Record<string, string>>({
    "1": "Elena",
    "2": "Architectural Radiance",
    "3": "Tomorrow at 10 AM",
  });

  const handleOpenEditor = (tpl?: MessageTemplateItem) => {
    if (tpl) {
      setSelectedTemplate(tpl);
      setName(tpl.name);
      setChannel(tpl.channel);
      setCategory(tpl.category);
      setLanguage(tpl.language);
      setBody(tpl.body);
      setVariables(tpl.variables);
    } else {
      setSelectedTemplate(null);
      setName("");
      setChannel("WHATSAPP");
      setCategory("MARKETING");
      setLanguage("en_US");
      setBody("Hello {{1}}, we are pleased to present the {{2}} collection for your review.");
      setVariables(["Client Name", "Collection Title"]);
    }
    setIsEditorOpen(true);
  };

  const getSubstitutedPreview = (templateBody: string) => {
    let result = templateBody;
    Object.entries(previewVars).forEach(([k, v]) => {
      result = result.replaceAll(`{{${k}}}`, v);
    });
    return result;
  };

  const handleSave = () => {
    if (!name.trim() || !body.trim()) return;

    const saved: MessageTemplateItem = {
      id: selectedTemplate?.id || `tpl-${Date.now()}`,
      workspaceId: "ws-growth-lab",
      brandId: "brand-lumina",
      name: name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"),
      channel,
      category,
      language,
      body: body.trim(),
      variables,
      status: "APPROVED",
      lastUpdated: new Date().toISOString(),
    };

    if (onSaveTemplate) onSaveTemplate(saved);
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--brand-primary)]" />
            <span>Certified Template Library & Meta HSM Vault</span>
          </h3>
          <p className="text-xs text-slate-400">
            Approved HSM templates required for outbound dispatches outside the 24-hour service window.
          </p>
        </div>

        <Button variant="brand" size="sm" onClick={() => handleOpenEditor()}>
          <Plus className="h-4 w-4" />
          <span>Create New Template</span>
        </Button>
      </div>

      {/* Templates Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] text-slate-400">
            <tr>
              <th className="p-3.5">Template Name</th>
              <th className="p-3.5">Channel</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Language</th>
              <th className="p-3.5">Placeholders</th>
              <th className="p-3.5">Certification Status</th>
              <th className="p-3.5">Last Updated</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {templates.map((tpl) => (
              <tr key={tpl.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3.5 font-bold font-mono text-white">{tpl.name}</td>
                <td className="p-3.5">
                  <Badge variant="outline" size="sm" className="font-mono text-[9px]">
                    {tpl.channel}
                  </Badge>
                </td>
                <td className="p-3.5 text-slate-400">{tpl.category}</td>
                <td className="p-3.5 font-mono text-slate-400">{tpl.language}</td>
                <td className="p-3.5 font-mono text-slate-400">
                  {tpl.variables?.map((v, i) => `{{${i + 1}}}: ${v}`).join(", ") || "None"}
                </td>
                <td className="p-3.5">
                  <Badge
                    variant={
                      tpl.status === "APPROVED"
                        ? "success"
                        : tpl.status === "PENDING"
                        ? "warning"
                        : "danger"
                    }
                    size="sm"
                  >
                    {tpl.status}
                  </Badge>
                </td>
                <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                  {formatDate(tpl.lastUpdated)}
                </td>
                <td className="p-3.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditor(tpl)}
                    className="text-xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Inspect</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Template Editor Drawer with Live Device Previews */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsEditorOpen(false)} />

          <div className="relative w-full max-w-4xl h-full bg-slate-900 border-l border-white/10 p-6 overflow-y-auto z-10 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-[var(--brand-primary)]" />
                    <span>{selectedTemplate ? `Edit ${selectedTemplate.name}` : "Create Message Template"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Include variable tokens like <code>{"{{1}}"}</code>, <code>{"{{2}}"}</code>. Live device simulation on the right.
                  </p>
                </div>
                <button onClick={() => setIsEditorOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 2-Column Editor + Live Device Preview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Form fields (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  <Input
                    label="Template Identifier (lowercase snake_case)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. catalog_reengagement_v2"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                        Channel Target
                      </label>
                      <select
                        value={channel}
                        onChange={(e) => setChannel(e.target.value as OmniChannel)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-white"
                      >
                        <option value="WHATSAPP">WhatsApp Business API</option>
                        <option value="RCS">RCS Business Messaging</option>
                        <option value="SMS">A2P 10DLC SMS</option>
                        <option value="EMAIL">Email Marketing / Transactional</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-white"
                      >
                        <option value="MARKETING">Marketing & Promotional</option>
                        <option value="UTILITY">Utility / Transactional</option>
                        <option value="AUTHENTICATION">Authentication / OTP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                      Template Message Body (with {"{{1}}"}, {"{{2}}"})
                    </label>
                    <textarea
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                    />
                  </div>

                  {/* Variable testing inputs */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                      Live Sample Variable Values
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        label="{{1}}"
                        value={previewVars["1"]}
                        onChange={(e) => setPreviewVars({ ...previewVars, "1": e.target.value })}
                      />
                      <Input
                        label="{{2}}"
                        value={previewVars["2"]}
                        onChange={(e) => setPreviewVars({ ...previewVars, "2": e.target.value })}
                      />
                      <Input
                        label="{{3}}"
                        value={previewVars["3"]}
                        onChange={(e) => setPreviewVars({ ...previewVars, "3": e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Live Device Preview (5 cols) */}
                <div className="md:col-span-5 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Live Device Rendering
                  </span>

                  {/* WhatsApp Bubble Preview */}
                  {channel === "WHATSAPP" && (
                    <div className="rounded-2xl bg-[#0B141A] border border-white/10 p-4 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <MessageSquare className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">WhatsApp Client Simulator</span>
                      </div>
                      <div className="bg-[#005C4B] rounded-2xl p-3 text-xs text-white leading-relaxed max-w-[90%] space-y-2">
                        <p>{getSubstitutedPreview(body)}</p>
                        <span className="text-[9px] text-emerald-200 block text-right">
                          10:42 AM &bull; ✓✓
                        </span>
                      </div>
                      <button className="w-full py-1.5 rounded-xl bg-[#202C33] text-sky-400 text-xs font-semibold text-center border border-white/5">
                        Explore Collection &rarr;
                      </button>
                    </div>
                  )}

                  {/* RCS Card Preview */}
                  {channel === "RCS" && (
                    <div className="rounded-2xl bg-slate-950 border border-white/10 p-4 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <Smartphone className="h-4 w-4 text-sky-400" />
                        <span className="text-xs font-bold text-white">RCS Rich Card Simulator</span>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900 space-y-2">
                        <div className="aspect-video bg-gradient-to-br from-amber-600/30 to-slate-950 flex items-center justify-center text-xs text-slate-400">
                          RCS Rich Media Header
                        </div>
                        <div className="p-3 text-xs text-slate-200">
                          {getSubstitutedPreview(body)}
                        </div>
                        <div className="p-2 border-t border-white/5 flex gap-2">
                          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-semibold">
                            View Offer
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SMS Plain Preview */}
                  {channel === "SMS" && (
                    <div className="rounded-2xl bg-slate-950 border border-white/10 p-4 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <Smartphone className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold text-white">SMS 10DLC Simulator</span>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-3 text-xs font-mono text-slate-200 leading-relaxed border border-white/5">
                        {getSubstitutedPreview(body)}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Character count: {getSubstitutedPreview(body).length} / 160 (1 segment)
                      </span>
                    </div>
                  )}

                  {/* Email Frame Preview */}
                  {channel === "EMAIL" && (
                    <div className="rounded-2xl bg-slate-950 border border-white/10 p-4 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <Mail className="h-4 w-4 text-purple-400" />
                        <span className="text-xs font-bold text-white">HTML Email Frame</span>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white text-slate-900 p-4 text-xs font-sans space-y-2">
                        <p className="font-bold text-sm">Exclusive VIP Invitation</p>
                        <p className="text-slate-700 whitespace-pre-line">{getSubstitutedPreview(body)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 bg-slate-900 pb-1">
              <Button variant="ghost" size="sm" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button variant="brand" size="sm" onClick={handleSave} className="shadow-glow-brand font-bold">
                Submit Template to Meta Gateway
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
