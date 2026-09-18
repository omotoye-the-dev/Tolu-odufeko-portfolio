import type { Metadata } from "next";
import Container from "@/component/UI/Container";
import Button from "@/component/UI/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="w-full py-20 sm:py-28">
      <Container className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="font-header text-7xl sm:text-8xl md:text-9xl font-bold text-accent">
          404
        </div>
        <h1 className="mt-4 font-header text-3xl sm:text-4xl font-bold text-dark-one">
          Page Not Found
        </h1>
        <p className="font-content mt-3 max-w-md text-base text-muted">
          The page you are looking for doesn&apos;t exist, has been moved, or is
          temporarily unavailable.
        </p>
        <div className="mt-8">
          <Button href="/" variant="primary">
            Back to Home &rarr;
          </Button>
        </div>
      </Container>
    </div>
  );
}
