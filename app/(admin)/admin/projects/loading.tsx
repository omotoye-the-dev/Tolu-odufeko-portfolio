import AdminShell from "@/component/admin/AdminShell";
import Skeleton from "@/component/UI/Skeleton";

export default function AdminProjectsLoading() {
  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-5xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <div>
            <Skeleton className="h-3 w-16" rounded="sm" />
            <Skeleton className="mt-2 h-9 sm:h-10 w-44" rounded="md" />
            <Skeleton className="mt-2 h-4 w-40" rounded="sm" />
          </div>
          <Skeleton className="h-10 sm:h-11 w-full sm:w-32" rounded="xl" />
        </div>

        {/* List Skeleton */}
        <div className="border-t border-dark-one/10" aria-hidden="true">
          <div className="divide-y divide-dark-one/10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 sm:py-5"
              >
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <Skeleton className="h-5 w-3/5 max-w-md" rounded="sm" />
                  <Skeleton className="h-3.5 w-1/3 max-w-xs" rounded="sm" />
                  <div className="flex gap-1.5 mt-1">
                    <Skeleton className="h-5 w-16" rounded="sm" />
                    <Skeleton className="h-5 w-20" rounded="sm" />
                    <Skeleton className="h-5 w-14" rounded="sm" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-10" rounded="sm" />
                  <Skeleton className="h-4 w-10" rounded="sm" />
                  <Skeleton className="h-4 w-12" rounded="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
