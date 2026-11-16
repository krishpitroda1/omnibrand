import crypto from "crypto";

export interface MfaSetupResult {
  secret: string;
  otpauthUri: string;
  recoveryCodes: string[];
}

// Generate base32 secret string (20 bytes / 160 bits)
export function generateMfaSecret(): string {
  const bytes = crypto.randomBytes(20);
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  for (let i = 0; i < bytes.length; i++) {
    secret += base32Chars[bytes[i] % 32];
  }
  return secret;
}

// Generate 8 alphanumeric recovery codes (10 chars each)
export function generateRecoveryCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(5).toString("hex").toUpperCase();
    codes.push(`${code.slice(0, 5)}-${code.slice(5)}`);
  }
  return codes;
}

// TOTP code generator for verification (RFC 6238)
export function generateTotpCode(secret: string, timeStepWindow = 0): string {
  const timeStep = 30; // 30 second window
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStep) + timeStepWindow;

  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  // Base32 decode secret
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanSecret = secret.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (let i = 0; i < cleanSecret.length; i++) {
    const val = base32Chars.indexOf(cleanSecret[i]);
    bits += val.toString(2).padStart(5, "0");
  }
  const secretBytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    secretBytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  const key = Buffer.from(secretBytes);

  const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const codeInt =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const code = (codeInt % 1000000).toString().padStart(6, "0");
  return code;
}

/**
 * Verifies a 6-digit TOTP code against a user secret with a +/- 1 step drift tolerance
 */
export function verifyTotpCode(secret: string, userCode: string): boolean {
  if (!secret || !userCode || userCode.length !== 6) return false;

  // Check current window, -1 window, +1 window (tolerance for clock drift)
  for (const drift of [0, -1, 1]) {
    const expected = generateTotpCode(secret, drift);
    if (crypto.timingSafeEqual(Buffer.from(userCode), Buffer.from(expected))) {
      return true;
    }
  }
  return false;
}

export function createMfaSetup(userEmail: string, issuer = "OmniBrandOS"): MfaSetupResult {
  const secret = generateMfaSecret();
  const otpauthUri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(
    userEmail
  )}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
  const recoveryCodes = generateRecoveryCodes(8);

  return { secret, otpauthUri, recoveryCodes };
}
