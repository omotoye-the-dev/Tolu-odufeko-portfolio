"use client";

import { useEffect, useCallback } from "react";

export interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly isPending?: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isPending = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        onClose();
      }
    },
    [isPending, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
      onClick={() => {
        if (!isPending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-dark-one/15 bg-white p-5 sm:p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon Badge */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 mb-4">
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* Modal Title & Message */}
        <h3
          id="confirm-modal-title"
          className="font-header text-xl sm:text-2xl font-bold text-dark-one tracking-tight"
        >
          {title}
        </h3>
        <p
          id="confirm-modal-desc"
          className="font-content text-xs sm:text-sm text-muted leading-relaxed mt-2"
        >
          {description}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="w-full sm:w-auto font-content text-xs sm:text-sm font-semibold rounded-xl border-2 border-dark-one/15 bg-white px-4 py-2.5 text-dark-one hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer text-center"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="w-full sm:w-auto font-content text-xs sm:text-sm font-bold rounded-xl border-2 border-transparent bg-red-600 px-5 py-2.5 text-white hover:bg-red-700 transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            {isPending ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                <span>Deleting…</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmModal;
