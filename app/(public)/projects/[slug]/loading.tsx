import Container from "@/component/UI/Container";
import ProjectCardSkeleton from "@/component/UI/ProjectCardSkeleton";
import Skeleton from "@/component/UI/Skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="w-full">
      {/* Banner Image Skeleton */}
      <div className="relative aspect-video sm:aspect-21/9 max-h-120 w-full overflow-hidden border-b border-dark-one/15">
        <Skeleton className="h-full w-full" rounded="none" />
      </div>

      <Container className="py-10 sm:py-14">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-3 w-16" rounded="sm" />
          <Skeleton className="h-3 w-4" rounded="sm" />
          <Skeleton className="h-3 w-32" rounded="sm" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div>
            {/* Category tags */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" rounded="sm" />
              <Skeleton className="h-4 w-16" rounded="sm" />
            </div>

            {/* Title */}
            <div className="mt-4 flex flex-col gap-2">
              <Skeleton className="h-10 w-full sm:w-4/5" rounded="md" />
              <Skeleton className="h-10 w-2/3" rounded="md" />
            </div>

            {/* Date */}
            <Skeleton className="mt-3 h-4 w-28" rounded="sm" />

            {/* Body paragraphs */}
            <div className="mt-8 space-y-4">
              <Skeleton className="h-5 w-full" rounded="sm" />
              <Skeleton className="h-5 w-full" rounded="sm" />
              <Skeleton className="h-5 w-5/6" rounded="sm" />
              <div className="pt-2" />
              <Skeleton className="h-5 w-full" rounded="sm" />
              <Skeleton className="h-5 w-full" rounded="sm" />
              <Skeleton className="h-5 w-4/5" rounded="sm" />
            </div>

            {/* Button */}
            <div className="mt-10">
              <Skeleton className="h-12 w-40" rounded="md" />
            </div>
          </div>

          {/* Sidebar Tech Stack */}
          <aside className="lg:border-l lg:border-black/15 lg:pl-8">
            <Skeleton className="h-4 w-24" rounded="sm" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </aside>
        </div>
      </Container>

      {/* Related Projects Section Skeleton */}
      <section className="border-t border-dark-one/15 bg-white/40 py-12 sm:py-16">
        <Container>
          <Skeleton className="mb-8 h-8 w-48" rounded="md" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
