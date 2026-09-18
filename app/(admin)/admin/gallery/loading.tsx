import AdminShell from "@/component/admin/AdminShell";
import Skeleton from "@/component/UI/Skeleton";

export default function AdminGalleryLoading() {
  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <div>
            <Skeleton className="h-3 w-16" rounded="sm" />
            <Skeleton className="mt-2 h-10 w-36" rounded="md" />
            <Skeleton className="mt-2 h-4 w-44" rounded="sm" />
          </div>
          <Skeleton className="h-11 w-32" rounded="xl" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 flex flex-col gap-3"
            >
              <Skeleton className="aspect-4/3 w-full" rounded="xl" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" rounded="sm" />
                <Skeleton className="h-3 w-16" rounded="sm" />
              </div>
              <Skeleton className="h-5 w-4/5" rounded="sm" />
              <Skeleton className="h-4 w-full" rounded="sm" />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
