"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  readonly id: string;
  readonly type: ToastType;
  readonly title: string;
  readonly description?: string;
  readonly duration?: number;
}

export type ToastOptions = {
  readonly description?: string;
  readonly duration?: number;
};

type ToastListener = (toasts: readonly ToastItem[]) => void;

let memoryToasts: readonly ToastItem[] = [];
const listeners: Set<ToastListener> = new Set();

function emitChange(): void {
  for (const listener of listeners) {
    listener(memoryToasts);
  }
}

export function dismissToast(id: string): void {
  memoryToasts = memoryToasts.filter((t) => t.id !== id);
  emitChange();
}

export function showToast(
  type: ToastType,
  title: string,
  options?: ToastOptions
): string {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const duration = options?.duration ?? 4000;

  const newToast: ToastItem = {
    id,
    type,
    title,
    description: options?.description,
    duration,
  };

  memoryToasts = [...memoryToasts, newToast];
  emitChange();

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

export const toast = {
  success: (title: string, options?: ToastOptions) =>
    showToast("success", title, options),
  error: (title: string, options?: ToastOptions) =>
    showToast("error", title, options),
  info: (title: string, options?: ToastOptions) =>
    showToast("info", title, options),
  warning: (title: string, options?: ToastOptions) =>
    showToast("warning", title, options),
  dismiss: (id: string) => dismissToast(id),
};

export function useToast(): {
  readonly toasts: readonly ToastItem[];
  readonly toast: typeof toast;
  readonly dismiss: (id: string) => void;
} {
  const [toasts, setToasts] = useState<readonly ToastItem[]>(memoryToasts);

  useEffect(() => {
    const handleToastsChange: ToastListener = (updated) => {
      setToasts(updated);
    };

    listeners.add(handleToastsChange);
    return () => {
      listeners.delete(handleToastsChange);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: dismissToast,
  };
}

export default useToast;
