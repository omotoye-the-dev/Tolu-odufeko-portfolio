"use client";

import { useEffect } from "react";
import Container from "@/component/UI/Container";
import ErrorState from "@/component/UI/ErrorState";

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service if needed
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="w-full py-20 sm:py-28">
      <Container>
        <ErrorState
          title="Something went wrong"
          message={error.message || "An unexpected error occurred while loading this page."}
          onRetry={reset}
        />
      </Container>
    </div>
  );
}
