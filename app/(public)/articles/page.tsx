import type { Metadata } from "next";
import ArticlesContent from "@/component/sections/ArticlesContent";
import { getArticles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Articles | Toluwanimi Odufeko",
  description:
    "Notes, essays, and technical reflections on engineering, systems design, NGO leadership, and personal growth.",
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticlesContent articles={articles} />;
}
