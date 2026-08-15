"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/component/UI/Button";
import ImageUpload from "@/component/admin/ImageUpload";
import MultiImageUpload from "@/component/admin/MultiImageUpload";
import { toast } from "@/hooks/useToast";
import type { Project } from "@/lib/data";

interface ProjectFormProps {
  readonly project?: Project;
  readonly action: (formData: FormData) => Promise<void>;
  readonly cancelHref: string;
}

export function ProjectForm({ project, action, cancelHref }: ProjectFormProps) {
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
          project ? "Project Changes Saved!" : "Project Published Successfully!",
          {
            description: project
              ? `Updates to "${project.title}" are now live on your portfolio.`
              : "Your new project is now visible on the portfolio page.",
          }
        );
        router.push(cancelHref);
        router.refresh();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMsg);
        toast.error("Unable to Save Project", {
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
            defaultValue={project?.slug ?? ""}
            placeholder="my-project-slug"
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
            defaultValue={project?.title ?? ""}
            placeholder="Project Title"
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
          defaultValue={project?.excerpt ?? ""}
          placeholder="One-sentence project summary shown on cards."
          className={inputClass}
        />
      </div>

      {/* 1. Main Banner Image Upload */}
      <ImageUpload
        defaultValue={project?.image ?? ""}
        name="image"
        folder="projects"
        label="Main Banner / Cover Image *"
        required
      />

      {/* 2. Gallery / Additional Visuals Multi-Image Upload */}
      <MultiImageUpload
        defaultValues={project?.images ?? []}
        name="images"
        folder="projects"
        label="Project Gallery / Additional Visuals"
        hint="Upload multiple screenshots, diagrams, or photos tied to this project."
      />

      {/* Date + Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className={labelClass}>Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={project?.date ?? ""}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="link" className={labelClass}>External Link</label>
          <input
            id="link"
            name="link"
            type="url"
            defaultValue={project?.link ?? ""}
            placeholder="https://github.com/…"
            className={inputClass}
          />
        </div>
      </div>

      {/* Categories + Tech Stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="categories" className={labelClass}>Categories *</label>
          <input
            id="categories"
            name="categories"
            type="text"
            required
            defaultValue={project?.categories.join(", ") ?? ""}
            placeholder="Engineering, Software"
            className={inputClass}
          />
          <p className={hintClass}>Comma-separated</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="techStack" className={labelClass}>Tech Stack *</label>
          <input
            id="techStack"
            name="techStack"
            type="text"
            required
            defaultValue={project?.techStack.join(", ") ?? ""}
            placeholder="TypeScript, React, PostgreSQL"
            className={inputClass}
          />
          <p className={hintClass}>Comma-separated</p>
        </div>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={project?.featured ?? false}
          className="h-4 w-4 rounded border-dark-one/30 accent-accent cursor-pointer"
        />
        <label htmlFor="featured" className="font-content text-sm text-dark-one cursor-pointer">
          Featured project (shown on homepage)
        </label>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className={labelClass}>Body *</label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          defaultValue={project?.body.join("\n\n") ?? ""}
          placeholder="Write each paragraph on its own line. Leave a blank line between paragraphs."
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
          {project ? "Update Project" : "Save Project"}
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

export default ProjectForm;
