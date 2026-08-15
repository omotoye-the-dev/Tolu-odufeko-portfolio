import { notFound } from "next/navigation";
import AdminShell from "@/component/admin/AdminShell";
import ProjectForm from "@/component/admin/ProjectForm";
import { getProjectBySlug } from "@/lib/data";
import { updateProject } from "@/app/actions/projects";

interface EditProjectPageProps {
  readonly params: Promise<{ slug: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || !project.id) notFound();

  const projectId = project.id;

  async function handleUpdate(formData: FormData): Promise<void> {
    "use server";
    await updateProject(projectId, formData);
  }

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-3xl w-full">
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Projects
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">Edit Project</h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted wrap-break-word">
            {project.title}
          </p>
        </div>
        <ProjectForm
          project={project}
          action={handleUpdate}
          cancelHref="/admin/projects"
        />
      </div>
    </AdminShell>
  );
}
