import Link from "next/link";
import Image from "next/image";
import AdminShell from "@/component/admin/AdminShell";
import EmptyState from "@/component/UI/EmptyState";
import AdminDeleteButton from "@/component/admin/AdminDeleteButton";
import { getGalleryItems } from "@/lib/data";
import { deleteGalleryItem } from "@/app/actions/gallery";

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-6xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <div>
            <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
              Media &amp; Moments
            </span>
            <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">
              Gallery Photos
            </h1>
            <p className="mt-1 font-content text-xs sm:text-sm text-muted">
              {items.length} {items.length === 1 ? "photo" : "photos"} in portfolio · ordered by priority
            </p>
          </div>
          <Link
            href="/admin/gallery/new"
            className="font-content text-xs sm:text-sm font-bold bg-accent text-dark-one px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl hover:bg-accent-strong transition-colors text-center w-full sm:w-auto"
          >
            + Add Photo
          </Link>
        </div>

        {/* List / Grid */}
        {items.length === 0 ? (
          <EmptyState
            icon="🖼"
            title="No gallery photos yet"
            description="Upload photographs of your field work, events, speaking engagements, and initiatives."
            ctaLabel="Add your first photo"
            ctaHref="/admin/gallery/new"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border-2 border-dark-one/10 bg-white overflow-hidden shadow-2xs transition-all hover:border-accent hover:shadow-md"
              >
                <div>
                  {/* Photo Preview */}
                  <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="font-content rounded-md bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-dark-one shadow-xs">
                        {item.category}
                      </span>
                    </div>
                    {item.sortOrder !== undefined && item.sortOrder > 0 && (
                      <span className="absolute top-2.5 right-2.5 font-content rounded-md bg-dark-one/80 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-bold text-white">
                        #{item.sortOrder}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    {item.eventDate && (
                      <span className="font-content text-xs font-medium text-faint block mb-1">
                        {item.eventDate}
                      </span>
                    )}
                    <h2 className="font-header text-base sm:text-lg font-bold text-dark-one line-clamp-1">
                      {item.title}
                    </h2>
                    {item.caption && (
                      <p className="font-content text-xs sm:text-sm text-muted mt-1.5 line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-t border-dark-one/10 px-4 py-3 bg-light/50 flex items-center justify-between gap-3">
                  <Link
                    href={`/admin/gallery/${item.id}/edit`}
                    className="font-content text-xs font-bold text-dark-one hover:text-accent-strong transition-colors"
                  >
                    Edit Photo
                  </Link>

                  <AdminDeleteButton
                    itemId={item.id ?? ""}
                    itemTitle={item.title}
                    itemType="item"
                    onDelete={deleteGalleryItem}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
