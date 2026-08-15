import Link from "next/link";
import { clsx } from "clsx";

export interface EmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
  readonly onCta?: () => void;
  readonly icon?: string;
  readonly className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  description,
  ctaLabel,
  ctaHref,
  onCta,
  icon = "◇",
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-label={title}
      className={clsx(
        "flex flex-col items-center justify-center py-24 px-6 text-center",
        className
      )}
    >
      {/* Icon glyph */}
      <span
        aria-hidden="true"
        className="text-5xl text-accent-strong select-none"
      >
        {icon}
      </span>

      <h2 className="mt-5 font-header text-2xl text-dark-one">{title}</h2>

      {description && (
        <p className="mt-2 font-content text-sm leading-relaxed text-muted max-w-xs">
          {description}
        </p>
      )}

      {/* CTA — link or button */}
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="mt-6 inline-block font-content text-sm font-semibold text-accent-strong underline underline-offset-4 decoration-accent decoration-2 hover:text-dark-one transition-colors"
        >
          {ctaLabel} →
        </Link>
      )}

      {onCta && ctaLabel && !ctaHref && (
        <button
          type="button"
          onClick={onCta}
          className="mt-6 font-content text-sm font-semibold text-accent-strong underline underline-offset-4 decoration-accent decoration-2 hover:text-dark-one transition-colors cursor-pointer"
        >
          {ctaLabel} →
        </button>
      )}
    </div>
  );
}

export default EmptyState;
