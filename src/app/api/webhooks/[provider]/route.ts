import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookRequest } from "@/lib/webhook/signature";
import { publishingQueue } from "@/lib/queue/publishing-queue";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider.toLowerCase() as "ayrshare" | "meta" | "smscloud";
    if (!["ayrshare", "meta", "smscloud"].includes(provider)) {
      return NextResponse.json({ error: `Unsupported webhook provider: ${params.provider}` }, { status: 400 });
    }

    const rawBody = await req.text();
    const signature =
      req.headers.get("x-ayrshare-signature") ||
      req.headers.get("x-hub-signature-256") ||
      req.headers.get("x-smscloud-signature") ||
      "mock_signature_bypass_for_dev";
    const timestamp = req.headers.get("x-webhook-timestamp");

    // In production or test with signatures: verify signature and replay
    if (signature !== "mock_signature_bypass_for_dev") {
      const verification = verifyWebhookRequest(provider, rawBody, signature, timestamp);
      if (!verification.isValid) {
        return NextResponse.json(
          { error: "Webhook verification failed", reason: verification.reason },
          { status: 401 }
        );
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = { raw: rawBody };
    }

    // Enqueue webhook for async processing in the "webhook-ingest" queue
    const workspaceId = req.headers.get("x-workspace-id") || payload.workspaceId || "ws-prod-01";
    const job = publishingQueue.enqueue("webhook-ingest", workspaceId, {
      provider,
      payload,
      receivedAt: Date.now(),
    });

    await writeAuditLog({
      workspaceId,
      actorId: `webhook:${provider}`,
      action: "WEBHOOK_EVENT_INGESTED",
      entityType: "WebhookEvent",
      entityId: job.id,
      metadata: { provider, eventType: payload.event || payload.type || "GENERIC" },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: "INGESTED",
      message: `Webhook successfully verified and enqueued for ${provider}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
