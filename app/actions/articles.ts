"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/auth-guard";
import { deleteStorageFile } from "@/lib/supabase/storage";

const ArticleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  image: z.string().url("Banner image must be a valid URL"),
  images: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  readTime: z.string().min(1, "Read time is required"),
  tags: z.string().min(1, "At least one tag is required"),
  link: z.string().url("Link must be a valid URL").or(z.literal("")).optional(),
  body: z.string().min(1, "Body is required"),
});

function parseArrayField(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCommaField(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

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

export async function createArticle(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = ArticleSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  const { error } = await supabase.from("articles").insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    image: parsed.data.image,
    images: parseImagesField(parsed.data.images),
    date: parsed.data.date,
    read_time: parsed.data.readTime,
    tags: parseCommaField(parsed.data.tags),
    link: parsed.data.link || null,
    body: parseArrayField(parsed.data.body),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/articles");
  revalidatePath("/");
  revalidatePath("/admin/articles");
}

export async function updateArticle(
  id: string,
  formData: FormData
): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = ArticleSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  const newImages = parseImagesField(parsed.data.images);

  // 1. Fetch current article to check if image or gallery was replaced
  const { data: currentArticle } = await supabase
    .from("articles")
    .select("image, images")
    .eq("id", id)
    .maybeSingle();

  // 2. Update database record
  const { error } = await supabase
    .from("articles")
    .update({
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      image: parsed.data.image,
      images: newImages,
      date: parsed.data.date,
      read_time: parsed.data.readTime,
      tags: parseCommaField(parsed.data.tags),
      link: parsed.data.link || null,
      body: parseArrayField(parsed.data.body),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // 3. If main image was replaced, remove previous file from storage
  if (
    currentArticle?.image &&
    currentArticle.image !== parsed.data.image
  ) {
    await deleteStorageFile(supabase, currentArticle.image);
  }

  // 4. Clean up any removed gallery images
  if (currentArticle && Array.isArray(currentArticle.images)) {
    const removedImages = currentArticle.images.filter(
      (oldUrl: string) => !newImages.includes(oldUrl)
    );
    for (const oldUrl of removedImages) {
      await deleteStorageFile(supabase, oldUrl);
    }
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${parsed.data.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/articles");
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = await createClient();
  await requireAdminAuth(supabase);

  // 1. Fetch current article images to delete from storage
  const { data: article } = await supabase
    .from("articles")
    .select("image, images")
    .eq("id", id)
    .maybeSingle();

  // 2. Delete database record
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // 3. Remove main banner image from storage if hosted in Supabase
  if (article?.image) {
    await deleteStorageFile(supabase, article.image);
  }

  // 4. Remove all gallery images from storage
  if (article && Array.isArray(article.images)) {
    for (const imgUrl of article.images) {
      await deleteStorageFile(supabase, imgUrl);
    }
  }

  revalidatePath("/articles");
  revalidatePath("/");
  revalidatePath("/admin/articles");
}

