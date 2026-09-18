import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import type { Project } from "@/lib/data";

export interface ProjectCardProps {
  readonly project: Project;
  readonly className?: string;
  readonly featured?: boolean;
  readonly headingLevel?: "h2" | "h3";
}

export function ProjectCard({
  project,
  className,
  featured = false,
  headingLevel = "h2",
}: ProjectCardProps) {
  const projectHref = `/projects/${project.slug}`;
  const HeadingTag = headingLevel;

  const cardContent = (
    <article className="flex h-full flex-col">
      <div className="relative aspect-video w-full overflow-hidden bg-faint/10">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-5.5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {project.categories.map((category) => (
              <span
                key={category}
                className="font-content text-accent-strong text-[11px] font-bold uppercase tracking-wider"
              >
                {category}
              </span>
            ))}
          </div>

          <HeadingTag className="font-header text-dark-one group-hover:text-accent-strong pt-2.5 text-lg sm:text-xl font-bold leading-snug transition-colors line-clamp-2">
            {project.title}
          </HeadingTag>

          <p className="font-content text-muted pt-2 text-sm leading-relaxed line-clamp-2 wrap-break-word">
            {project.excerpt}
          </p>
        </div>

        <div className="pt-4 sm:pt-5">
          <span className="font-content text-dark-one inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 transition-all duration-200 group-hover:gap-2.5 group-hover:decoration-accent-strong">
            View Project <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </article>
  );

  const containerClasses = clsx(
    "group flex flex-col overflow-hidden rounded-2xl border bg-light transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
    featured
      ? "border-accent border-l-4 shadow-xs"
      : "border-black/15 hover:border-accent",
    className
  );

  return (
    <Link href={projectHref} className={containerClasses}>
      {cardContent}
    </Link>
  );
}

export default ProjectCard;
