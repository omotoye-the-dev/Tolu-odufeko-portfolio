import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

export type InputState = "default" | "loading" | "success" | "error";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  readonly label?: string;
  readonly hint?: string;
  readonly error?: string;
  readonly success?: string;
  readonly state?: InputState;
  readonly loading?: boolean;
  readonly startIcon?: ReactNode;
  readonly endIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hint,
    error,
    success,
    state = "default",
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    className,
    ...restProps
  },
  ref
) {
  const effectiveState: InputState = error
    ? "error"
    : success
    ? "success"
    : loading
    ? "loading"
    : state;

  const stateBorderClasses: Record<InputState, string> = {
    default:
      "border-dark-one/15 hover:border-dark-one/30 focus:border-accent focus:ring-2 focus:ring-accent/20",
    loading:
      "border-dark-one/20 bg-dark-one/5 cursor-wait focus:border-accent focus:ring-2 focus:ring-accent/20",
    success:
      "border-emerald-500 hover:border-emerald-600 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-dark-one",
    error:
      "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 text-red-900",
  };

  const spinner = (
    <svg
      className="h-4 w-4 animate-spin text-muted"
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

  return (
    <div className="flex w-full flex-col gap-1.5 font-content">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-dark-one/70"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {startIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 flex items-center text-muted"
          >
            {startIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          disabled={disabled || loading}
          aria-invalid={effectiveState === "error"}
          aria-busy={effectiveState === "loading"}
          aria-describedby={
            error
              ? `${id}-error`
              : success
              ? `${id}-success`
              : hint
              ? `${id}-hint`
              : undefined
          }
          className={clsx(
            "w-full rounded-xl border-2 bg-light px-4 py-3 text-sm text-dark-one placeholder:text-faint transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-dark-one/5 disabled:text-faint",
            startIcon && "pl-10",
            (endIcon || loading || effectiveState === "success") && "pr-10",
            stateBorderClasses[effectiveState],
            className
          )}
          {...restProps}
        />

        <div className="pointer-events-none absolute right-3.5 flex items-center gap-1.5">
          {loading && spinner}
          {!loading && effectiveState === "success" && (
            <span aria-hidden="true" className="text-sm font-bold text-emerald-600">
              ✓
            </span>
          )}
          {!loading && effectiveState === "error" && (
            <span aria-hidden="true" className="text-sm font-bold text-red-500">
              ✕
            </span>
          )}
          {!loading && endIcon && endIcon}
        </div>
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!error && success && (
        <p id={`${id}-success`} className="text-xs text-emerald-700">
          {success}
        </p>
      )}

      {!error && !success && hint && (
        <p id={`${id}-hint`} className="text-xs text-faint">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
