import { cookies } from "next/headers";
import crypto from "crypto";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  organizationId: string;
  workspaceId: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "CREATOR" | "ANALYST" | "VIEWER";
  mfaVerified?: boolean;
  issuedAt: number;
  expiresAt: number;
}

const SESSION_COOKIE_NAME = "omnibrand_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "omnibrand_secure_auth_secret_enterprise_2026";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Create signed token (HMAC-SHA256 signature attached to base64 payload)
export function signSessionToken(payload: Omit<SessionPayload, "issuedAt" | "expiresAt">): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: SessionPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

// Verify signed token
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadB64)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );
    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// Server action / route handler cookie helpers
export async function setSessionCookie(payload: Omit<SessionPayload, "issuedAt" | "expiresAt">) {
  const token = signSessionToken(payload);
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifySessionToken(cookie.value);
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME };
