import Container from "@/component/UI/Container";
import Skeleton from "@/component/UI/Skeleton";

export default function GalleryLoading() {
  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        {/* Header Skeleton */}
        <div className="border-b border-dark-one/15 pb-10">
          <Skeleton className="h-4 w-28" rounded="sm" />
          <Skeleton className="mt-3 h-10 w-48 sm:w-64" rounded="md" />
          <Skeleton className="mt-4 h-5 w-full max-w-lg" rounded="sm" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:gap-3" aria-hidden="true">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>

        {/* Gallery Grid Skeletons */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-dark-one/10 bg-white"
            >
              <Skeleton className="aspect-4/3 w-full" rounded="none" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-5 w-3/4" rounded="sm" />
                <Skeleton className="h-4 w-full" rounded="sm" />
                <Skeleton className="h-3 w-1/4" rounded="sm" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
