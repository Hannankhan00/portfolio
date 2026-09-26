import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "portfolio_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecretKey(): string {
  return process.env.SESSION_SECRET || process.env.DATABASE_URL || "neon-portfolio-default-secure-secret-key-2026";
}

export interface SessionData {
  userId: number;
  email: string;
  name: string | null;
  role: string;
  exp: number;
}

export function signPayload(data: Omit<SessionData, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload: SessionData = { ...data, exp };
  const jsonStr = JSON.stringify(payload);
  const base64Data = Buffer.from(jsonStr).toString("base64url");
  
  const hmac = crypto.createHmac("sha256", getSecretKey());
  hmac.update(base64Data);
  const signature = hmac.digest("base64url");

  return `${base64Data}.${signature}`;
}

export function verifyToken(token: string): SessionData | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [base64Data, signature] = parts;

    const hmac = crypto.createHmac("sha256", getSecretKey());
    hmac.update(base64Data);
    const expectedSig = hmac.digest("base64url");

    if (signature !== expectedSig) return null;

    const jsonStr = Buffer.from(base64Data, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as SessionData;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch (err) {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return null;
  return verifyToken(sessionCookie.value);
}

export async function setSessionCookie(data: Omit<SessionData, "exp">) {
  const token = signPayload(data);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
