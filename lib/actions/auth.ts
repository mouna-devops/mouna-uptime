"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import bcrypt from "bcryptjs";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function redirectWithError(path: "/login" | "/signup", code: string): never {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("error", code);
  redirect(`${path}?${url.searchParams.toString()}`);
}

async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function signup(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!email) {
    redirectWithError("/signup", "missing_email");
  }
  if (!password || password.length < 8) {
    redirectWithError("/signup", "weak_password");
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    redirectWithError("/signup", "email_in_use");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: {
      email,
      name: name || email.split("@")[0],
      passwordHash,
    },
  });

  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (!email) {
    redirectWithError("/login", "missing_email");
  }
  if (!password) {
    redirectWithError("/login", "missing_password");
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    redirectWithError("/login", "invalid_credentials");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    redirectWithError("/login", "invalid_credentials");
  }

  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
