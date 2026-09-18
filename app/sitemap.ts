import type { MetadataRoute } from "next";
import { getProjects, getArticles } from "@/lib/data";

function parseSafeDate(dateStr?: string | null): Date {
  if (!dateStr || dateStr.trim().length === 0) return new Date();
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toluwanimiodufeko.com";

  const [projects, articles] = await Promise.all([
    getProjects().catch(() => []),
    getArticles().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/now`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => Boolean(p.slug && p.slug.trim()))
    .map((p) => ({
      url: `${baseUrl}/projects/${p.slug.trim()}`,
      lastModified: parseSafeDate(p.date),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter((a) => Boolean(a.slug && a.slug.trim()))
    .map((a) => ({
      url: `${baseUrl}/articles/${a.slug.trim()}`,
      lastModified: parseSafeDate(a.date),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
