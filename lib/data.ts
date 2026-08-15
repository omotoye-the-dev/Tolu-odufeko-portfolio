// Central content types and Supabase fetch functions.
// Static placeholder arrays at the bottom are kept only as fallback/seed reference.

import { createClient } from "@/lib/supabase/server";
import type { Project, Article, NowItem, SiteSettings } from "@/types";

export type { Project, Article, NowItem, SiteSettings };

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


interface SiteSettingsRow {
  id: string;
  cv_url: string | null;
  github_url: string;
  linkedin_url: string;
  twitter_url: string | null;
  email: string;
}

function mapSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    id: row.id,
    cvUrl: row.cv_url,
    githubUrl: row.github_url || "https://github.com",
    linkedinUrl: row.linkedin_url || "https://linkedin.com",
    twitterUrl: row.twitter_url || null,
    email: row.email || "hello@example.com",
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallbackSettings: SiteSettings = {
    id: "default",
    cvUrl: null,
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://x.com",
    email: "hello@example.com",
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