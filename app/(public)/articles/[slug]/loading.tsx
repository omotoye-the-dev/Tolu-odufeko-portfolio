import Container from "@/component/UI/Container";
import ArticleCardSkeleton from "@/component/UI/ArticleCardSkeleton";
import Skeleton from "@/component/UI/Skeleton";

export default function ArticleDetailLoading() {
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

        <div className="mx-auto max-w-3xl">
          {/* Tags */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" rounded="sm" />
            <Skeleton className="h-4 w-20" rounded="sm" />
          </div>

          {/* Title */}
          <div className="mt-4 flex flex-col gap-2">
            <Skeleton className="h-10 w-full" rounded="md" />
            <Skeleton className="h-10 w-3/4" rounded="md" />
          </div>

          {/* Date & Read time */}
          <div className="mt-4 flex items-center gap-3">
            <Skeleton className="h-4 w-28" rounded="sm" />
            <Skeleton className="h-4 w-20" rounded="sm" />
          </div>

          {/* Body Prose */}
          <div className="mt-10 space-y-4">
            <Skeleton className="h-5 w-full" rounded="sm" />
            <Skeleton className="h-5 w-full" rounded="sm" />
            <Skeleton className="h-5 w-4/5" rounded="sm" />
            <div className="pt-2" />
            <Skeleton className="h-5 w-full" rounded="sm" />
            <Skeleton className="h-5 w-full" rounded="sm" />
            <Skeleton className="h-5 w-5/6" rounded="sm" />
          </div>
        </div>
      </Container>

      {/* Related Articles Skeleton */}
      <section className="border-t border-dark-one/15 bg-white/40 py-12 sm:py-16">
        <Container>
          <Skeleton className="mb-8 h-8 w-48" rounded="md" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
