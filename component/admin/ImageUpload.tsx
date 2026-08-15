"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import { deleteStorageFile } from "@/lib/supabase/storage";
import { toast } from "@/hooks/useToast";

export interface ImageUploadProps {
  readonly defaultValue?: string;
  readonly name?: string;
  readonly folder?: string;
  readonly bucket?: string;
  readonly label?: string;
  readonly required?: boolean;
  readonly accept?: string;
  readonly hint?: string;
}

export function ImageUpload({
  defaultValue = "",
  name = "image",
  folder = "uploads",
  bucket = "portfolio-media",
  label = "Banner / Media File *",
  required = false,
  accept = "image/*",
  hint = "PNG, JPG, WebP, SVG, or other media files",
}: ImageUploadProps) {
  const [url, setUrl] = useState<string>(defaultValue);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newlyUploadedUrlsRef = useRef<Set<string>>(new Set());

  function isImage(link: string): boolean {
    if (!link) return false;
    const clean = link.split("?")[0].toLowerCase();
    return (
      clean.endsWith(".png") ||
      clean.endsWith(".jpg") ||
      clean.endsWith(".jpeg") ||
      clean.endsWith(".webp") ||
      clean.endsWith(".gif") ||
      clean.endsWith(".svg") ||
      clean.endsWith(".avif") ||
      clean.includes("images.unsplash.com") ||
      clean.includes("/storage/v1/object/public/")
    );
  }

  async function uploadFile(file: File) {
    startUpload(async () => {
      try {
        const supabase = createClient();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `${folder}/${Date.now()}-${cleanFileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        const newUrl = publicUrlData.publicUrl;

        // If user already uploaded a file in this session, clean up the previous one
        if (url && newlyUploadedUrlsRef.current.has(url)) {
          void deleteStorageFile(supabase, url, bucket);
          newlyUploadedUrlsRef.current.delete(url);
        }

        newlyUploadedUrlsRef.current.add(newUrl);
        setUrl(newUrl);
        toast.success("File Uploaded Successfully", {
          description: `Uploaded "${file.name}" to ${bucket}.`,
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to upload file to storage.";
        toast.error("Upload Failed", { description: msg });
      }
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void uploadFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  }

  function handleClear() {
    const currentUrl = url;
    setUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // If this was freshly uploaded in the current unsaved session, clean it up from storage
    if (currentUrl && newlyUploadedUrlsRef.current.has(currentUrl)) {
      const supabase = createClient();
      void deleteStorageFile(supabase, currentUrl, bucket);
      newlyUploadedUrlsRef.current.delete(currentUrl);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-content text-xs font-semibold uppercase tracking-wider text-dark-one/70">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "upload" ? "url" : "upload"))}
          className="font-content text-[11px] text-accent-strong hover:text-dark-one underline underline-offset-2 transition-colors cursor-pointer"
        >
          {mode === "upload" ? "Switch to URL input" : "Switch to File Upload"}
        </button>
      </div>

      {/* Hidden input to ensure FormData gets the url */}
      <input type="hidden" name={name} value={url} required={required} />

      {mode === "url" ? (
        /* Manual URL Mode */
        <div className="flex flex-col gap-1.5">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border-2 border-dark-one/15 bg-light px-4 py-3 font-content text-sm text-dark-one transition-colors placeholder:text-faint focus:border-accent focus:outline-none "
          />
          <p className="font-content text-xs text-faint">
            Enter a direct URL or switch back to upload a file directly.
          </p>
        </div>
      ) : url ? (
        /* Preview Card */
        <div className="relative overflow-hidden rounded-xl border-2 border-dark-one/15 bg-white p-3 shadow-xs">
          {isImage(url) ? (
            <div className="relative aspect-video max-h-60 w-full overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={url}
                alt="Media preview"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-light rounded-lg">
              <span className="text-2xl" aria-hidden="true">
                📄
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-content text-xs font-semibold text-dark-one truncate">
                  {url.split("/").pop()}
                </p>
                <p className="font-content text-[10px] text-muted truncate">
                  {url}
                </p>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-dark-one/10 pt-2">
            <span className="font-content text-[11px] text-muted truncate max-w-xs">
              {url}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="font-content text-xs font-semibold text-accent-strong hover:text-dark-one transition-colors cursor-pointer"
              >
                Replace
              </button>
              <span className="text-dark-one/20" aria-hidden="true">
                |
              </span>
              <button
                type="button"
                onClick={handleClear}
                disabled={isUploading}
                className="font-content text-xs text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-accent bg-accent/10 scale-[0.99]"
              : "border-dark-one/20 bg-light hover:border-accent hover:bg-white",
            isUploading && "opacity-60 pointer-events-none"
          )}
        >
          <div
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-full text-xl transition-colors",
              isDragging ? "bg-accent text-dark-one" : "bg-dark-one/5 text-dark-one"
            )}
            aria-hidden="true"
          >
            {isUploading ? "⏳" : "⬆"}
          </div>

          <div>
            <p className="font-content text-sm font-semibold text-dark-one">
              {isUploading
                ? "Uploading to Supabase Storage…"
                : isDragging
                ? "Drop file here to upload"
                : "Click or drag & drop file to upload"}
            </p>
            <p className="font-content text-xs text-muted mt-1">{hint}</p>
          </div>
        </div>
      )}

      {/* Native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}

export default ImageUpload;
