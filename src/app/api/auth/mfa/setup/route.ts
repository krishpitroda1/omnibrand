import { NextRequest, NextResponse } from "next/server";
import { createMfaSetup } from "@/lib/auth/mfa";
import { getSession } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const userEmail = session?.email || "alex.chen@omnibrand.io";
    const workspaceId = session?.workspaceId || "ws-prod-01";

    const setup = createMfaSetup(userEmail);

    await writeAuditLog({
      workspaceId,
      actorId: session?.userId || "usr-admin-01",
      action: "MFA_SETUP_INITIATED",
      entityType: "UserSecurity",
      entityId: session?.userId || "usr-admin-01",
      metadata: { recoveryCodesGenerated: setup.recoveryCodes.length },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      secret: setup.secret,
      otpauthUri: setup.otpauthUri,
      recoveryCodes: setup.recoveryCodes,
      message: "Scan OTPAuth URI in Google Authenticator or 1Password, then verify with a 6-digit code.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
