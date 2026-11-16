import { NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_MEMBERSHIPS, MOCK_USERS } from "@/lib/mock-data/tenancy";

const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "CREATOR", "ANALYST", "VIEWER"]),
  workspaceId: z.string(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId") || request.headers.get("x-workspace-id");

  let members = MOCK_MEMBERSHIPS;
  if (workspaceId) {
    members = members.filter((m) => m.workspaceId === workspaceId);
  }

  return NextResponse.json({ memberships: members });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, workspaceId } = InviteMemberSchema.parse(body);

    const newUserId = `usr-${Date.now()}`;
    const newUser = {
      id: newUserId,
      email,
      name: email.split("@")[0],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const newMembership = {
      id: `mem-${Date.now()}`,
      userId: newUserId,
      organizationId: "org-aivon-01",
      workspaceId,
      role,
      user: newUser,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      membership: newMembership,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Invalid invite payload" },
      { status: 400 }
    );
  }
}

