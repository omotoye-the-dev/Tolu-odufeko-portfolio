import type { Metadata } from "next";
import { getProjects, getSiteSettings } from "@/lib/data";
import ProjectsContent from "@/component/sections/ProjectsContent";

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
    images: [
      {
        url: "/images/tolu-odufeko.png",
        width: 1200,
        height: 630,
        alt: "Projects by Toluwanimi Odufeko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Toluwanimi Odufeko",
    description:
      "Explore engineering, embedded systems, software tools, and NGO initiatives built by Toluwanimi Odufeko.",
    images: ["/images/tolu-odufeko.png"],
  },
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);

  return (
    <ProjectsContent
      projects={projects}
      eyebrow={settings.projectsPageEyebrow ?? settings.projectsEyebrow}
      title={settings.projectsPageTitle ?? settings.projectsTitle}
      subtext={settings.projectsPageSubtext ?? settings.projectsSubtext}
    />
  );
}
