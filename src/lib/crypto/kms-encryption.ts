import crypto from "crypto";

export interface EncryptedPayload {
  keyVersion: number;
  ciphertext: string;
}

// Master encryption keys by version (simulating AWS KMS / GCP KMS keyring)
const KMS_KEYRING: Record<number, Buffer> = {
  1: crypto.createHash("sha256").update(process.env.KMS_MASTER_KEY_V1 || "omnibrand_kms_key_v1_secure_2026").digest(),
  2: crypto.createHash("sha256").update(process.env.KMS_MASTER_KEY_V2 || "omnibrand_kms_key_v2_rotated_2026").digest(),
};

export const CURRENT_KMS_VERSION = 2;

/**
 * Encrypts a plaintext secret using AES-256-GCM authenticated encryption.
 * Output format: "v{version}:{iv_hex}:{authTag_hex}:{ciphertext_hex}"
 */
export function encryptSecret(plaintext: string, version = CURRENT_KMS_VERSION): string {
  if (!plaintext) throw new Error("Cannot encrypt empty secret");

  const key = KMS_KEYRING[version];
  if (!key) throw new Error(`KMS Key Version ${version} not found in keyring`);

  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `v${version}:${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM ciphertext payload and validates authentication tag.
 * NEVER return decrypted tokens to the browser!
 */
export function decryptSecret(encryptedPayload: string): { plaintext: string; keyVersion: number } {
  if (!encryptedPayload || !encryptedPayload.startsWith("v")) {
    // If legacy or unformatted in mock dev, handle gracefully
    if (encryptedPayload.length < 20) {
      return { plaintext: encryptedPayload, keyVersion: 1 };
    }
    throw new Error("Invalid encrypted payload format: expected v{version}:{iv}:{tag}:{data}");
  }

  const parts = encryptedPayload.split(":");
  if (parts.length !== 4) {
    throw new Error("Malformed AES-256-GCM encrypted string");
  }

  const version = parseInt(parts[0].replace("v", ""), 10);
  const iv = Buffer.from(parts[1], "hex");
  const authTag = Buffer.from(parts[2], "hex");
  const ciphertext = parts[3];

  const key = KMS_KEYRING[version];
  if (!key) {
    throw new Error(`KMS Key Version ${version} not available for decryption`);
  }

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return { plaintext: decrypted, keyVersion: version };
}

/**
 * Rotates an encrypted secret to the latest KMS key version without leaking plaintext.
 */
export function rotateEncryptedSecret(encryptedPayload: string): { newPayload: string; oldVersion: number; newVersion: number } {
  const { plaintext, keyVersion } = decryptSecret(encryptedPayload);
  const newPayload = encryptSecret(plaintext, CURRENT_KMS_VERSION);
  return {
    newPayload,
    oldVersion: keyVersion,
    newVersion: CURRENT_KMS_VERSION,
  };
}

/**
 * Masks a sensitive token for safe UI display (e.g. "ayr_live_••••••••••••••••3f8a")
 */
export function maskToken(token: string): string {
  if (!token) return "••••••••••••••••";
  if (token.length <= 8) return "••••••••";

  const prefix = token.slice(0, 4);
  const suffix = token.slice(-4);
  const maskedLength = Math.max(8, token.length - 8);
  return `${prefix}${"•".repeat(maskedLength)}${suffix}`;
}
