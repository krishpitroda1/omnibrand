import { runAdaptersTest } from "../tests/unit/adapters.test";
import { runPolicyGateTest } from "../tests/unit/policy-gate.test";
import { runAttributionTest } from "../tests/unit/attribution.test";
import { runTenantIsolationTest } from "../tests/integration/tenant-isolation.test";
import { runPublishingIdempotencyTest } from "../tests/integration/publishing-idempotency.test";
import { runComposerFlowE2ETest } from "../tests/e2e/composer-flow.test";

async function main() {
  console.log("=================================================================");
  console.log(" OmniBrand OS Commercial Hardening Verification Suite");
  console.log("=================================================================\n");

  let passed = 0;
  let total = 6;

  try {
    // 1. Adapters Unit Test
    await runAdaptersTest();
    passed++;

    // 2. Policy Gate Unit Test
    await runPolicyGateTest();
    passed++;

    // 3. Attribution Models Unit Test
    await runAttributionTest();
    passed++;

    // 4. Tenant Isolation Integration Test
    await runTenantIsolationTest();
    passed++;

    // 5. Publishing Idempotency Integration Test
    await runPublishingIdempotencyTest();
    passed++;

    // 6. Campaign Composer E2E Flow Test
    await runComposerFlowE2ETest();
    passed++;

    console.log("\n=================================================================");
    console.log(` ALL ${passed}/${total} COMMERCIAL TEST SUITES PASSED (0 FAILS)`);
    console.log("=================================================================");
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ TEST SUITE FAILED:", error.message);
    process.exit(1);
  }
}

main();
