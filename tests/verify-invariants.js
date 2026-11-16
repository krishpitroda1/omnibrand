const http = require("http");

function postJson(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
          ...headers,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ statusCode: res.statusCode, data: body });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

function getJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: "GET",
        headers,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ statusCode: res.statusCode, data: body });
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function verifyLive() {
  console.log("==================================================================");
  console.log(" Running Direct HTTP Invariant Verification against Live Server");
  console.log("==================================================================\n");

  // 1. Verify Health & Readiness Endpoint
  const health = await getJson("http://localhost:3000/api/health");
  console.log(`[1] /api/health Status: ${health.statusCode} -> Service: ${health.data.service}`);
  if (health.statusCode !== 200) throw new Error("Health check failed");

  const ready = await getJson("http://localhost:3000/api/health/ready");
  console.log(`[2] /api/health/ready Status: ${ready.statusCode} -> Status: ${ready.data.status}`);
  if (ready.statusCode !== 200) throw new Error("Readiness check failed");

  // 2. Verify Idempotency Deduplication on /api/publish
  const idempKey = `idemp-live-test-${Date.now()}`;
  const pubPayload = {
    idempotencyKey: idempKey,
    workspaceId: "ws-prod-01",
    channels: ["INSTAGRAM", "WHATSAPP"],
    caption: "Commercial Launch Invariant Check",
  };

  const call1 = await postJson("http://localhost:3000/api/publish", pubPayload, {
    "x-workspace-id": "ws-prod-01",
    "x-user-id": "usr-admin-01",
  });
  console.log(`[3] Publish Attempt 1 Status: ${call1.statusCode} -> Job ID: ${call1.data.jobId}, Duplicate: ${Boolean(call1.data.isDuplicate)}`);

  const call2 = await postJson("http://localhost:3000/api/publish", pubPayload, {
    "x-workspace-id": "ws-prod-01",
    "x-user-id": "usr-admin-01",
  });
  console.log(`[4] Publish Attempt 2 (Duplicate Key): ${call2.statusCode} -> Job ID: ${call2.data.jobId}, Duplicate: ${call2.data.isDuplicate}`);

  if (call1.data.jobId !== call2.data.jobId) {
    throw new Error("Idempotency violation: Returned different job IDs for same key!");
  }
  if (!call2.data.isDuplicate) {
    throw new Error("Idempotency violation: Second attempt was not flagged as duplicate!");
  }
  console.log("  ✔ Invariant Verified: Duplicated idempotency key did not create a second publish job.");

  // 3. Verify Cross-Tenant Scoping Rejection (Returns 403 Forbidden)
  // Request to a workspace-scoped API without workspaceId or cross-tenant
  const crossTenantAttempt = await postJson(
    "http://localhost:3000/api/credentials/rotate",
    { credentialId: "cred-ayrshare-01", workspaceId: "ws-foreign-workspace-99" },
    {
      "x-workspace-id": "ws-foreign-workspace-99",
      "x-user-id": "usr-creator-02", // has no membership in foreign workspace
    }
  );

  console.log(`[5] Cross-Tenant Request Status: ${crossTenantAttempt.statusCode} -> Error: ${crossTenantAttempt.data.error}`);
  if (crossTenantAttempt.statusCode !== 403) {
    throw new Error(`Expected HTTP 403 Forbidden on cross-tenant request, got ${crossTenantAttempt.statusCode}`);
  }
  console.log("  ✔ Invariant Verified: Cross-tenant request strictly rejected with HTTP 403 Forbidden.");

  // 4. Verify Admin Observability Page Status
  const adminPage = await getJson("http://localhost:3000/admin/observability");
  console.log(`[6] /admin/observability Route Status: ${adminPage.statusCode}`);

  console.log("\n==================================================================");
  console.log(" ALL COMMERCIAL HARDENING INVARIANTS VERIFIED SUCCESSFULLY!");
  console.log("==================================================================");
}

verifyLive().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
