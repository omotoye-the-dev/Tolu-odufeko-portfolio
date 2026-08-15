import type { ReactNode } from "react";
import Header from "@/component/common/Header";
import Footer from "@/component/common/Footer";

interface PublicLayoutProps {
  readonly children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
