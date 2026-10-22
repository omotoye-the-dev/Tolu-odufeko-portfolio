"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/auth-guard";
import { deleteStorageFile } from "@/lib/supabase/storage";
import { formatZodError } from "@/lib/validation";

const GalleryItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  imageUrl: z.string().trim().min(1, "Please upload or specify a cover image"),
  images: z.string().optional(),
  category: z.string().trim().min(1, "Category is required"),
  caption: z.string().optional(),
  eventDate: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

function parseImagesField(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((u) => typeof u === "string" && u.trim().length > 0);
    }
  } catch {
    return [];
  }
  return [];
}

export async function createGalleryItem(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = GalleryItemSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  const images = parseImagesField(parsed.data.images);

  const { error } = await supabase.from("gallery_items").insert({
    title: parsed.data.title.trim(),
    image_url: parsed.data.imageUrl.trim(),
    images,
    category: parsed.data.category.trim(),
    caption: parsed.data.caption?.trim() || null,
    event_date: parsed.data.eventDate?.trim() || null,
    sort_order: parsed.data.sortOrder,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function updateGalleryItem(
  id: string,
  formData: FormData
): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = GalleryItemSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  // Fetch current item to check if image or additional images were changed
  const { data: currentItem } = await supabase
    .from("gallery_items")
    .select("image_url, images")
    .eq("id", id)
    .single();

  const oldImageUrl = currentItem?.image_url;
  const oldImages: string[] = Array.isArray(currentItem?.images)
    ? currentItem.images
    : [];
  const newImageUrl = parsed.data.imageUrl.trim();
  const newImages = parseImagesField(parsed.data.images);

  const { error } = await supabase
    .from("gallery_items")
    .update({
      title: parsed.data.title.trim(),
      image_url: newImageUrl,
      images: newImages,
      category: parsed.data.category.trim(),
      caption: parsed.data.caption?.trim() || null,
      event_date: parsed.data.eventDate?.trim() || null,
      sort_order: parsed.data.sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Clean up old cover image if replaced
  if (oldImageUrl && oldImageUrl !== newImageUrl) {
    await deleteStorageFile(supabase, oldImageUrl);
  }

  // Clean up any removed sub-images
  const removedImages = oldImages.filter((img) => !newImages.includes(img));
  for (const removed of removedImages) {
    await deleteStorageFile(supabase, removed);
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const supabase = await createClient();
  await requireAdminAuth(supabase);

  // Fetch image URLs to delete from storage
  const { data: item } = await supabase
    .from("gallery_items")
    .select("image_url, images")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (item?.image_url) {
    await deleteStorageFile(supabase, item.image_url);
  }

  if (Array.isArray(item?.images)) {
    for (const extraImg of item.images) {
      await deleteStorageFile(supabase, extraImg);
    }
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
