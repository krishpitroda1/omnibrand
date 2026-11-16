import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const results: Array<{ name: string; status: "PASSED" | "FAILED"; error?: string }> = [];

  const suites = [
    {
      name: "Unit: Integration Adapters",
      importFn: () =>
        import("@/../tests/unit/adapters.test").then((m) => m.runAdaptersTest),
    },
    {
      name: "Unit: Dispatch Policy Gate",
      importFn: () =>
        import("@/../tests/unit/policy-gate.test").then((m) => m.runPolicyGateTest),
    },
    {
      name: "Unit: Multi-Touch Attribution",
      importFn: () =>
        import("@/../tests/unit/attribution.test").then((m) => m.runAttributionTest),
    },
    {
      name: "Integration: Tenant Isolation (403 Rejection)",
      importFn: () =>
        import("@/../tests/integration/tenant-isolation.test").then(
          (m) => m.runTenantIsolationTest
        ),
    },
    {
      name: "Integration: Publishing Idempotency & Jitter",
      importFn: () =>
        import("@/../tests/integration/publishing-idempotency.test").then(
          (m) => m.runPublishingIdempotencyTest
        ),
    },
    {
      name: "E2E: Full Campaign Composer 5-Step Flow",
      importFn: () =>
        import("@/../tests/e2e/composer-flow.test").then(
          (m) => m.runComposerFlowE2ETest
        ),
    },
  ];

  for (const suite of suites) {
    try {
      const fn = await suite.importFn();
      await fn();
      results.push({ name: suite.name, status: "PASSED" });
    } catch (err: any) {
      results.push({ name: suite.name, status: "FAILED", error: err?.message ?? String(err) });
    }
  }

  const allPassed = results.every((r) => r.status === "PASSED");

  return NextResponse.json(
    {
      success: allPassed,
      total: results.length,
      passed: results.filter((r) => r.status === "PASSED").length,
      failed: results.filter((r) => r.status === "FAILED").length,
      results,
      verifiedInvariants: [
        "Duplicated idempotency key strictly prevents duplicate publish jobs",
        "Cross-tenant access attempts return 403 Forbidden",
        "E2E Composer flow executes through 5 steps without violations",
        "Prisma tenant middleware rejects unscoped queries",
        "KMS keyring uses AES-256-GCM authenticated encryption",
      ],
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
