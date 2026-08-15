"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import { deleteStorageFile } from "@/lib/supabase/storage";
import { toast } from "@/hooks/useToast";

export interface MultiImageUploadProps {
  readonly defaultValues?: readonly string[];
  readonly name?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly folder?: "projects" | "articles" | "media";
  readonly bucket?: string;
}

export function MultiImageUpload({
  defaultValues = [],
  name = "images",
  label = "Gallery / Additional Images",
  hint = "Upload multiple images for this project or article (PNG, JPG, WebP, max 5MB each).",
  folder = "projects",
  bucket = "portfolio-media",
}: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>([...defaultValues]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>("");
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track URLs uploaded in this session for cleanup if removed before saving
  const newlyUploadedUrlsRef = useRef<Set<string>>(new Set());

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) {
      toast.warning("No Images Selected", {
        description: "Please select valid image files (PNG, JPG, WebP, SVG, AVIF).",
      });
      return;
    }

    startUpload(async () => {
      try {
        const supabase = createClient();
        const uploadedUrls: string[] = [];

        for (const file of fileArray) {
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
          const filePath = `${folder}/${Date.now()}-${cleanFileName}`;

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrlData.publicUrl);
          newlyUploadedUrlsRef.current.add(publicUrlData.publicUrl);
        }

        setImages((prev) => [...prev, ...uploadedUrls]);
        toast.success("Images Uploaded Successfully", {
          description: `Added ${uploadedUrls.length} new image${uploadedUrls.length > 1 ? "s" : ""} to the gallery.`,
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to upload images.";
        toast.error("Upload Error", { description: msg });
      }
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      void uploadFiles(e.target.files);
      e.target.value = "";
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void uploadFiles(e.dataTransfer.files);
    }
  }

  function handleRemoveImage(indexToRemove: number) {
    const targetUrl = images[indexToRemove];
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));

    // If uploaded in this unsaved session, remove it from storage immediately
    if (targetUrl && newlyUploadedUrlsRef.current.has(targetUrl)) {
      const supabase = createClient();
      void deleteStorageFile(supabase, targetUrl, bucket);
      newlyUploadedUrlsRef.current.delete(targetUrl);
    }
  }

  function handleAddManualUrl() {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      toast.warning("Invalid URL", {
        description: "Please enter a valid URL starting with http:// or https://",
      });
      return;
    }

    setImages((prev) => [...prev, trimmed]);
    setManualUrl("");
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden input storing the JSON serialized array of URLs */}
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div className="flex items-center justify-between">
        <label className="font-content text-xs font-semibold uppercase tracking-wider text-dark-one/70">
          {label}
        </label>
        <span className="font-content text-xs text-muted">
          {images.length} {images.length === 1 ? "image" : "images"} in gallery
        </span>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={clsx(
          "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer select-none",
          isDragging
            ? "border-accent bg-accent/15 scale-[0.99]"
            : "border-dark-one/20 bg-light hover:border-accent hover:bg-light/60",
          isUploading && "opacity-60 pointer-events-none cursor-wait"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-dark-one">
          {isUploading ? (
            <svg
              className="h-5 w-5 animate-spin text-accent-strong"
              fill="none"
              viewBox="0 0 24 24"
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
          ) : (
            <span className="text-lg" aria-hidden="true">
              📷
            </span>
          )}
        </div>

        <div>
          <p className="font-content text-xs sm:text-sm font-semibold text-dark-one">
            {isUploading
              ? "Uploading images to storage…"
              : "Click to select or drag & drop multiple images"}
          </p>
          <p className="font-content text-[11px] text-faint mt-0.5">{hint}</p>
        </div>
      </div>

      {/* Manual URL input fallback */}
      <div className="flex gap-2">
        <input
          type="url"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddManualUrl();
            }
          }}
          placeholder="Or paste an image URL and click Add…"
          className="flex-1 rounded-xl border border-dark-one/15 bg-light px-3 py-2 font-content text-xs text-dark-one transition-colors placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          disabled={!manualUrl.trim()}
          className="font-content rounded-xl border border-dark-one/20 bg-white px-3 py-2 text-xs font-semibold text-dark-one hover:bg-dark-one/5 transition-colors disabled:opacity-40 cursor-pointer"
        >
          Add Link
        </button>
      </div>

      {/* Gallery Grid Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
          {images.map((imgUrl, index) => (
            <div
              key={`${imgUrl}-${index}`}
              className="group relative aspect-video w-full overflow-hidden rounded-xl border border-dark-one/15 bg-neutral-100 shadow-2xs"
            >
              <Image
                src={imgUrl}
                alt={`Gallery visual ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/90 p-1.5 text-xs text-dark-one font-semibold hover:bg-white transition-colors"
                  title="View full size"
                >
                  ↗
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="rounded-lg bg-red-600 p-1.5 text-xs text-white font-bold hover:bg-red-700 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
              <span className="absolute bottom-1 left-1.5 rounded bg-black/60 px-1 py-0.5 font-content text-[9px] text-white">
                #{index + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiImageUpload;
