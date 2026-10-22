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

  const isMinifiedReactError =
    error.message?.includes("Minified React error") ||
    error.message?.includes("react.dev/errors");

  const displayMessage = isMinifiedReactError
    ? "An unexpected issue occurred on the server while loading this page. Please try refreshing or return shortly."
    : error.message || "An unexpected error occurred while loading this page.";

  return (
    <div className="w-full py-20 sm:py-28">
      <Container>
        <ErrorState
          title="Something went wrong"
          message={displayMessage}
          onRetry={reset}
        />
        {error.digest && (
          <p className="mt-4 text-center font-content text-xs text-muted/60">
            Error digest: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </Container>
    </div>
  );
}
