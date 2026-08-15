"use client";

import { clsx } from "clsx";
import { useToast, type ToastItem, type ToastType } from "@/hooks/useToast";

const TYPE_CONFIG: Record<
  ToastType,
  {
    readonly icon: string;
    readonly borderColor: string;
    readonly iconBg: string;
    readonly iconColor: string;
  }
> = {
  success: {
    icon: "✓",
    borderColor: "border-accent",
    iconBg: "bg-accent",
    iconColor: "text-dark-one",
  },
  error: {
    icon: "✕",
    borderColor: "border-red-400",
    iconBg: "bg-red-100",
    iconColor: "text-red-700",
  },
  warning: {
    icon: "!",
    borderColor: "border-amber-400",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-800",
  },
  info: {
    icon: "i",
    borderColor: "border-dark-one/20",
    iconBg: "bg-dark-one/10",
    iconColor: "text-dark-one",
  },
};

export interface ToastProps {
  readonly toast: ToastItem;
  readonly onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const config = TYPE_CONFIG[toast.type];

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live="polite"
      className={clsx(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3.5 rounded-2xl border-2 bg-white p-4 shadow-xl transition-all duration-300",
        config.borderColor,
      )}
    >
      {/* Status Icon */}
      <span
        aria-hidden="true"
        className={clsx(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-content text-xs font-bold",
          config.iconBg,
          config.iconColor,
        )}
      >
        {config.icon}
      </span>

      {/* Message */}
      <div className="flex-1 pt-0.5">
        <h4 className="font-header text-sm font-bold text-dark-one leading-tight">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="font-content mt-1 text-xs text-muted leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-faint hover:bg-dark-one/5 hover:text-dark-one transition-colors cursor-pointer"
      >
        <span aria-hidden="true" className="text-sm">
          ✕
        </span>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex max-w-md flex-col gap-2.5"
    >
      {toasts.map((item) => (
        <Toast key={item.id} toast={item} onDismiss={dismiss} />
      ))}
    </div>
  );
}

export default ToastContainer;
