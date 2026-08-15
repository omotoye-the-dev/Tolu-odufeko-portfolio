import { clsx } from "clsx";

export interface ErrorStateProps {
  readonly title?: string;
  readonly message?: string;
  readonly onRetry?: () => void;
  readonly className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={clsx(
        "flex flex-col items-center justify-center py-24 px-6 text-center",
        className
      )}
    >
      {/* Error glyph */}
      <span
        aria-hidden="true"
        className="text-5xl select-none text-red-400"
      >
        ✕
      </span>

      <h2 className="mt-5 font-header text-2xl text-dark-one">{title}</h2>

      <p className="mt-2 font-content text-sm leading-relaxed text-muted max-w-xs">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 font-content text-sm font-bold bg-accent text-dark-one px-5 py-2.5 rounded-xl hover:bg-accent-strong transition-colors cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
