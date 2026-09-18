"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/auth-guard";
import { deleteStorageFile } from "@/lib/supabase/storage";

const SettingsSchema = z.object({
  cvUrl: z.string().url("CV must be a valid URL").or(z.literal("")).optional(),
  githubUrl: z.string().url("GitHub must be a valid URL").optional(),
  linkedinUrl: z.string().url("LinkedIn must be a valid URL").optional(),
  instagramUrl: z.string().url("Instagram must be a valid URL").or(z.literal("")).optional(),
  twitterUrl: z.string().url("Twitter/X must be a valid URL").or(z.literal("")).optional(),
  email: z.string().email("Please provide a valid email address").or(z.literal("")).optional(),
  heroEyebrow: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtext: z.string().optional(),
  bioEyebrow: z.string().optional(),
  bioTitle: z.string().optional(),
  bioParagraphs: z.string().optional(),
  projectsEyebrow: z.string().optional(),
  projectsTitle: z.string().optional(),
  projectsSubtext: z.string().optional(),
  articlesEyebrow: z.string().optional(),
  articlesTitle: z.string().optional(),
  articlesSubtext: z.string().optional(),
  servicesEyebrow: z.string().optional(),
  servicesTitle: z.string().optional(),
  servicesSubtext: z.string().optional(),
  // About Page
  aboutEyebrow: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutSubtext: z.string().optional(),
  aboutDonateEyebrow: z.string().optional(),
  aboutDonateTitle: z.string().optional(),
  aboutDonateSubtext: z.string().optional(),
  aboutSkillsEyebrow: z.string().optional(),
  aboutSkillsTitle: z.string().optional(),
  // Projects Page
  projectsPageEyebrow: z.string().optional(),
  projectsPageTitle: z.string().optional(),
  projectsPageSubtext: z.string().optional(),
  // Articles Page
  articlesPageEyebrow: z.string().optional(),
  articlesPageTitle: z.string().optional(),
  articlesPageSubtext: z.string().optional(),
  // Now Page
  nowEyebrow: z.string().optional(),
  nowTitle: z.string().optional(),
  nowSubtext: z.string().optional(),
  // Contact Page
  contactEyebrow: z.string().optional(),
  contactTitle: z.string().optional(),
  contactSubtext: z.string().optional(),
  // Gallery Page
  galleryEyebrow: z.string().optional(),
  galleryTitle: z.string().optional(),
  gallerySubtext: z.string().optional(),
});

export async function updateSiteSettings(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = SettingsSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  await requireAdminAuth(supabase);

  // 1. Fetch current settings
  const { data: currentSettings } = await supabase
    .from("site_settings")
    .select("cv_url")
    .eq("id", "default")
    .maybeSingle();

  const oldCvUrl = currentSettings?.cv_url ?? null;

  const updateData: Record<string, unknown> = {
    id: "default",
    updated_at: new Date().toISOString(),
  };

  if (formData.has("cvUrl")) {
    const newCvUrl = parsed.data.cvUrl || null;
    updateData.cv_url = newCvUrl;
    if (oldCvUrl && oldCvUrl !== newCvUrl) {
      await deleteStorageFile(supabase, oldCvUrl);
    }
  }

  if (formData.has("githubUrl") && parsed.data.githubUrl) updateData.github_url = parsed.data.githubUrl;
  if (formData.has("linkedinUrl") && parsed.data.linkedinUrl) updateData.linkedin_url = parsed.data.linkedinUrl;
  if (formData.has("instagramUrl")) {
    const ig = parsed.data.instagramUrl || null;
    updateData.instagram_url = ig;
    updateData.twitter_url = ig;
  } else if (formData.has("twitterUrl")) {
    updateData.twitter_url = parsed.data.twitterUrl || null;
  }
  if (formData.has("email")) {
    updateData.email = parsed.data.email ? parsed.data.email.trim() : "";
  }

  if (formData.has("heroEyebrow")) updateData.hero_eyebrow = parsed.data.heroEyebrow?.trim() || null;
  if (formData.has("heroTitle")) updateData.hero_title = parsed.data.heroTitle?.trim() || null;
  if (formData.has("heroSubtext")) updateData.hero_subtext = parsed.data.heroSubtext?.trim() || null;
  if (formData.has("bioEyebrow")) updateData.bio_eyebrow = parsed.data.bioEyebrow?.trim() || null;
  if (formData.has("bioTitle")) updateData.bio_title = parsed.data.bioTitle?.trim() || null;
  if (formData.has("bioParagraphs")) {
    const parsedBioParagraphs = parsed.data.bioParagraphs
      ? parsed.data.bioParagraphs
          .split(/\r?\n\s*\r?\n|\r?\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : null;
    updateData.bio_paragraphs = parsedBioParagraphs && parsedBioParagraphs.length > 0 ? parsedBioParagraphs : null;
  }
  if (formData.has("projectsEyebrow")) updateData.projects_eyebrow = parsed.data.projectsEyebrow?.trim() || null;
  if (formData.has("projectsTitle")) updateData.projects_title = parsed.data.projectsTitle?.trim() || null;
  if (formData.has("projectsSubtext")) updateData.projects_subtext = parsed.data.projectsSubtext?.trim() || null;
  if (formData.has("articlesEyebrow")) updateData.articles_eyebrow = parsed.data.articlesEyebrow?.trim() || null;
  if (formData.has("articlesTitle")) updateData.articles_title = parsed.data.articlesTitle?.trim() || null;
  if (formData.has("articlesSubtext")) updateData.articles_subtext = parsed.data.articlesSubtext?.trim() || null;
  if (formData.has("servicesEyebrow")) updateData.services_eyebrow = parsed.data.servicesEyebrow?.trim() || null;
  if (formData.has("servicesTitle")) updateData.services_title = parsed.data.servicesTitle?.trim() || null;
  if (formData.has("servicesSubtext")) updateData.services_subtext = parsed.data.servicesSubtext?.trim() || null;

  // About Page
  if (formData.has("aboutEyebrow")) updateData.about_eyebrow = parsed.data.aboutEyebrow?.trim() || null;
  if (formData.has("aboutTitle")) updateData.about_title = parsed.data.aboutTitle?.trim() || null;
  if (formData.has("aboutSubtext")) updateData.about_subtext = parsed.data.aboutSubtext?.trim() || null;
  if (formData.has("aboutDonateEyebrow")) updateData.about_donate_eyebrow = parsed.data.aboutDonateEyebrow?.trim() || null;
  if (formData.has("aboutDonateTitle")) updateData.about_donate_title = parsed.data.aboutDonateTitle?.trim() || null;
  if (formData.has("aboutDonateSubtext")) updateData.about_donate_subtext = parsed.data.aboutDonateSubtext?.trim() || null;
  if (formData.has("aboutSkillsEyebrow")) updateData.about_skills_eyebrow = parsed.data.aboutSkillsEyebrow?.trim() || null;
  if (formData.has("aboutSkillsTitle")) updateData.about_skills_title = parsed.data.aboutSkillsTitle?.trim() || null;

  // Projects Page
  if (formData.has("projectsPageEyebrow")) updateData.projects_page_eyebrow = parsed.data.projectsPageEyebrow?.trim() || null;
  if (formData.has("projectsPageTitle")) updateData.projects_page_title = parsed.data.projectsPageTitle?.trim() || null;
  if (formData.has("projectsPageSubtext")) updateData.projects_page_subtext = parsed.data.projectsPageSubtext?.trim() || null;

  // Articles Page
  if (formData.has("articlesPageEyebrow")) updateData.articles_page_eyebrow = parsed.data.articlesPageEyebrow?.trim() || null;
  if (formData.has("articlesPageTitle")) updateData.articles_page_title = parsed.data.articlesPageTitle?.trim() || null;
  if (formData.has("articlesPageSubtext")) updateData.articles_page_subtext = parsed.data.articlesPageSubtext?.trim() || null;

  // Now Page
  if (formData.has("nowEyebrow")) updateData.now_eyebrow = parsed.data.nowEyebrow?.trim() || null;
  if (formData.has("nowTitle")) updateData.now_title = parsed.data.nowTitle?.trim() || null;
  if (formData.has("nowSubtext")) updateData.now_subtext = parsed.data.nowSubtext?.trim() || null;

  // Contact Page
  if (formData.has("contactEyebrow")) updateData.contact_eyebrow = parsed.data.contactEyebrow?.trim() || null;
  if (formData.has("contactTitle")) updateData.contact_title = parsed.data.contactTitle?.trim() || null;
  if (formData.has("contactSubtext")) updateData.contact_subtext = parsed.data.contactSubtext?.trim() || null;

  // Gallery Page
  if (formData.has("galleryEyebrow")) updateData.gallery_eyebrow = parsed.data.galleryEyebrow?.trim() || null;
  if (formData.has("galleryTitle")) updateData.gallery_title = parsed.data.galleryTitle?.trim() || null;
  if (formData.has("gallerySubtext")) updateData.gallery_subtext = parsed.data.gallerySubtext?.trim() || null;

  const { error } = await supabase.from("site_settings").upsert(updateData);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/projects");
  revalidatePath("/articles");
  revalidatePath("/now");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/site-details");
}

