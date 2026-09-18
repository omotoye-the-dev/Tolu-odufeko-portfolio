// Central content types and Supabase fetch functions.
// Static placeholder arrays at the bottom are kept only as fallback/seed reference.

import { createClient } from "@/lib/supabase/server";
import type { Project, Article, NowItem, SiteSettings, GalleryItem } from "@/types";

export type { Project, Article, NowItem, SiteSettings, GalleryItem };

// ─────────────────────────────────────────────
// Row shape returned by Supabase (snake_case)
// ─────────────────────────────────────────────

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  excerpt: string;
  image: string;
  images?: string[];
  date: string;
  tech_stack: string[];
  featured: boolean;
  link: string | null;
  body: string[];
}

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  images?: string[];
  date: string;
  read_time: string;
  tags: string[];
  link: string | null;
  body: string[];
}

interface NowItemRow {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

interface GalleryItemRow {
  id: string;
  title: string;
  caption?: string | null;
  image_url: string;
  category: string;
  event_date?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────
// Mappers — snake_case → camelCase
// ─────────────────────────────────────────────

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    categories: row.categories,
    excerpt: row.excerpt,
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [],
    date: row.date,
    techStack: row.tech_stack,
    featured: row.featured,
    link: row.link ?? undefined,
    body: row.body,
  };
}

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [],
    date: row.date,
    readTime: row.read_time,
    tags: row.tags,
    link: row.link ?? undefined,
    body: row.body,
  };
}

function mapNowItem(row: NowItemRow): NowItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapGalleryItem(row: GalleryItemRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    caption: row.caption ?? undefined,
    imageUrl: row.image_url,
    category: row.category,
    eventDate: row.event_date ?? undefined,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─────────────────────────────────────────────
// Fetch functions
// ─────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("getProjects error:", error.message);
    return [];
  }

  return (data as ProjectRow[]).map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapProject(data as ProjectRow);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("getFeaturedProjects error:", error.message);
    return [];
  }

  return (data as ProjectRow[]).map(mapProject);
}

export async function getArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("getArticles error:", error.message);
    return [];
  }

  return (data as ArticleRow[]).map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapArticle(data as ArticleRow);
}

export async function getNowItems(): Promise<NowItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("now_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getNowItems error:", error.message);
    return [];
  }

  return (data as NowItemRow[]).map(mapNowItem);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getGalleryItems error:", error.message);
    return [];
  }

  return (data as GalleryItemRow[]).map(mapGalleryItem);
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapGalleryItem(data as GalleryItemRow);
}

interface SiteSettingsRow {
  id: string;
  cv_url: string | null;
  github_url: string;
  linkedin_url: string;
  instagram_url?: string | null;
  twitter_url?: string | null;
  email?: string | null;
  hero_eyebrow?: string | null;
  hero_title?: string | null;
  hero_subtext?: string | null;
  bio_eyebrow?: string | null;
  bio_title?: string | null;
  bio_paragraphs?: string[] | null;
  projects_eyebrow?: string | null;
  projects_title?: string | null;
  projects_subtext?: string | null;
  articles_eyebrow?: string | null;
  articles_title?: string | null;
  articles_subtext?: string | null;
  services_eyebrow?: string | null;
  services_title?: string | null;
  services_subtext?: string | null;
  // About Page
  about_eyebrow?: string | null;
  about_title?: string | null;
  about_subtext?: string | null;
  about_donate_eyebrow?: string | null;
  about_donate_title?: string | null;
  about_donate_subtext?: string | null;
  about_skills_eyebrow?: string | null;
  about_skills_title?: string | null;
  // Projects Page
  projects_page_eyebrow?: string | null;
  projects_page_title?: string | null;
  projects_page_subtext?: string | null;
  // Articles Page
  articles_page_eyebrow?: string | null;
  articles_page_title?: string | null;
  articles_page_subtext?: string | null;
  // Now Page
  now_eyebrow?: string | null;
  now_title?: string | null;
  now_subtext?: string | null;
  // Contact Page
  contact_eyebrow?: string | null;
  contact_title?: string | null;
  contact_subtext?: string | null;
  // Gallery Page
  gallery_eyebrow?: string | null;
  gallery_title?: string | null;
  gallery_subtext?: string | null;
}

const DEFAULT_BIO_PARAGRAPHS = [
  "I am an engineer in the oil and gas sector with a B.Eng. in Electrical and Electronics Engineering, driven by a passion for building systems, solving problems, and making complex ideas easier to understand.",
  "My interests sit at the intersection of engineering, reliable energy, technology, and people development. I founded Donate Drive to help children from underserved communities discover purpose and access opportunities that shape their future.",
  "At the core of everything I do is a simple desire: to build, to teach, to create, and to help people become better.",
] as const;

function mapSiteSettings(row: SiteSettingsRow): SiteSettings {
  const instagram = row.instagram_url || row.twitter_url || null;
  const safeEmail =
    row.email &&
    row.email.trim().length > 0 &&
    !row.email.includes("example.com")
      ? row.email.trim()
      : null;

  return {
    id: row.id,
    cvUrl: row.cv_url,
    githubUrl: row.github_url || "https://github.com/fekoh17",
    linkedinUrl:
      row.linkedin_url ||
      "https://www.linkedin.com/in/toluwanimi-odufeko-5156011b5/",
    instagramUrl: instagram,
    twitterUrl: row.twitter_url || instagram || null,
    email: safeEmail,
    heroEyebrow: row.hero_eyebrow || "Engineer · Builder · Voice for impact",
    heroTitle: row.hero_title || "Toluwanimi Odufeko",
    heroSubtext:
      row.hero_subtext ||
      "Bridging technical excellence with personal development and purposeful work. Engineering, energy, and helping people become better versions of themselves.",
    bioEyebrow: row.bio_eyebrow || "About Me",
    bioTitle:
      row.bio_title || "Building Systems, Solving Problems & Empowering Lives",
    bioParagraphs:
      Array.isArray(row.bio_paragraphs) && row.bio_paragraphs.length > 0
        ? row.bio_paragraphs
        : DEFAULT_BIO_PARAGRAPHS,
    projectsEyebrow: row.projects_eyebrow || "selected work",
    projectsTitle: row.projects_title || "Featured Projects",
    projectsSubtext:
      row.projects_subtext ||
      "Hardware and software built for the field — filter by discipline.",
    articlesEyebrow: row.articles_eyebrow || "writing",
    articlesTitle: row.articles_title || "Latest Articles",
    articlesSubtext:
      row.articles_subtext ||
      "Notes on engineering, building an NGO, and staying useful.",
    servicesEyebrow: row.services_eyebrow || "work with me",
    servicesTitle: row.services_title || "How Can I Help You?",
    servicesSubtext:
      row.services_subtext ||
      "Ways we can collaborate, build, or create meaningful impact together.",
    aboutEyebrow: row.about_eyebrow || "Biography",
    aboutTitle: row.about_title || "About Me",
    aboutSubtext:
      row.about_subtext ||
      "Engineer, builder, and voice for impact — working at the intersection of engineering, reliable energy, technology, and people development.",
    aboutDonateEyebrow: row.about_donate_eyebrow || "Donate Drive",
    aboutDonateTitle: row.about_donate_title || "What I'm Building",
    aboutDonateSubtext:
      row.about_donate_subtext ||
      "Donate Drive is committed to helping children from underserved communities discover purpose and gain access to opportunities that can shape their future. Over the past five years, we have empowered children through education, mentorship, scholarships, skills development, and community outreach.",
    aboutSkillsEyebrow: row.about_skills_eyebrow || "Capabilities",
    aboutSkillsTitle: row.about_skills_title || "Skills & Expertise",
    projectsPageEyebrow: row.projects_page_eyebrow || "Portfolio",
    projectsPageTitle: row.projects_page_title || "Projects",
    projectsPageSubtext:
      row.projects_page_subtext ||
      "Hardware and software built for the field — filter by discipline.",
    articlesPageEyebrow: row.articles_page_eyebrow || "Writing & Notes",
    articlesPageTitle: row.articles_page_title || "Articles",
    articlesPageSubtext:
      row.articles_page_subtext ||
      "Technical reflections, engineering analysis, solar microgrids, NGO leadership lessons, and essays.",
    nowEyebrow: row.now_eyebrow || "Focus & Priorities",
    nowTitle: row.now_title || "What I'm Doing Now",
    nowSubtext:
      row.now_subtext ||
      "A running snapshot of where my attention actually is.",
    contactEyebrow: row.contact_eyebrow || "Reach Out",
    contactTitle: row.contact_title || "Get In Touch",
    contactSubtext:
      row.contact_subtext ||
      "Whether it’s a hardware problem worth solving, a collaboration, or supporting Donate Drive — I read every message. Tell me what you’re working on and I’ll get back to you.",
    galleryEyebrow: row.gallery_eyebrow || "Visual Moments",
    galleryTitle: row.gallery_title || "Gallery",
    gallerySubtext:
      row.gallery_subtext ||
      "A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments.",
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallbackSettings: SiteSettings = {
    id: "default",
    cvUrl: null,
    githubUrl: "https://github.com/fekoh17",
    linkedinUrl: "https://www.linkedin.com/in/toluwanimi-odufeko-5156011b5/",
    instagramUrl: "https://www.instagram.com/ziba.feko/",
    twitterUrl: "https://www.instagram.com/ziba.feko/",
    email: null,
    heroEyebrow: "Engineer · Builder · Voice for impact",
    heroTitle: "Toluwanimi Odufeko",
    heroSubtext:
      "Bridging technical excellence with personal development and purposeful work. Engineering, energy, and helping people become better versions of themselves.",
    bioEyebrow: "About Me",
    bioTitle: "Building Systems, Solving Problems & Empowering Lives",
    bioParagraphs: DEFAULT_BIO_PARAGRAPHS,
    projectsEyebrow: "selected work",
    projectsTitle: "Featured Projects",
    projectsSubtext:
      "Hardware and software built for the field — filter by discipline.",
    articlesEyebrow: "writing",
    articlesTitle: "Latest Articles",
    articlesSubtext:
      "Notes on engineering, building an NGO, and staying useful.",
    servicesEyebrow: "work with me",
    servicesTitle: "How Can I Help You?",
    servicesSubtext:
      "Ways we can collaborate, build, or create meaningful impact together.",
    aboutEyebrow: "Biography",
    aboutTitle: "About Me",
    aboutSubtext:
      "Engineer, builder, and voice for impact — working at the intersection of engineering, reliable energy, technology, and people development.",
    aboutDonateEyebrow: "Donate Drive",
    aboutDonateTitle: "What I'm Building",
    aboutDonateSubtext:
      "Donate Drive is committed to helping children from underserved communities discover purpose and gain access to opportunities that can shape their future. Over the past five years, we have empowered children through education, mentorship, scholarships, skills development, and community outreach.",
    aboutSkillsEyebrow: "Capabilities",
    aboutSkillsTitle: "Skills & Expertise",
    projectsPageEyebrow: "Portfolio",
    projectsPageTitle: "Projects",
    projectsPageSubtext:
      "Hardware and software built for the field — filter by discipline.",
    articlesPageEyebrow: "Writing & Notes",
    articlesPageTitle: "Articles",
    articlesPageSubtext:
      "Technical reflections, engineering analysis, solar microgrids, NGO leadership lessons, and essays.",
    nowEyebrow: "Focus & Priorities",
    nowTitle: "What I'm Doing Now",
    nowSubtext:
      "A running snapshot of where my attention actually is.",
    contactEyebrow: "Reach Out",
    contactTitle: "Get In Touch",
    contactSubtext:
      "Whether it’s a hardware problem worth solving, a collaboration, or supporting Donate Drive — I read every message. Tell me what you’re working on and I’ll get back to you.",
    galleryEyebrow: "Visual Moments",
    galleryTitle: "Gallery",
    gallerySubtext:
      "A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments.",
  };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return fallbackSettings;
    }

    return mapSiteSettings(data as SiteSettingsRow);
  } catch {
    return fallbackSettings;
  }
}

// Static data (services, skills, socials) has moved to lib/constants.ts
// so client components can import it without pulling in next/headers.
export { services, skills, socials } from "@/lib/constants";