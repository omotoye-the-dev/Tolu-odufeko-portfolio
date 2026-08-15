"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";

export interface AdminDeleteButtonProps {
  readonly itemId: string;
  readonly itemTitle: string;
  readonly itemType: "project" | "article" | "item";
  readonly onDelete: (id: string) => Promise<void>;
}

export function AdminDeleteButton({
  itemId,
  itemTitle,
  itemType,
  onDelete,
}: AdminDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const isConfirmed = window.confirm(
      `Are you sure you want to permanently delete "${itemTitle}"?`
    );

    if (!isConfirmed) return;

    startTransition(async () => {
      try {
        await onDelete(itemId);
        toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Deleted`, {
          description: `"${itemTitle}" has been permanently removed.`,
        });
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
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="font-content text-xs text-muted hover:text-red-600 transition-colors enabled:cursor-pointer disabled:opacity-50"
      aria-label={`Delete ${itemTitle}`}
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}

export default AdminDeleteButton;
