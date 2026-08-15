import AdminShell from "@/component/admin/AdminShell";
import Skeleton from "@/component/UI/Skeleton";

export default function AdminNowLoading() {
  return (
    <AdminShell>
      <div className="px-8 py-10 max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-dark-one/10 pb-8 mb-8">
          <div>
            <Skeleton className="h-3 w-16" rounded="sm" />
            <Skeleton className="mt-2 h-10 w-32" rounded="md" />
            <Skeleton className="mt-2 h-4 w-36" rounded="sm" />
          </div>
          <Skeleton className="h-11 w-28" rounded="xl" />
        </div>

        {/* List Skeletons */}
        <div className="flex flex-col gap-4" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-dark-one/10 bg-white p-5 flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" rounded="sm" />
                <Skeleton className="h-3.5 w-24" rounded="sm" />
              </div>
              <Skeleton className="h-5 w-4/5 max-w-md" rounded="sm" />
              <Skeleton className="h-4 w-full" rounded="sm" />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
