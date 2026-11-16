import crypto from "crypto";

export interface WebhookVerificationResult {
  isValid: boolean;
  reason?: string;
}

// In-memory nonce cache to protect against replay attacks
const RECENT_NONCES = new Map<string, number>();

/**
 * Verifies webhook signatures across providers (HMAC-SHA256) and prevents replay attacks.
 */
export function verifyWebhookRequest(
  provider: "ayrshare" | "meta" | "smscloud",
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
  secretKey = "omnibrand_webhook_shared_secret_2026"
): WebhookVerificationResult {
  // 1. Signature presence check
  if (!signatureHeader) {
    return { isValid: false, reason: "Missing provider signature header" };
  }

  // 2. Replay attack protection: timestamp drift check (rejects if drift > 300s)
  if (timestampHeader) {
    const ts = parseInt(timestampHeader, 10);
    const now = Math.floor(Date.now() / 1000);
    const driftSeconds = Math.abs(now - ts);
    if (isNaN(ts) || driftSeconds > 300) {
      return {
        isValid: false,
        reason: `Replay attack rejected: Timestamp drift of ${driftSeconds}s exceeds allowed 300s window`,
      };
    }

    // Nonce check: rawBody hash + timestamp
    const nonce = crypto
      .createHash("sha256")
      .update(`${timestampHeader}:${rawBody}`)
      .digest("hex");

    if (RECENT_NONCES.has(nonce)) {
      return { isValid: false, reason: "Replay attack rejected: Duplicate webhook nonce detected" };
    }
    RECENT_NONCES.set(nonce, Date.now());

    // Clean up old nonces older than 10 minutes
    if (RECENT_NONCES.size > 1000) {
      const tenMinutesAgo = Date.now() - 600000;
      RECENT_NONCES.forEach((time, n) => {
        if (time < tenMinutesAgo) RECENT_NONCES.delete(n);
      });
    }
  }

  // 3. Cryptographic HMAC-SHA256 signature verification
  let expectedSignature = "";
  let receivedSignature = signatureHeader;

  if (provider === "meta") {
    // Meta uses format "sha256=abcdef..."
    if (signatureHeader.startsWith("sha256=")) {
      receivedSignature = signatureHeader.slice(7);
    }
    expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("hex");
  } else if (provider === "ayrshare") {
    expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(`${timestampHeader || ""}.${rawBody}`)
      .digest("hex");
  } else if (provider === "smscloud") {
    expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("hex");
  }

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(receivedSignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
    if (!isMatch) {
      return { isValid: false, reason: "Cryptographic signature mismatch" };
    }
    return { isValid: true };
  } catch {
    // If length mismatch
    return { isValid: false, reason: "Signature format or length invalid" };
  }
}
