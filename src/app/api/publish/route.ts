import { NextRequest, NextResponse } from "next/server";
import { checkOrRegisterIdempotencyKey, updateIdempotencyRecord } from "@/lib/queue/idempotency";
import { publishingQueue, PublishJobPayload } from "@/lib/queue/publishing-queue";
import { requirePermission } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      idempotencyKey,
      campaignId = "cmp-01",
      contentItemId = "cnt-01",
      channels = ["INSTAGRAM", "WHATSAPP"],
      caption = "OmniBrand test publish",
      mediaUrls = [],
    } = body;

    const actorId = req.headers.get("x-user-id") || "usr-admin-01";
    const workspaceId = req.headers.get("x-workspace-id") || body.workspaceId || "ws-prod-01";

    // 1. RBAC permission check
    await requirePermission(actorId, workspaceId, "campaign:publish");

    // 2. Mandatory Idempotency Key check
    if (!idempotencyKey) {
      return NextResponse.json(
        { error: "Header or payload 'idempotencyKey' is strictly required on every publish job." },
        { status: 400 }
      );
    }

    // 3. Check or register idempotency key
    const { isDuplicate, record } = checkOrRegisterIdempotencyKey(
      idempotencyKey,
      workspaceId,
      () => `pub-job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    );

    if (isDuplicate) {
      // DUPLICATE DETECTED: Return existing job immediately, DO NOT CREATE A SECOND JOB
      return NextResponse.json({
        success: true,
        isDuplicate: true,
        jobId: record.jobId,
        status: record.status,
        message: `Idempotency key '${idempotencyKey}' already received. Returning existing job without re-enqueuing.`,
        duplicateAttempts: record.duplicateAttemptsCount,
      });
    }

    // 4. Enqueue in BullMQ-compatible publish queue
    const payload: PublishJobPayload = {
      campaignId,
      contentItemId,
      channels,
      caption,
      mediaUrls,
    };

    const job = publishingQueue.enqueue("publish", workspaceId, payload, idempotencyKey, record.jobId);
    updateIdempotencyRecord(idempotencyKey, workspaceId, { status: "PROCESSING" });

    // 5. Execute publish with granular channel failure simulation
    const result = await publishingQueue.processPublishJob(job.id);
    updateIdempotencyRecord(idempotencyKey, workspaceId, {
      status: result.overallStatus === "PUBLISHED" ? "COMPLETED" : "PROCESSING",
      resultPayload: result,
    });

    // 6. Mandatory Audit Log entry
    await writeAuditLog({
      workspaceId,
      actorId,
      action: "CAMPAIGN_CONTENT_PUBLISHED",
      entityType: "PublishJob",
      entityId: job.id,
      metadata: {
        idempotencyKey,
        channels,
        overallStatus: result.overallStatus,
        successfulChannels: result.channelResults.filter((r) => r.status === "PUBLISHED").map((r) => r.channel),
        failedChannels: result.channelResults.filter((r) => r.status === "FAILED").map((r) => ({
          channel: r.channel,
          errorCode: r.errorCode,
        })),
      },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      idempotencyKey,
      overallStatus: result.overallStatus,
      channelResults: result.channelResults,
      attempts: job.attempts,
      maxAttempts: job.maxAttempts,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
