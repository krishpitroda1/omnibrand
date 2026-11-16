import { NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_API_CREDENTIALS, MOCK_AUDIT_LOGS } from "@/lib/mock-data/tenancy";

const RotateKeySchema = z.object({
  credentialId: z.string(),
  workspaceId: z.string(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId") || request.headers.get("x-workspace-id");

  let creds = MOCK_API_CREDENTIALS;
  if (workspaceId) {
    creds = creds.filter((c) => c.workspaceId === workspaceId);
  }

  return NextResponse.json({ credentials: creds });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credentialId, workspaceId } = RotateKeySchema.parse(body);

    const cred = MOCK_API_CREDENTIALS.find((c) => c.id === credentialId);
    if (!cred) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 });
    }

    const rotated = {
      ...cred,
      keyVersion: cred.keyVersion + 1,
      rotatedAt: new Date().toISOString(),
      maskedValue: `${cred.maskedValue.substring(0, 10)}••••••••${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const newAudit = {
      id: `aud-${Date.now()}`,
      organizationId: "org-aivon-01",
      workspaceId,
      actorName: "Elena Rostova",
      actorEmail: "elena.rostova@aivonholdings.com",
      action: "API_KEY_ROTATED",
      entityType: "ApiCredential",
      entityId: credentialId,
      metadata: { newVersion: rotated.keyVersion },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      credential: rotated,
      auditLog: newAudit,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Invalid rotation request" },
      { status: 400 }
    );
  }
}

