import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { cookies } from "next/headers";
import { getUserById } from "./store";
import type { PublicUser, User } from "./types";

export const SESSION_COOKIE = "cr_session";
const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// ---------------------------------------------------------------------------
// Password hashing (scrypt) — stored as "salt:hash" hex.
// ---------------------------------------------------------------------------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ---------------------------------------------------------------------------
// Signed session token: "<userId>.<hmac>"
// ---------------------------------------------------------------------------

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createToken(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const userId = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = sign(userId);
  if (sig.length !== expected.length) return null;
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? userId : null;
}

// ---------------------------------------------------------------------------
// Cookie + current-user helpers (server only)
// ---------------------------------------------------------------------------

export async function setSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const userId = verifyToken(store.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  return getUserById(userId);
}

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
