import { NextRequest, NextResponse } from "next/server";
import { validateMediaUpload } from "@/lib/media/processor";
import { createPresignedUploadUrl } from "@/lib/media/storage";
import { requirePermission } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, contentType, fileSizeBytes, workspaceId } = body;

    const actorId = req.headers.get("x-user-id") || "usr-admin-01";
    const targetWorkspaceId = req.headers.get("x-workspace-id") || workspaceId || "ws-prod-01";

    // 1. RBAC permission check
    await requirePermission(actorId, targetWorkspaceId, "media:upload");

    // 2. MIME & Size Validation
    const validation = validateMediaUpload(contentType, fileSizeBytes);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Generate presigned upload URL
    const presigned = createPresignedUploadUrl({
      workspaceId: targetWorkspaceId,
      fileName,
      contentType,
      fileSizeBytes,
    });

    // 4. Audit Log
    await writeAuditLog({
      workspaceId: targetWorkspaceId,
      actorId,
      action: "MEDIA_UPLOAD_PRESIGNED_GENERATED",
      entityType: "MediaAsset",
      entityId: presigned.assetKey,
      metadata: { fileName, contentType, fileSizeBytes },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      uploadUrl: presigned.uploadUrl,
      assetKey: presigned.assetKey,
      cdnUrl: presigned.cdnUrl,
      headers: presigned.headers,
      expiresInSeconds: presigned.expiresInSeconds,
      mediaType: validation.mediaType,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
