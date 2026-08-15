"use client";

import { Suspense, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import Button from "@/component/UI/Button";
import { toast } from "@/hooks/useToast";
import { signIn } from "@/app/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
        toast.error("Authentication Unsuccessful", {
          description:
            result.error.includes("lockout") || result.error.includes("locked")
              ? result.error
              : "Please double-check your email and password, then try again.",
        });
      }
    });
  }

  const inputClass = clsx(
    "w-full px-4 py-3 rounded-xl border-2 border-dark-one/15 bg-light font-content text-sm text-dark-one placeholder:text-faint transition-colors",
    "focus:border-accent focus:outline-none",
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Inactivity message */}
      {reason === "inactivity" && !error && (
        <div
          role="status"
          className="font-content text-xs text-amber-800 border border-amber-200 bg-amber-50 rounded-xl px-4 py-3"
        >
          Session expired due to 5 minutes of inactivity. Please sign in again.
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-content text-xs font-semibold uppercase tracking-wider text-dark-one/70"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="font-content text-xs font-semibold uppercase tracking-wider text-dark-one/70"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {/* Error / Rate limit notification */}
      {error && (
        <p
          role="alert"
          className="font-content text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl px-4 py-3"
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        loading={isPending}
        disabled={isPending}
        variant="primary"
        className="mt-2 w-full"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3"> 
        <Image
          src="/logo.png"
          alt="Toluwanimi Odufeko Logo"
          width={70}
          height={60}
          priority
          style={{ width: "auto", height: "auto" }}
        />
        <span className="font-header text-xl text-dark-one tracking-wide">
          Toluwanimi Odufeko
        </span>
        <span className="font-content text-xs uppercase tracking-widest text-accent-strong font-semibold">
          Admin Panel
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md border-2 border-dark-one/10 rounded-2xl bg-white shadow-sm p-8">
        <h1 className="font-header text-3xl text-dark-one mb-1">Sign in</h1>
        <p className="font-content text-sm text-muted mb-8">
          Enter your credentials to access the dashboard.
        </p>

        <Suspense
          fallback={
            <div className="py-8 text-center font-content text-sm text-muted">
              Loading...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-8 font-content text-xs text-faint">
        Not meant for you?{" "}
        <Link
          href="/"
          className="text-accent-strong underline underline-offset-4"
        >
          Return home
        </Link>
      </p>
    </div>
  );
}
