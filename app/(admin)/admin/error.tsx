"use client";

import { useEffect } from "react";
import AdminShell from "@/component/admin/AdminShell";
import ErrorState from "@/component/UI/ErrorState";

interface AdminErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  const isMinifiedReactError =
    error.message?.includes("Minified React error") ||
    error.message?.includes("react.dev/errors");

  const displayMessage = isMinifiedReactError
    ? "A server component error occurred while rendering this admin view. Check your terminal/server logs for the full stack trace."
    : error.message || "Failed to load admin content.";

  return (
    <AdminShell>
      <div className="px-8 py-16 max-w-2xl">
        <ErrorState
          title="Admin Error"
          message={displayMessage}
          onRetry={reset}
        />
        {error.digest && (
          <p className="mt-4 font-content text-xs text-muted/60">
            Error digest: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </div>
    </AdminShell>
  );
}
