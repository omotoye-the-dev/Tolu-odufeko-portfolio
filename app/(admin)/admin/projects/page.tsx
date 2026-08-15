import Link from "next/link";
import AdminShell from "@/component/admin/AdminShell";
import EmptyState from "@/component/UI/EmptyState";
import AdminDeleteButton from "@/component/admin/AdminDeleteButton";
import { getProjects } from "@/lib/data";
import { deleteProject } from "@/app/actions/projects";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-5xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <div>
            <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
              Content
            </span>
            <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">
              Projects
            </h1>
            <p className="mt-1 font-content text-xs sm:text-sm text-muted">
              {projects.length} total ·{" "}
              {projects.filter((p) => p.featured).length} featured
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="font-content text-xs sm:text-sm font-bold bg-accent text-dark-one px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl hover:bg-accent-strong transition-colors text-center w-full sm:w-auto"
          >
            + New Project
          </Link>
        </div>

        {/* Table */}
        {projects.length === 0 ? (
          <EmptyState
            icon="◈"
            title="No projects yet"
            description="Add your first engineering or software project to display it on the portfolio."
            ctaLabel="Create your first project"
            ctaHref="/admin/projects/new"
          />
        ) : (
          <div className="border-t border-dark-one/10">
            <div className="divide-y divide-dark-one/10">
              {projects.map((project) => (
                <div
                  key={project.slug}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 sm:py-5"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-content text-sm font-semibold text-dark-one wrap-break-word">
                        {project.title}
                      </span>
                      {project.featured && (
                        <span className="inline-block bg-accent/30 text-dark-one text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="font-content text-xs text-muted">
                      {project.date} · {project.categories.join(", ")} ·{" "}
                      <span className="text-faint">{project.slug}</span>
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="font-content text-[10px] border border-dark-one/15 rounded px-1.5 py-0.5 text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="font-content text-[10px] text-faint">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-dark-one/5 justify-end sm:justify-start shrink-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-content text-xs text-muted hover:text-dark-one transition-colors px-2 py-1"
                      aria-label={`View ${project.title} on public site`}
                    >
                      View ↗
                    </Link>
                    <Link
                      href={`/admin/projects/${project.slug}/edit`}
                      className="font-content text-xs font-semibold text-accent-strong hover:text-dark-one transition-colors px-2 py-1"
                    >
                      Edit →
                    </Link>
                    <AdminDeleteButton
                      itemId={project.id ?? ""}
                      itemTitle={project.title}
                      itemType="project"
                      onDelete={deleteProject}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
