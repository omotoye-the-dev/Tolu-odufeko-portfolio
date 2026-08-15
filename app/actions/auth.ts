"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// In-memory rate limiting store for failed login attempts
interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();

function cleanOldAttempts(): void {
  const now = Date.now();
  for (const [key, entry] of loginAttempts.entries()) {
    if (entry.lockedUntil && entry.lockedUntil < now) {
      loginAttempts.delete(key);
    } else if (!entry.lockedUntil && now - entry.lastAttempt > LOCKOUT_DURATION_MS) {
      loginAttempts.delete(key);
    }
  }
}

export async function signIn(
  formData: FormData
): Promise<{ error: string } | void> {
  cleanOldAttempts();

  const raw = Object.fromEntries(formData.entries());
  const parsed = LoginSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const now = Date.now();
  const attemptRecord = loginAttempts.get(email);

  // Check if locked out
  if (attemptRecord?.lockedUntil && attemptRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil(
      (attemptRecord.lockedUntil - now) / 1000
    );
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    return {
      error: `Too many failed login attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Record failed attempt
    const currentAttempts = (attemptRecord?.attempts ?? 0) + 1;
    if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
      loginAttempts.set(email, {
        attempts: currentAttempts,
        lastAttempt: now,
        lockedUntil: now + LOCKOUT_DURATION_MS,
      });
      return {
        error:
          "Too many failed login attempts. Account locked for 5 minutes for security.",
      };
    }

    loginAttempts.set(email, {
      attempts: currentAttempts,
      lastAttempt: now,
    });

    const remainingAttempts = MAX_LOGIN_ATTEMPTS - currentAttempts;
    return {
      error: `Invalid email or password. (${remainingAttempts} attempt${remainingAttempts === 1 ? "" : "s"} left before 5-minute lockout)`,
    };
  }

  // Clear rate-limit attempts on success
  loginAttempts.delete(email);

  // Set last activity timestamp cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_last_activity", Date.now().toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day cookie maxAge, validated by timestamp
  });

  redirect("/admin");
}

export async function updateAdminActivity(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("admin_last_activity", Date.now().toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function signOut(reason?: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_last_activity");

  const supabase = await createClient();
  await supabase.auth.signOut();

  if (reason) {
    redirect(`/admin/login?reason=${encodeURIComponent(reason)}`);
  }
  redirect("/admin/login");
}
