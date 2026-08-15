"use client";

import { useEffect, useSyncExternalStore, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { signOut } from "@/app/actions/auth";

interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "⬡" },
  { label: "Projects", href: "/admin/projects", icon: "◈" },
  { label: "Articles", href: "/admin/articles", icon: "◇" },
  { label: "Now", href: "/admin/now", icon: "◉" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
] as const;

export interface AdminSidebarProps {
  readonly isOpen?: boolean;
  readonly onClose?: () => void;
}

const emptySubscribe = () => () => {};

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Close mobile drawer on route change
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  const renderNavContent = (isMobile: boolean) => (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-one/10 px-6 py-5 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Image
            src="/Logo.png"
            alt="Toluwanimi Odufeko Logo"
            width={28}
            height={25}
            priority
            style={{ width: "auto", height: "auto" }}
          />
          <div className="flex flex-col">
            <span className="font-header text-sm text-dark-one leading-tight">
              Toluwanimi
            </span>
            <span className="font-content text-[10px] uppercase tracking-widest text-accent-strong font-semibold">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-dark-one/10 bg-light text-muted hover:bg-black/5 hover:text-dark-one transition-colors cursor-pointer active:scale-95"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        aria-label="Admin navigation"
        className="flex-1 overflow-y-auto px-3 py-4 bg-white"
      >
        <ul className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-4 py-3 font-content text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-accent/20 text-dark-one border-l-4 border-accent font-bold"
                      : "text-muted hover:bg-black/5 hover:text-dark-one",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="text-base w-4 text-center"
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-dark-one/10 px-3 py-4 flex flex-col gap-1 bg-white shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-content text-sm text-muted hover:text-dark-one hover:bg-black/5 transition-colors"
        >
          <span aria-hidden="true" className="text-base w-4 text-center">
            ↗
          </span>
          View Site
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-content text-sm text-muted hover:text-dark-one hover:bg-black/5 transition-colors text-left w-full disabled:opacity-50 cursor-pointer"
        >
          <span aria-hidden="true" className="text-base w-4 text-center">
            →
          </span>
          {isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:flex h-full w-60 shrink-0 flex-col border-r-2 border-dark-one/10 bg-white">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer Overlay via Portal */}
      {isMounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-998 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Solid Dark Backdrop */}
            <div
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
              aria-hidden="true"
            />

            {/* Solid White Drawer Panel */}
            <aside className="fixed inset-y-0 left-0 z-999 flex h-full w-72 max-w-[85vw] flex-col bg-white border-r-2 border-dark-one/15 shadow-2xl animate-in slide-in-from-left duration-200">
              {renderNavContent(true)}
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
}

export default AdminSidebar;
