import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/store";
import { hashPassword, setSession, toPublicUser } from "@/lib/auth";
import type { Role } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES: Role[] = ["student", "professional"];

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const role = body.role as Role;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }
  if (!ROLES.includes(role)) {
    return NextResponse.json(
      { error: "Choose an account type (student or professional)" },
      { status: 400 },
    );
  }

  if (await getUserByEmail(email)) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 },
    );
  }

  const user = await createUser({
    name,
    email,
    role,
    passwordHash: hashPassword(password),
  });

  await setSession(user.id);
  return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
}
