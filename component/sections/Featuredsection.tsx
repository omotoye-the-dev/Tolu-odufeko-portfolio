import { getFeaturedProjects } from "@/lib/data";
import Container from "@/component/UI/Container";
import ProjectCard from "@/component/UI/ProjectCard";
import Button from "@/component/UI/Button";

export async function Featuredsection() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <section className="w-full py-12 sm:py-16">
      <Container>
        <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
          selected work
        </span>
        <h2 className="pt-2 font-header text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-dark-one">
          Featured Projects
        </h2>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} featured={true} />
          ))}
        </div>

        <div className="pt-12 sm:pt-16 flex justify-start">
          <Button href="/projects" variant="outline">
            Explore All Projects
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default Featuredsection;
