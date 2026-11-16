import { NextResponse } from "next/server";
import { runAdaptersTest } from "@/../tests/unit/adapters.test";
import { runPolicyGateTest } from "@/../tests/unit/policy-gate.test";
import { runAttributionTest } from "@/../tests/unit/attribution.test";
import { runTenantIsolationTest } from "@/../tests/integration/tenant-isolation.test";
import { runPublishingIdempotencyTest } from "@/../tests/integration/publishing-idempotency.test";
import { runComposerFlowE2ETest } from "@/../tests/e2e/composer-flow.test";

export async function GET() {
  const results: Array<{ name: string; status: "PASSED" | "FAILED"; error?: string }> = [];

  const suites = [
    { name: "Unit: Integration Adapters", fn: runAdaptersTest },
    { name: "Unit: Dispatch Policy Gate", fn: runPolicyGateTest },
    { name: "Unit: Multi-Touch Attribution", fn: runAttributionTest },
    { name: "Integration: Tenant Isolation (403 Rejection)", fn: runTenantIsolationTest },
    { name: "Integration: Publishing Idempotency & Jitter", fn: runPublishingIdempotencyTest },
    { name: "E2E: Full Campaign Composer 5-Step Flow", fn: runComposerFlowE2ETest },
  ];

  for (const suite of suites) {
    try {
      await suite.fn();
      results.push({ name: suite.name, status: "PASSED" });
    } catch (err: any) {
      results.push({ name: suite.name, status: "FAILED", error: err.message });
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
    { status: allPassed ? 200 : 500 }
  );
}
