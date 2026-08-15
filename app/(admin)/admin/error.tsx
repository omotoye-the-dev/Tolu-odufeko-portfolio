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

  return (
    <AdminShell>
      <div className="px-8 py-16 max-w-2xl">
        <ErrorState
          title="Admin Error"
          message={error.message || "Failed to load admin content."}
          onRetry={reset}
        />
      </div>
    </AdminShell>
  );
}
