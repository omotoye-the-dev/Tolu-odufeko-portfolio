import { notFound } from "next/navigation";
import AdminShell from "@/component/admin/AdminShell";
import GalleryItemForm from "@/component/admin/GalleryItemForm";
import { getGalleryItemById } from "@/lib/data";
import { updateGalleryItem } from "@/app/actions/gallery";

interface EditGalleryItemPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function EditGalleryItemPage({
  params,
}: EditGalleryItemPageProps) {
  const { id } = await params;
  const item = await getGalleryItemById(id);

  if (!item) notFound();

  async function handleUpdate(formData: FormData): Promise<void> {
    "use server";
    await updateGalleryItem(id, formData);
  }

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-3xl w-full">
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Gallery Management
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">
            Edit Photo
          </h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted wrap-break-word">
            {item.title}
          </p>
        </div>

        <GalleryItemForm
          item={item}
          action={handleUpdate}
          cancelHref="/admin/gallery"
        />
      </div>
    </AdminShell>
  );
}
