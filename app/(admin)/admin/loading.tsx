import AdminShell from "@/component/admin/AdminShell";
import Skeleton from "@/component/UI/Skeleton";

export default function AdminDashboardLoading() {
  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-4xl w-full">
        {/* Header Skeleton */}
        <div className="border-b border-dark-one/10 pb-6 mb-8 sm:pb-8 sm:mb-10">
          <Skeleton className="h-3 w-20" rounded="sm" />
          <Skeleton className="mt-2 h-9 sm:h-10 w-48" rounded="md" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full" rounded="sm" />
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-dark-one/10 bg-white p-5 sm:p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" rounded="sm" />
                <Skeleton className="h-5 w-5" rounded="sm" />
              </div>
              <div>
                <Skeleton className="h-10 sm:h-12 w-16" rounded="md" />
                <Skeleton className="mt-2 h-3 w-20" rounded="sm" />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Skeleton className="h-3 w-16" rounded="sm" />
                <Skeleton className="h-7 w-24" rounded="lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Projects Skeleton */}
        <div className="mt-10 sm:mt-12">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 sm:h-7 w-40" rounded="md" />
            <Skeleton className="h-7 sm:h-8 w-16" rounded="xl" />
          </div>
          <div className="border-t border-dark-one/10">
            <div className="divide-y divide-dark-one/10">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-48 sm:w-64 max-w-full" rounded="sm" />
                    <Skeleton className="h-3 w-32 sm:w-40 max-w-full" rounded="sm" />
                  </div>
                  <Skeleton className="h-4 w-12" rounded="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
