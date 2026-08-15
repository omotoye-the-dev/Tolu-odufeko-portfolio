"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/auth-guard";
import { deleteStorageFile } from "@/lib/supabase/storage";

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────

const ProjectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  categories: z.string().min(1, "At least one category is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  image: z.string().url("Banner image must be a valid URL"),
  images: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  techStack: z.string().min(1, "At least one tech stack item is required"),
  featured: z.string().optional(),
  link: z.string().url("Link must be a valid URL").or(z.literal("")).optional(),
  body: z.string().min(1, "Body is required"),
});

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────

export async function createProject(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = ProjectSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  const { error } = await supabase.from("projects").insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    categories: parseCommaField(parsed.data.categories),
    excerpt: parsed.data.excerpt,
    image: parsed.data.image,
    images: parseImagesField(parsed.data.images),
    date: parsed.data.date,
    tech_stack: parseCommaField(parsed.data.techStack),
    featured: parsed.data.featured === "on",
    link: parsed.data.link || null,
    body: parseArrayField(parsed.data.body),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(
  id: string,
  formData: FormData
): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = ProjectSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  const newImages = parseImagesField(parsed.data.images);

  // 1. Fetch current project to check if image or gallery images were removed
  const { data: currentProject } = await supabase
    .from("projects")
    .select("image, images")
    .eq("id", id)
    .maybeSingle();

  // 2. Update database record
  const { error } = await supabase
    .from("projects")
    .update({
      slug: parsed.data.slug,
      title: parsed.data.title,
      categories: parseCommaField(parsed.data.categories),
      excerpt: parsed.data.excerpt,
      image: parsed.data.image,
      images: newImages,
      date: parsed.data.date,
      tech_stack: parseCommaField(parsed.data.techStack),
      featured: parsed.data.featured === "on",
      link: parsed.data.link || null,
      body: parseArrayField(parsed.data.body),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // 3. If main banner image was changed, clean up previous file from storage
  if (
    currentProject?.image &&
    currentProject.image !== parsed.data.image
  ) {
    await deleteStorageFile(supabase, currentProject.image);
  }

  // 4. Clean up any removed gallery images
  if (currentProject && Array.isArray(currentProject.images)) {
    const removedImages = currentProject.images.filter(
      (oldUrl: string) => !newImages.includes(oldUrl)
    );
    for (const oldUrl of removedImages) {
      await deleteStorageFile(supabase, oldUrl);
    }
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${parsed.data.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  await requireAdminAuth(supabase);

  // 1. Fetch current project images to delete from storage
  const { data: project } = await supabase
    .from("projects")
    .select("image, images")
    .eq("id", id)
    .maybeSingle();

  // 2. Delete database record
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // 3. Remove main banner image from storage if hosted in Supabase
  if (project?.image) {
    await deleteStorageFile(supabase, project.image);
  }

  // 4. Remove all gallery images from storage
  if (project && Array.isArray(project.images)) {
    for (const imgUrl of project.images) {
      await deleteStorageFile(supabase, imgUrl);
    }
  }

  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

