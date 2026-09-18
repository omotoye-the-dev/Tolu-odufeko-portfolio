import { getFeaturedProjects, getSiteSettings } from "@/lib/data";
import Container from "@/component/UI/Container";
import ProjectCard from "@/component/UI/ProjectCard";
import Button from "@/component/UI/Button";

export async function Featuredsection() {
  const [featuredProjects, settings] = await Promise.all([
    getFeaturedProjects(),
    getSiteSettings(),
  ]);

  return (
    <section className="w-full py-12 sm:py-16">
      <Container>
        <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
          {settings.projectsEyebrow ?? "selected work"}
        </span>
        <h2 className="pt-2 font-header text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-dark-one">
          {settings.projectsTitle ?? "Featured Projects"}
        </h2>
        {settings.projectsSubtext && (
          <p className="pt-2 font-content text-sm sm:text-base text-muted max-w-2xl">
            {settings.projectsSubtext}
          </p>
        )}

        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={true}
              headingLevel="h3"
            />
          ))}
        </div>

        <div className="pt-10 sm:pt-12 flex justify-start">
          <Button href="/projects" variant="outline">
            Explore All Projects
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default Featuredsection;

