import type { Metadata } from "next";
import ArticlesContent from "@/component/sections/ArticlesContent";
import { getArticles } from "@/lib/data";

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
  },
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticlesContent articles={articles} />;
}
