"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/component/UI/Button";
import { toast } from "@/hooks/useToast";
import type { NowItem } from "@/lib/data";

interface NowItemFormProps {
  readonly item?: NowItem;
  readonly action: (formData: FormData) => Promise<void>;
  readonly cancelHref: string;
}

export function NowItemForm({ item, action, cancelHref }: NowItemFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      try {
        await action(formData);
        toast.success(
          item ? "Focus Item Updated!" : "Focus Item Added to Timeline!",
          {
            description: item
              ? `"${item.title}" status and notes have been refreshed.`
              : "Your new focus item is now active on the Now page.",
          }
        );
        router.push(cancelHref);
        router.refresh();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMsg);
        toast.error("Unable to Save Item", {
          description: errorMsg,
        });
      }
    });
  }

  const inputClass =
    "font-content w-full rounded-xl border-2 border-dark-one/15 bg-light px-4 py-3 text-sm text-dark-one placeholder:text-faint transition-colors focus:border-accent focus:outline-none";
  const labelClass =
    "font-content text-xs font-semibold uppercase tracking-wider text-dark-one/70";

  const STATUS_OPTIONS = ["In progress", "Drafting", "Active", "Current", "Completed", "Paused"];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClass}>Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={item?.title ?? ""}
          placeholder="What are you working on?"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelClass}>Description *</label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={item?.description ?? ""}
          placeholder="A brief description of what this involves."
          className={inputClass}
        />
      </div>

      {/* Date + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className={labelClass}>Date label *</label>
          <input
            id="date"
            name="date"
            type="text"
            required
            defaultValue={item?.date ?? ""}
            placeholder="Since June 2026"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className={labelClass}>Status *</label>
          <select
            id="status"
            name="status"
            required
            defaultValue={item?.status ?? "In progress"}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort order */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sortOrder" className={labelClass}>Sort Order</label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={item?.sortOrder ?? 0}
          className={inputClass}
        />
        <p className="font-content text-xs text-faint mt-1">
          Lower numbers appear first on the Now page.
        </p>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="font-content text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl px-4 py-3"
        >
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          loading={isPending}
          disabled={isPending}
          variant="primary"
        >
          {item ? "Update Item" : "Save Item"}
        </Button>
        <Link
          href={cancelHref}
          className="font-content text-sm font-semibold text-muted hover:text-dark-one transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default NowItemForm;
