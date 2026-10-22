"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/component/UI/Button";
import ImageUpload from "@/component/admin/ImageUpload";
import MultiImageUpload from "@/component/admin/MultiImageUpload";
import { toast } from "@/hooks/useToast";
import type { NowItem } from "@/types";

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
              ? `"${item.title}" status, visuals, and links have been refreshed.`
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
  const hintClass = "font-content text-xs text-faint mt-1";

  const STATUS_OPTIONS = [
    "In progress",
    "Reading",
    "Watching",
    "Attending",
    "Drafting",
    "Active",
    "Current",
    "Completed",
    "Paused",
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClass}>
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={item?.title ?? ""}
          placeholder="e.g. Reading 'Designing Data-Intensive Applications' or Attending Energy Summit"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelClass}>
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={item?.description ?? ""}
          placeholder="Brief takeaways, key ideas, or notes about what this involves."
          className={inputClass}
        />
      </div>

      {/* Date + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className={labelClass}>
            Date / Timeframe Label *
          </label>
          <input
            id="date"
            name="date"
            type="text"
            required
            defaultValue={item?.date ?? ""}
            placeholder="e.g. October 2026, or Since June 2026"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className={labelClass}>
            Status Tag *
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={item?.status ?? "In progress"}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Visual & Additional Photos */}
      <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-6 shadow-xs flex flex-col gap-5">
        <ImageUpload
          defaultValue={item?.image ?? ""}
          name="image"
          folder="now"
          label="Primary Photo / Cover (Optional)"
          hint="Upload a book cover, video preview, certificate, or event photo (PNG, JPG, WebP, max 5MB)."
        />

        <div className="border-t border-dark-one/10 pt-5">
          <MultiImageUpload
            defaultValues={item?.images ?? []}
            name="images"
            folder="now"
            label="Additional Event / Program Photos (Optional)"
            hint="Upload additional photos from this seminar, workshop, or reading session."
          />
        </div>
      </div>

      {/* Resource Link & Button Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="link" className={labelClass}>
            Resource Link (Optional)
          </label>
          <input
            id="link"
            name="link"
            type="url"
            defaultValue={item?.link ?? ""}
            placeholder="https://amazon.com/..., https://youtube.com/..., or seminar URL"
            className={inputClass}
          />
          <p className={hintClass}>Link to where people can access the book, talk, or program.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="linkText" className={labelClass}>
            Button / Link Label (Optional)
          </label>
          <input
            id="linkText"
            name="linkText"
            type="text"
            defaultValue={item?.linkText ?? ""}
            placeholder="e.g. View Book on Goodreads, Watch Keynote, Event Recap"
            className={inputClass}
          />
          <p className={hintClass}>Defaults to “Explore Resource →” if left empty.</p>
        </div>
      </div>

      {/* Sort order */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sortOrder" className={labelClass}>
          Sort Order
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={item?.sortOrder ?? 0}
          className={inputClass}
        />
        <p className={hintClass}>
          Lower numbers appear first on the Now page (0 is highest priority).
        </p>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="font-content text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl px-4 py-3 whitespace-pre-line"
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
          className="font-content text-sm font-semibold text-muted hover:text-dark-one transition-colors px-4 py-2"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default NowItemForm;
