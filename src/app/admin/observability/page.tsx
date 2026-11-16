"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Layers,
  AlertTriangle,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Server,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { getAllAdapters } from "@/lib/adapters/registry";

export default function ObservabilityAdminPage() {
  const [activeQueueFilter, setActiveQueueFilter] = useState<string>("ALL");
  const [retryingJobId, setRetryingJobId] = useState<string | null>(null);

  const adapters = getAllAdapters();

  // Mock Active Queue Depths
  const queues = [
    { name: "publish", label: "Publish Queue", waiting: 12, active: 4, failed: 1, dlq: 0, color: "bg-blue-500" },
    { name: "media-process", label: "Media Processing", waiting: 5, active: 2, failed: 0, dlq: 0, color: "bg-indigo-500" },
    { name: "webhook-ingest", label: "Webhook Ingestion", waiting: 28, active: 8, failed: 0, dlq: 0, color: "bg-emerald-500" },
    { name: "ai-generate", label: "AI Generation Pipeline", waiting: 3, active: 2, failed: 0, dlq: 0, color: "bg-pink-500" },
  ];

  // Mock Failed / DLQ Jobs
  const [failedJobs, setFailedJobs] = useState([
    {
      id: "job-pub-1731558291-a8f9",
      queue: "publish",
      channel: "TIKTOK",
      attempts: 5,
      errorCode: "ERR_AUTH_EXPIRED",
      errorMessage: "TikTok direct publishing API token expired or restricted",
      timestamp: "12m ago",
      status: "DLQ",
    },
    {
      id: "job-pub-1731558190-b3e1",
      queue: "publish",
      channel: "WHATSAPP",
      attempts: 2,
      errorCode: "ERR_24H_WINDOW_CLOSED",
      errorMessage: "WhatsApp 24h customer service window expired; template required",
      timestamp: "24m ago",
      status: "FAILED",
    },
  ]);

  // Token Expiries List
  const tokenCredentials = [
    { provider: "Ayrshare Social API", keyVersion: 2, expiresDays: 84, status: "HEALTHY", lastRotated: "6d ago" },
    { provider: "SMSCloud Hub (WhatsApp/RCS)", keyVersion: 2, expiresDays: 142, status: "HEALTHY", lastRotated: "12d ago" },
    { provider: "Google Search Console OIDC", keyVersion: 2, expiresDays: 28, status: "WARNING", lastRotated: "45d ago" },
    { provider: "Meta Marketing Graph API", keyVersion: 2, expiresDays: 14, status: "EXPIRING_SOON", lastRotated: "52d ago" },
  ];

  const handleRetryJob = (jobId: string) => {
    setRetryingJobId(jobId);
    setTimeout(() => {
      setRetryingJobId(null);
      setFailedJobs((prev) => prev.filter((j) => j.id !== jobId));
      alert(`Job ${jobId} successfully requeued with exponential backoff reset.`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Activity className="h-6 w-6 text-[var(--brand-primary)]" />
              <span>Commercial Telemetry & Observability Center</span>
            </h1>
            <Badge variant="brand" size="sm">Admin Console</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real-time BullMQ queue depths, dead-letter job inspection, KMS credential rotation status, and adapter health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            <span>Refresh Telemetry</span>
          </Button>
        </div>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Job Success Rate</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">98.6%</div>
          <span className="text-[10px] text-slate-500 font-mono">12,850 jobs processed</span>
        </div>
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Avg Publish Latency</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">342 ms</div>
          <span className="text-[10px] text-slate-500 font-mono">End-to-end webhook receipt</span>
        </div>
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">API Error Rate</span>
          <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">0.12%</div>
          <span className="text-[10px] text-emerald-400 font-mono">Well below 1.0% SLA</span>
        </div>
        <div className="p-4 rounded-xl border border-white/10 glass-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Worker Threads</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">16 Workers</div>
          <span className="text-[10px] text-slate-500 font-mono">Autoscaled BullMQ cluster</span>
        </div>
      </div>

      {/* 1. Queue Depths Section */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-[var(--brand-primary)]" />
          <span>BullMQ Distributed Queue Depths</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {queues.map((q) => (
            <div key={q.name} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{q.label}</span>
                <span className="text-[10px] font-mono text-slate-400">{q.waiting + q.active} in flight</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Waiting:</span>
                  <strong className="text-white">{q.waiting}</strong>
                </div>
                <div className="flex justify-between text-cyan-400">
                  <span>Active:</span>
                  <strong className="font-bold">{q.active}</strong>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Failed / DLQ:</span>
                  <strong>{q.failed + q.dlq}</strong>
                </div>
              </div>

              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className={`${q.color} h-full`} style={{ width: `${Math.min(100, (q.waiting + q.active) * 4)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Failed Jobs & Dead-Letter Queue (DLQ) Inspector */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span>Dead-Letter Queue (DLQ) & Failure Inspector</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Jobs with max retry attempts exhausted; inspect granular error codes or trigger forced retry.
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 font-bold">{failedJobs.length} Failing Jobs</span>
        </div>

        {failedJobs.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <span>All queues are completely clear! Zero failed jobs in DLQ.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {failedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300">
                      {job.status}
                    </span>
                    <span className="font-mono font-bold text-white">{job.id}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({job.timestamp})</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Channel: <strong className="text-white">{job.channel}</strong> | Code:{" "}
                    <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">{job.errorCode}</code>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{job.errorMessage}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="brand"
                    disabled={retryingJobId === job.id}
                    onClick={() => handleRetryJob(job.id)}
                    className="text-xs"
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${retryingJobId === job.id ? "animate-spin" : ""}`} />
                    <span>{retryingJobId === job.id ? "Retrying..." : "Retry Job"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. KMS Credential Expiries & Keyring Rotation */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[var(--brand-primary)]" />
            <span>KMS Keyring Encryption & Credential Expiration Status</span>
          </h3>
          <Badge variant="brand" size="sm">AES-256-GCM Active</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {tokenCredentials.map((tc) => (
            <div key={tc.provider} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate max-w-[170px]">{tc.provider}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    tc.status === "HEALTHY"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : tc.status === "WARNING"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-rose-500/15 text-rose-400"
                  }`}
                >
                  {tc.status}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-300">
                Expires in: <strong className="text-white">{tc.expiresDays} days</strong>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Key Version: v{tc.keyVersion} • Rotated: {tc.lastRotated}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Integration Adapter Health Matrix */}
      <div className="p-5 rounded-2xl border border-white/10 glass-card space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="h-4 w-4 text-emerald-400" />
          <span>Integration Adapter Health & Capabilities Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 text-[11px] font-mono">
                <th className="py-2.5 px-3">ADAPTER NAME</th>
                <th className="py-2.5 px-3">PROVIDER</th>
                <th className="py-2.5 px-3">DECLARED CAPABILITIES</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {adapters.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{a.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{a.provider}</td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {a.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-cyan-300 border border-white/5"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                      <CheckCircle2 className="h-3 w-3" /> CONNECTED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
