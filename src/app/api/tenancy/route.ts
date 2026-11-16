import { NextResponse } from "next/server";
import {
  MOCK_ORGANIZATION,
  MOCK_WORKSPACES,
  MOCK_BRANDS,
  MOCK_USERS,
  MOCK_MEMBERSHIPS,
} from "@/lib/mock-data/tenancy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId") || request.headers.get("x-workspace-id");

  // Invariant: Scoped by workspaceId
  const activeWorkspace = workspaceId
    ? MOCK_WORKSPACES.find((w) => w.id === workspaceId) || MOCK_WORKSPACES[0]
    : MOCK_WORKSPACES[0];

  const workspaceBrands = MOCK_BRANDS.filter(
    (b) => b.workspaceId === activeWorkspace.id
  );

  return NextResponse.json({
    organization: MOCK_ORGANIZATION,
    workspaces: MOCK_WORKSPACES,
    activeWorkspace,
    brands: workspaceBrands.length > 0 ? workspaceBrands : MOCK_BRANDS,
    memberships: MOCK_MEMBERSHIPS,
    users: MOCK_USERS,
  });
}

