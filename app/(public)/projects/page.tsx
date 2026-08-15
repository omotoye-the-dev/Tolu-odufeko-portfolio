import type { Metadata } from "next";
import ProjectsContent from "@/component/sections/ProjectsContent";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects | Toluwanimi Odufeko",
  description:
    "Explore engineering, software, and NGO projects built for reliability and real-world impact.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsContent projects={projects} />;
}
