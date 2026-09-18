"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/component/UI/Button";
import ImageUpload from "@/component/admin/ImageUpload";
import { toast } from "@/hooks/useToast";
import type { GalleryItem } from "@/types";

export interface GalleryItemFormProps {
  readonly item?: GalleryItem;
  readonly action: (formData: FormData) => Promise<void>;
  readonly cancelHref: string;
}

const CATEGORY_SUGGESTIONS = [
  "Engineering",
  "Speaking & Events",
  "Donate Drive",
  "Field Work",
  "Personal",
] as const;

export function GalleryItemForm({
  item,
  action,
  cancelHref,
}: GalleryItemFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    const imageVal = formData.get("imageUrl") as string | null;
    if (!imageVal || !imageVal.trim()) {
      setError("Please upload an image for the gallery item.");
      return;
    }

    startTransition(async () => {
      try {
        await action(formData);
        toast.success(
          item ? "Gallery Photo Updated!" : "Photo Added to Gallery!",
          {
            description: item
              ? `"${item.title}" details have been updated.`
              : "Your photo is now live in your public portfolio gallery.",
          }
        );
        router.push(cancelHref);
        router.refresh();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMsg);
        toast.error("Unable to Save Photo", {
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Photo Upload */}
      <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-6 shadow-xs">
        <ImageUpload
          defaultValue={item?.imageUrl ?? ""}
          name="imageUrl"
          folder="gallery"
          label="Gallery Photo *"
          accept="image/png,image/jpeg,image/webp,image/avif"
          hint="PNG, JPG, WebP, or AVIF image (max 5MB)"
        />
      </div>

      {/* Title & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className={labelClass}>
            Photo Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={item?.title ?? ""}
            placeholder="e.g. Energy Transition Panel Keynote"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className={labelClass}>
            Category *
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            list="category-suggestions"
            defaultValue={item?.category ?? "Engineering"}
            placeholder="Select or type a category"
            className={inputClass}
          />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          <p className={hintClass}>Used for filter tabs on the gallery page.</p>
        </div>
      </div>

      {/* Event Date & Sort Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="eventDate" className={labelClass}>
            Event Date / Year (Optional)
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="text"
            defaultValue={item?.eventDate ?? ""}
            placeholder="e.g. October 2025, or 2025-10-15"
            className={inputClass}
          />
          <p className={hintClass}>Displayed as a subtle badge on the photo card.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sortOrder" className={labelClass}>
            Sort Order (Display Priority)
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={item?.sortOrder ?? 0}
            className={inputClass}
          />
          <p className={hintClass}>Lower numbers appear first (0 is highest priority).</p>
        </div>
      </div>

      {/* Caption / Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="caption" className={labelClass}>
          Caption &amp; Context (Optional)
        </label>
        <textarea
          id="caption"
          name="caption"
          rows={3}
          defaultValue={item?.caption ?? ""}
          placeholder="Brief note or background about this moment…"
          className="font-content w-full rounded-xl border-2 border-dark-one/15 bg-light px-4 py-3 text-sm text-dark-one  transition-colors focus:outline-none min-h-22.5 resize-y"
        />
        <p className={hintClass}>Shown in the high-resolution lightbox modal when viewers click the photo.</p>
      </div>

      {/* Error display */}
      {error && (
        <p
          role="alert"
          className="font-content text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl px-4 py-3"
        >
          {error}
        </p>
      )}

      {/* Form actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          loading={isPending}
          disabled={isPending}
          variant="primary"
          className="px-8"
        >
          {isPending ? "Saving Photo…" : item ? "Save Changes" : "Add to Gallery"}
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

export default GalleryItemForm;
