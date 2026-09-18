import AdminShell from "@/component/admin/AdminShell";
import GalleryItemForm from "@/component/admin/GalleryItemForm";
import { createGalleryItem } from "@/app/actions/gallery";

export default function NewGalleryItemPage() {
  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-3xl w-full">
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Gallery Management
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">
            Upload Photo
          </h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted">
            Add a new photograph, event moment, or engineering milestone to your public gallery.
          </p>
        </div>

        <GalleryItemForm
          action={createGalleryItem}
          cancelHref="/admin/gallery"
        />
      </div>
    </AdminShell>
  );
}
