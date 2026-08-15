import type { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "outline" | "danger" | "success" | "ghost";
export type ButtonState = "default" | "loading" | "success" | "error";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly state?: ButtonState;
  readonly size?: ButtonSize;
  readonly href?: string;
  readonly target?: string;
  readonly rel?: string;
  readonly type?: "button" | "submit" | "reset";
  readonly onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly className?: string;
}

const BASE_STYLES =
  "inline-flex items-center justify-center gap-2 rounded-xl text-center font-content font-bold tracking-tighter transition-all duration-200 ease-in-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.98]";

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-3 text-sm sm:text-base",
  lg: "px-7 py-4 text-base sm:text-lg",
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-dark-one border-2 border-transparent hover:bg-accent-strong hover:border-accent-strong hover:shadow-xs",
  outline:
    "border-2 border-accent-strong bg-transparent text-accent-strong hover:border-accent hover:bg-accent hover:text-dark-one",
  danger:
    "bg-red-600 text-white border-2 border-transparent hover:bg-red-700 hover:shadow-xs focus-visible:ring-red-500",
  success:
    "bg-emerald-600 text-white border-2 border-transparent hover:bg-emerald-700 hover:shadow-xs focus-visible:ring-emerald-500",
  ghost:
    "bg-transparent text-dark-one border-2 border-transparent hover:bg-dark-one/5 hover:text-dark-one",
};

const STATE_STYLES: Record<ButtonState, string> = {
  default: "",
  loading: "opacity-80 cursor-wait pointer-events-none",
  success: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700",
  error: "bg-red-600 text-white border-red-600 hover:bg-red-700",
};

export function Button({
  children,
  variant = "primary",
  state = "default",
  size = "md",
  href,
  target,
  rel,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const effectiveState: ButtonState = loading ? "loading" : state;
  const isEffectivelyDisabled = disabled || effectiveState === "loading";

  const combinedClassName = clsx(
    BASE_STYLES,
    SIZE_STYLES[size],
    VARIANT_STYLES[variant],
    STATE_STYLES[effectiveState],
    isEffectivelyDisabled &&
      "opacity-50 cursor-not-allowed pointer-events-none active:scale-100 shadow-none",
    className
  );

  const spinner = (
    <svg
      className="h-4 w-4 animate-spin text-current"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const checkmarkIcon = (
    <span aria-hidden="true" className="text-base font-bold">
      ✓
    </span>
  );

  const errorIcon = (
    <span aria-hidden="true" className="text-base font-bold">
      ✕
    </span>
  );

  const content = (
    <>
      {effectiveState === "loading" && spinner}
      {effectiveState === "success" && checkmarkIcon}
      {effectiveState === "error" && errorIcon}
      <span>{children}</span>
    </>
  );

  if (href && !isEffectivelyDisabled) {
    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isExternal) {
      return (
        <a
          href={href}
          target={target ?? "_blank"}
          rel={rel ?? "noopener noreferrer"}
          onClick={onClick}
          className={combinedClassName}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={combinedClassName}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isEffectivelyDisabled}
      aria-busy={effectiveState === "loading"}
      aria-disabled={isEffectivelyDisabled}
      onClick={onClick}
      className={combinedClassName}
    >
      {content}
    </button>
  );
}

export default Button;
