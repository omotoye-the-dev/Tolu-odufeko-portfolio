import type { Metadata } from "next";
import ProjectsContent from "@/component/sections/ProjectsContent";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore engineering, hardware, software, and nonprofit impact projects built by Toluwanimi Odufeko.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Toluwanimi Odufeko",
    description:
      "Explore engineering, embedded systems, software tools, and NGO initiatives built by Toluwanimi Odufeko.",
    url: "/projects",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsContent projects={projects} />;
}
