"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";
import { ConfirmModal } from "@/component/UI/ConfirmModal";

export interface AdminDeleteButtonProps {
  readonly itemId: string;
  readonly itemTitle: string;
  readonly itemType: "project" | "article" | "item" | "photo";
  readonly onDelete: (id: string) => Promise<void>;
}

export function AdminDeleteButton({
  itemId,
  itemTitle,
  itemType,
  onDelete,
}: AdminDeleteButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirmDelete() {
    startTransition(async () => {
      try {
        await onDelete(itemId);
        setShowModal(false);
        toast.success(
          `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Deleted`,
          {
            description: `"${itemTitle}" has been permanently removed.`,
          }
        );
        router.refresh();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while deleting.";
        toast.error("Deletion Failed", {
          description: errorMsg,
        });
      }
    });
  }

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setShowModal(true)}
        className="font-content text-xs text-muted hover:text-red-600 transition-colors enabled:cursor-pointer disabled:opacity-50"
        aria-label={`Delete ${itemTitle}`}
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>

      <ConfirmModal
        isOpen={showModal}
        isPending={isPending}
        title={`Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}
        description={`Are you sure you want to permanently delete "${itemTitle}"? This action cannot be undone.`}
        confirmLabel="Permanently Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!isPending) setShowModal(false);
        }}
      />
    </>
  );
}

export default AdminDeleteButton;
