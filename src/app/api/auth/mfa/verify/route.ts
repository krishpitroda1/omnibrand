import { NextRequest, NextResponse } from "next/server";
import { verifyTotpCode } from "@/lib/auth/mfa";
import { getSession, setSessionCookie } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, code } = body;

    if (!secret || !code) {
      return NextResponse.json(
        { error: "Secret and 6-digit TOTP code are required" },
        { status: 400 }
      );
    }

    const isValid = verifyTotpCode(secret, code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired TOTP code. Please try again." },
        { status: 401 }
      );
    }

    const session = await getSession();
    if (session) {
      await setSessionCookie({
        ...session,
        mfaVerified: true,
      });

      await writeAuditLog({
        workspaceId: session.workspaceId,
        actorId: session.userId,
        action: "MFA_VERIFIED_AND_ENABLED",
        entityType: "UserSecurity",
        entityId: session.userId,
        metadata: { method: "TOTP_RFC6238" },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });
    }

    return NextResponse.json({
      success: true,
      mfaVerified: true,
      message: "MFA verified successfully. Two-factor authentication is now active.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
