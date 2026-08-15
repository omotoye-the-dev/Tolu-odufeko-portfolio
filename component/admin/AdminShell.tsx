"use client";

import { useState, useCallback, type ReactNode } from "react";
import Image from "next/image";
import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminInactivityGuard from "@/component/admin/AdminInactivityGuard";

interface AdminShellProps {
  readonly children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-light font-content text-dark-one">
      <AdminInactivityGuard />

      {/* Mobile Top App Bar */}
      <header className="md:hidden sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-dark-one/10 bg-white px-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Toluwanimi Odufeko Logo"
            width={24}
            height={21}
            priority
            style={{ width: "auto", height: "auto" }}
          />
          <span className="font-header text-sm font-bold text-dark-one">
            Toluwanimi{" "}
            <span className="font-content text-[10px] uppercase tracking-widest text-accent-strong font-semibold ml-1">
              Admin
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open admin navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-dark-one/15 bg-light text-dark-one hover:bg-accent/20 transition-colors cursor-pointer active:scale-95"
        >
          <svg
            className="h-5 w-5 text-dark-one"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Responsive Sidebar */}
      <AdminSidebar isOpen={isMobileNavOpen} onClose={handleClose} />

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}

export default AdminShell;
