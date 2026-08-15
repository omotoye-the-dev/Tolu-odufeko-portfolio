import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Toluwanimi Odufeko",
  robots: { index: false, follow: false },
};

interface AdminLayoutProps {
  readonly children: ReactNode;
}

// The (admin) route group has its own layout, intentionally
// omitting the public Header and Footer.
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>;
}
