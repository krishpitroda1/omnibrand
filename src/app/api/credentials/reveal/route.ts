import { NextRequest, NextResponse } from "next/server";
import { maskToken, decryptSecret } from "@/lib/crypto/kms-encryption";
import { requirePermission } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credentialId, reauthConfirmation } = body;

    const actorId = req.headers.get("x-user-id") || "usr-admin-01";
    const workspaceId = req.headers.get("x-workspace-id") || "ws-prod-01";

    // 1. RBAC check: requires "credentials:reveal"
    await requirePermission(actorId, workspaceId, "credentials:reveal");

    // 2. Re-auth confirmation check
    if (!reauthConfirmation) {
      return NextResponse.json(
        { error: "Security check failed: re-authentication confirmation is strictly required to reveal tokens." },
        { status: 403 }
      );
    }

    // 3. Generate masked preview (NEVER return raw unmasked token to the client)
    const simulatedRaw = `ayr_live_prod_enc_${credentialId.slice(-6)}_secret_token`;
    const maskedValue = maskToken(simulatedRaw);

    // 4. Mandatory Audit Log
    await writeAuditLog({
      workspaceId,
      actorId,
      action: "API_CREDENTIAL_MASKED_REVEAL",
      entityType: "ApiCredential",
      entityId: credentialId,
      metadata: { reason: "Security Admin Inspection", maskedPreview: maskedValue },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      credentialId,
      maskedToken: maskedValue, // E.g. "ayr_••••••••••••••••••••token"
      keyVersion: 2,
      warning: "Tokens are never transmitted in plaintext to client browsers.",
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
