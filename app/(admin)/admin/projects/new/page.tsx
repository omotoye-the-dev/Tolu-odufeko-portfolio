import AdminShell from "@/component/admin/AdminShell";
import ProjectForm from "@/component/admin/ProjectForm";
import { createProject } from "@/app/actions/projects";

export default function NewProjectPage() {
  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-3xl w-full">
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Projects
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">New Project</h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted">
            Fill in the details below to add a new project.
          </p>
        </div>
        <ProjectForm action={createProject} cancelHref="/admin/projects" />
      </div>
    </AdminShell>
  );
}
