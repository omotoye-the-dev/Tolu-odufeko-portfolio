"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/auth-guard";
import { deleteStorageFile } from "@/lib/supabase/storage";

const GalleryItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().min(1, "Please upload or specify an image URL"),
  category: z.string().min(1, "Category is required"),
  caption: z.string().optional(),
  eventDate: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export async function createGalleryItem(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = GalleryItemSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  const { error } = await supabase.from("gallery_items").insert({
    title: parsed.data.title.trim(),
    image_url: parsed.data.imageUrl.trim(),
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
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  // Fetch current item to check if image was changed
  const { data: currentItem } = await supabase
    .from("gallery_items")
    .select("image_url")
    .eq("id", id)
    .single();

  const oldImageUrl = currentItem?.image_url;
  const newImageUrl = parsed.data.imageUrl.trim();

  const { error } = await supabase
    .from("gallery_items")
    .update({
      title: parsed.data.title.trim(),
      image_url: newImageUrl,
      category: parsed.data.category.trim(),
      caption: parsed.data.caption?.trim() || null,
      event_date: parsed.data.eventDate?.trim() || null,
      sort_order: parsed.data.sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Clean up old image if replaced
  if (oldImageUrl && oldImageUrl !== newImageUrl) {
    await deleteStorageFile(supabase, oldImageUrl);
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const supabase = await createClient();
  await requireAdminAuth(supabase);

  // Fetch image URL to delete from storage
  const { data: item } = await supabase
    .from("gallery_items")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (item?.image_url) {
    await deleteStorageFile(supabase, item.image_url);
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
