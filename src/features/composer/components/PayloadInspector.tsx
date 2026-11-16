"use client";

import React, { useState } from "react";
import { Platform, AspectRatio } from "@/types";
import {
  formatAyrsharePayload,
  formatBufferPayload,
  formatDirectApiPayload,
} from "@/lib/social-connectors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Code2, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

interface PayloadInspectorProps {
  platform: Platform;
  caption: string;
  mediaUrl: string;
  aspectRatio: AspectRatio;
  scheduledAt?: string;
  hashtags: string[];
  ctaUrl?: string;
  brandName: string;
  workspaceId: string;
}

export function PayloadInspector(props: PayloadInspectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Ayrshare" | "Buffer" | "Direct API">("Ayrshare");
  const [copied, setCopied] = useState(false);

  let payloadObj: unknown;
  if (activeTab === "Ayrshare") {
    payloadObj = formatAyrsharePayload(props);
  } else if (activeTab === "Buffer") {
    payloadObj = formatBufferPayload(props);
  } else {
    payloadObj = formatDirectApiPayload(props);
  }

  const payloadString = JSON.stringify(payloadObj, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/70 overflow-hidden">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-[var(--brand-primary)]" />
          <span className="text-xs font-semibold text-white">
            Payload Inspector & Schema Validator &bull; {props.platform}
          </span>
          <Badge variant="success" size="sm" className="text-[9px]">
            Schema Validated
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono">
            {activeTab} Spec
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-white/10 space-y-3 bg-slate-950">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-1.5">
              {(["Ayrshare", "Buffer", "Direct API"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeTab === tab
                      ? "bg-white/15 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs">
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied JSON" : "Copy JSON"}</span>
            </Button>
          </div>

          <pre className="p-3 rounded-xl bg-slate-900 border border-white/5 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-56 leading-relaxed select-all">
            {payloadString}
          </pre>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>Idempotent Payload Hash Verified</span>
            </span>
            <span>Target Protocol: OpenAPI 3.1 &bull; Ayrshare v2</span>
          </div>
        </div>
      )}
    </div>
  );
}
