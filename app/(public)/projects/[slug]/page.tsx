import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/component/UI/Container";
import ProjectCard from "@/component/UI/ProjectCard";
import Button from "@/component/UI/Button";
import { getProjects, getProjectBySlug } from "@/lib/data";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Toluwanimi Odufeko",
    };
  }

  return {
    title: `${project.title} | Toluwanimi Odufeko`,
    description: project.excerpt,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = allProjects
    .filter(
      (p) =>
        p.slug !== project.slug &&
        p.categories.some((c) => project.categories.includes(c))
    )
    .slice(0, 3);

  return (
    <article className="w-full">
      {/* Hero Image Banner */}
      <div className="relative aspect-video sm:aspect-21/9 max-h-120 w-full overflow-hidden bg-neutral-200 border-b border-dark-one/15">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="py-10 sm:py-14">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="mb-6 font-content text-xs text-muted">
          <Link href="/projects" className="hover:text-accent-strong hover:underline">
            Projects
          </Link>
          <span className="mx-2 text-faint" aria-hidden="true">
            /
          </span>
          <span className="text-dark-one font-medium">{project.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="font-content text-xs font-bold uppercase tracking-wider text-accent-strong"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="mt-4 font-header text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-dark-one">
              {project.title}
            </h1>

            <div className="font-content mt-3 text-xs sm:text-sm text-muted">
              {project.date}
            </div>

            <div className="mt-8 space-y-6 font-content text-base sm:text-lg leading-relaxed text-muted">
              {project.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Gallery Section */}
            {project.images && project.images.length > 0 && (
              <div className="mt-12 border-t border-dark-one/15 pt-8">
                <h2 className="font-header text-xl sm:text-2xl font-bold text-dark-one mb-6">
                  Project Gallery &amp; Visuals
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.images.map((imgUrl, i) => (
                    <div
                      key={`${imgUrl}-${i}`}
                      className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-dark-one/15 bg-neutral-100 shadow-xs"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${project.title} visual ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.link && (
              <div className="mt-10">
                <Button
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
                  Visit Project &rarr;
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:border-l lg:border-black/15 lg:pl-8">
            <h2 className="font-content text-xs font-bold uppercase tracking-[0.2em] text-accent-strong">
              Tech Stack
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="font-content rounded-full border border-dark-one/20 bg-white px-3.5 py-1.5 text-xs font-medium text-dark-one shadow-2xs"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="border-t border-dark-one/15 bg-white/40 py-12 sm:py-16">
          <Container>
            <h2 className="font-header mb-8 text-2xl sm:text-3xl font-bold text-dark-one">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
