import type { SupabaseClient } from "@supabase/supabase-js";

export const DEFAULT_STORAGE_BUCKET = "portfolio-media";

/**
 * Extracts the relative storage file path from a full public Supabase Storage URL.
 * Example:
 *   "https://xyz.supabase.co/storage/v1/object/public/portfolio-media/projects/123.png"
 *   -> "projects/123.png"
 */
export function extractStoragePath(
  url: string,
  bucket: string = DEFAULT_STORAGE_BUCKET
): string | null {
  if (!url || typeof url !== "string") return null;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const path = url.slice(markerIndex + marker.length).split("?")[0];
  return path ? decodeURIComponent(path) : null;
}

/**
 * Deletes a file from Supabase Storage if the URL belongs to the specified bucket.
 * Silently handles external non-Supabase URLs and logs any storage errors without throwing.
 */
export async function deleteStorageFile(
  supabase: SupabaseClient,
  url: string | null | undefined,
  bucket: string = DEFAULT_STORAGE_BUCKET
): Promise<void> {
  if (!url) return;

  const path = extractStoragePath(url, bucket);
  if (!path) return;

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.warn(`[Storage] Failed to delete file "${path}":`, error.message);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[Storage] Unexpected error deleting file "${path}":`, message);
  }
}
