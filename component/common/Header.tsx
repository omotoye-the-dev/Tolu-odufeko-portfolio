"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface NavItem {
  readonly label: string;
  readonly href: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Articles", href: "/articles" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
] as const;

export function Header() {
  const currentPath = usePathname();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleToggleMenu = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled || isMobileMenuOpen
          ? "bg-light shadow-xs border-b border-muted/15 py-3"
          : "bg-transparent py-4 border-b border-transparent"
      )}
      style={{ backgroundColor: isScrolled || isMobileMenuOpen ? "#fffff1" : undefined }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16">
        <div>
          <Link
            className="flex items-center justify-center gap-2 group"
            href="/"
            onClick={handleCloseMenu}
          >
            <Image
              src="/Logo.png"
              alt="Toluwanimi Odufeko Logo"
              width={50}
              height={45}
              priority
              style={{ width: "auto", height: "auto" }}
              className="transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-header text-lg sm:text-xl font-normal tracking-wide text-dark-one">
              Toluwanimi Odufeko
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="font-content flex items-center gap-6 lg:gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? currentPath === "/"
                  : currentPath === item.href ||
                    currentPath.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(
                      "py-1 text-sm transition-colors duration-150 relative",
                      isActive
                        ? "text-accent-strong font-bold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-accent"
                        : "text-dark-one hover:text-accent-strong font-medium"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={handleToggleMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-one/20 bg-light text-dark-one transition-colors hover:border-accent hover:text-accent-strong cursor-pointer active:scale-95"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
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
            ) : (
              <svg
                className="h-6 w-6"
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
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown / Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-14.25 sm:top-16.25 bottom-0 z-40 flex flex-col bg-light border-t border-muted/15 px-6 py-8 md:hidden overflow-y-auto shadow-2xl animate-in fade-in duration-150"
          style={{ backgroundColor: "#fffff1" }}
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            <ul className="font-content flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? currentPath === "/"
                    : currentPath === item.href ||
                      currentPath.startsWith(`${item.href}/`);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleCloseMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={clsx(
                        "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-colors",
                        isActive
                          ? "bg-accent/20 text-dark-one border-l-4 border-accent font-bold"
                          : "text-dark-one hover:bg-black/5 hover:text-accent-strong"
                      )}
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true" className="text-xs text-muted">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
