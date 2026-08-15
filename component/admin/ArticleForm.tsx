"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/component/UI/Button";
import ImageUpload from "@/component/admin/ImageUpload";
import MultiImageUpload from "@/component/admin/MultiImageUpload";
import { toast } from "@/hooks/useToast";
import type { Article } from "@/lib/data";

interface ArticleFormProps {
  readonly article?: Article;
  readonly action: (formData: FormData) => Promise<void>;
  readonly cancelHref: string;
}

export function ArticleForm({ article, action, cancelHref }: ArticleFormProps) {
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
          article ? "Article Updated Successfully!" : "Article Published Live!",
          {
            description: article
              ? `Edits to "${article.title}" have been saved and updated.`
              : "Your article is now published and accessible to readers.",
          }
        );
        router.push(cancelHref);
        router.refresh();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMsg);
        toast.error("Unable to Save Article", {
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
      {/* Slug + Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className={labelClass}>Slug *</label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={article?.slug ?? ""}
            placeholder="my-article-slug"
            className={inputClass}
          />
          <p className={hintClass}>URL-safe, lowercase, hyphens only</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className={labelClass}>Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={article?.title ?? ""}
            placeholder="Article Title"
            className={inputClass}
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="excerpt" className={labelClass}>Excerpt *</label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          defaultValue={article?.excerpt ?? ""}
          placeholder="One or two lines teasing the article content."
          className={inputClass}
        />
      </div>

      {/* 1. Main Banner Image */}
      <ImageUpload
        defaultValue={article?.image ?? ""}
        name="image"
        folder="articles"
        label="Main Banner / Cover Image *"
        required
      />

      {/* 2. Gallery / Additional Visuals */}
      <MultiImageUpload
        defaultValues={article?.images ?? []}
        name="images"
        folder="articles"
        label="Article Visuals &amp; Diagrams Gallery"
        hint="Upload multiple charts, photos, or diagrams referenced in this article."
      />

      {/* Date + Read time + Link */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className={labelClass}>Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={article?.date ?? ""}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="readTime" className={labelClass}>Read Time *</label>
          <input
            id="readTime"
            name="readTime"
            type="text"
            required
            defaultValue={article?.readTime ?? ""}
            placeholder="7 min read"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="link" className={labelClass}>External Link</label>
          <input
            id="link"
            name="link"
            type="url"
            defaultValue={article?.link ?? ""}
            placeholder="https://…"
            className={inputClass}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className={labelClass}>Tags *</label>
        <input
          id="tags"
          name="tags"
          type="text"
          required
          defaultValue={article?.tags.join(", ") ?? ""}
          placeholder="Engineering, Signal Processing"
          className={inputClass}
        />
        <p className={hintClass}>Comma-separated</p>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className={labelClass}>Body *</label>
        <textarea
          id="body"
          name="body"
          required
          rows={10}
          defaultValue={article?.body.join("\n\n") ?? ""}
          placeholder="Write each paragraph here. Blank lines between paragraphs."
          className={inputClass}
        />
        <p className={hintClass}>
          Each paragraph separated by a blank line will become its own block.
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
          {article ? "Update Article" : "Publish Article"}
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

export default ArticleForm;
