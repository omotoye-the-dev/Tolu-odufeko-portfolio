"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/auth-guard";
import { deleteStorageFile } from "@/lib/supabase/storage";
import { formatZodError } from "@/lib/validation";

const NowItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  date: z.string().trim().min(1, "Date is required"),
  status: z.string().trim().min(1, "Status is required"),
  image: z.string().optional(),
  images: z.string().optional(),
  link: z.string().trim().url("Link must be a valid URL").or(z.literal("")).optional(),
  linkText: z.string().optional(),
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

export async function createNowItem(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = NowItemSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  const images = parseImagesField(parsed.data.images);

  const { error } = await supabase.from("now_items").insert({
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    status: parsed.data.status,
    image: parsed.data.image?.trim() || null,
    images,
    link: parsed.data.link?.trim() || null,
    link_text: parsed.data.linkText?.trim() || null,
    sort_order: parsed.data.sortOrder,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/now");
  revalidatePath("/");
  revalidatePath("/admin/now");
}

export async function updateNowItem(
  id: string,
  formData: FormData
): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = NowItemSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  // Fetch current item to clean up replaced images if needed
  const { data: currentItem } = await supabase
    .from("now_items")
    .select("image, images")
    .eq("id", id)
    .maybeSingle();

  const oldImage = currentItem?.image;
  const oldImages: string[] = Array.isArray(currentItem?.images)
    ? currentItem.images
    : [];
  const newImage = parsed.data.image?.trim() || null;
  const newImages = parseImagesField(parsed.data.images);

  const { error } = await supabase
    .from("now_items")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      date: parsed.data.date,
      status: parsed.data.status,
      image: newImage,
      images: newImages,
      link: parsed.data.link?.trim() || null,
      link_text: parsed.data.linkText?.trim() || null,
      sort_order: parsed.data.sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (oldImage && oldImage !== newImage) {
    await deleteStorageFile(supabase, oldImage);
  }

  const removedImages = oldImages.filter((img) => !newImages.includes(img));
  for (const removed of removedImages) {
    await deleteStorageFile(supabase, removed);
  }

  revalidatePath("/now");
  revalidatePath("/");
  revalidatePath("/admin/now");
}

export async function deleteNowItem(id: string): Promise<void> {
  const supabase = await createClient();
  await requireAdminAuth(supabase);

  const { data: currentItem } = await supabase
    .from("now_items")
    .select("image, images")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("now_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (currentItem?.image) {
    await deleteStorageFile(supabase, currentItem.image);
  }

  if (Array.isArray(currentItem?.images)) {
    for (const extraImg of currentItem.images) {
      await deleteStorageFile(supabase, extraImg);
    }
  }

  revalidatePath("/now");
  revalidatePath("/");
  revalidatePath("/admin/now");
}
