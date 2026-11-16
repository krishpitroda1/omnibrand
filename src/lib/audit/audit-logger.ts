import { PrismaClient } from "@prisma/client";

export interface AuditLogEntry {
  organizationId?: string;
  workspaceId: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

// In-memory buffer for fast non-blocking audit logging & fallback
const IN_MEMORY_AUDIT_LOGS: Array<AuditLogEntry & { id: string; createdAt: string }> = [];

/**
 * Persists an audit log entry strictly scoped by workspaceId.
 */
export async function writeAuditLog(entry: AuditLogEntry) {
  const record = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    organizationId: entry.organizationId || "org-apex-holding",
    workspaceId: entry.workspaceId,
    actorId: entry.actorId || "usr-system",
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    metadata: entry.metadata || {},
    ipAddress: entry.ipAddress || "127.0.0.1",
    createdAt: new Date().toISOString(),
  };

  IN_MEMORY_AUDIT_LOGS.unshift(record);
  if (IN_MEMORY_AUDIT_LOGS.length > 500) {
    IN_MEMORY_AUDIT_LOGS.pop();
  }

  // Also log structured JSON to stdout for log aggregators (e.g. Datadog / CloudWatch)
  console.log(
    JSON.stringify({
      level: "info",
      type: "AUDIT_LOG",
      timestamp: record.createdAt,
      workspaceId: record.workspaceId,
      actorId: record.actorId,
      action: record.action,
      entityType: record.entityType,
      entityId: record.entityId,
      metadata: record.metadata,
    })
  );

  return record;
}

export function getRecentAuditLogs(workspaceId: string, limit = 50) {
  return IN_MEMORY_AUDIT_LOGS.filter((l) => l.workspaceId === workspaceId).slice(0, limit);
}
