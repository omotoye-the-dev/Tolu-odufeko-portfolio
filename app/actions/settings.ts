"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { deleteStorageFile } from "@/lib/supabase/storage";

const SettingsSchema = z.object({
  cvUrl: z.string().url("CV must be a valid URL").or(z.literal("")).optional(),
  githubUrl: z.string().url("GitHub must be a valid URL"),
  linkedinUrl: z.string().url("LinkedIn must be a valid URL"),
  twitterUrl: z.string().url("Twitter/X must be a valid URL").or(z.literal("")).optional(),
  email: z.string().email("Please provide a valid email address"),
});

export async function updateSiteSettings(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = SettingsSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();

  // 1. Fetch current settings to check if CV was replaced or removed
  const { data: currentSettings } = await supabase
    .from("site_settings")
    .select("cv_url")
    .eq("id", "default")
    .maybeSingle();

  const newCvUrl = parsed.data.cvUrl || null;
  const oldCvUrl = currentSettings?.cv_url ?? null;

  // 2. Upsert settings row
  const { error } = await supabase.from("site_settings").upsert({
    id: "default",
    cv_url: newCvUrl,
    github_url: parsed.data.githubUrl,
    linkedin_url: parsed.data.linkedinUrl,
    twitter_url: parsed.data.twitterUrl || null,
    email: parsed.data.email,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  // 3. If CV was changed or removed, clean up old file from Supabase storage
  if (oldCvUrl && oldCvUrl !== newCvUrl) {
    await deleteStorageFile(supabase, oldCvUrl);
  }

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}
