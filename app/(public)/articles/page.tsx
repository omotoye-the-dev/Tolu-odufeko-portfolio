import type { Metadata } from "next";
import { getArticles, getSiteSettings } from "@/lib/data";
import ArticlesContent from "@/component/sections/ArticlesContent";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Technical reflections, engineering analysis, solar microgrids, NGO leadership lessons, and essays by Toluwanimi Odufeko.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Articles | Toluwanimi Odufeko",
    description:
      "Technical essays, hardware engineering reflections, and social impact insights by Toluwanimi Odufeko.",
    url: "/articles",
    images: [
      {
        url: "/images/tolu-odufeko.png",
        width: 1200,
        height: 630,
        alt: "Articles and reflections by Toluwanimi Odufeko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles | Toluwanimi Odufeko",
    description:
      "Technical essays, hardware engineering reflections, and social impact insights by Toluwanimi Odufeko.",
    images: ["/images/tolu-odufeko.png"],
  },
};

export default async function ArticlesPage() {
  const [articles, settings] = await Promise.all([
    getArticles(),
    getSiteSettings(),
  ]);

  return (
    <ArticlesContent
      articles={articles}
      eyebrow={settings.articlesPageEyebrow ?? settings.articlesEyebrow}
      title={settings.articlesPageTitle ?? settings.articlesTitle}
      subtext={settings.articlesPageSubtext ?? settings.articlesSubtext}
    />
  );
}
