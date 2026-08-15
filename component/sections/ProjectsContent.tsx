"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import Container from "@/component/UI/Container";
import ProjectCard from "@/component/UI/ProjectCard";
import Button from "@/component/UI/Button";
import EmptyState from "@/component/UI/EmptyState";
import type { Project } from "@/lib/data";

const FILTERS = ["All", "Engineering", "Software", "NGO"] as const;
type FilterType = (typeof FILTERS)[number];
const PAGE_SIZE = 6;

interface ProjectsContentProps {
  readonly projects: Project[];
}

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const filteredProjects = useMemo(() => {
    const list =
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.categories.includes(activeFilter));

    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [activeFilter, projects]);

  const shownProjects = filteredProjects.slice(0, visibleCount);

  const handleFilterChange = (filter: FilterType): void => {
    setActiveFilter(filter);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = (): void => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="border-b border-dark-one/15 pb-10">
          <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
            Portfolio
          </span>
          <h1 className="mt-2 font-header text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-dark-one">
            Projects
          </h1>
          <p className="mt-4 max-w-xl font-content text-base sm:text-lg text-muted">
            Hardware and software built for the field — filter by discipline.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3" role="tablist" aria-label="Project category filters">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleFilterChange(filter)}
                className={clsx(
                  "font-content rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-2xs",
                  isActive
                    ? "bg-accent text-dark-one border-2 border-accent font-bold"
                    : "border-2 border-dark-one/15 bg-white/70 text-dark-one hover:border-accent hover:bg-accent/10"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Project Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shownProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={project.featured}
            />
          ))}
        </div>

        {/* Empty State */}
        {shownProjects.length === 0 && (
          <EmptyState
            icon="◈"
            title="No projects found"
            description="No projects currently match this selected category."
            ctaLabel="Show all projects"
            onCta={() => handleFilterChange("All")}
          />
        )}

        {/* Load More Button */}
        {visibleCount < filteredProjects.length && (
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              type="button"
              onClick={handleLoadMore}
            >
              Load More Projects
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ProjectsContent;
