import Container from "@/component/UI/Container";
import ArticleRowSkeleton from "@/component/UI/ArticleRowSkeleton";
import Skeleton from "@/component/UI/Skeleton";

export default function ArticlesLoading() {
  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        {/* Header Skeleton */}
        <div className="border-b border-dark-one/15 pb-10">
          <Skeleton className="h-4 w-32" rounded="sm" />
          <Skeleton className="mt-3 h-10 w-44 sm:w-56" rounded="md" />
          <Skeleton className="mt-4 h-5 w-full max-w-lg" rounded="sm" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="mt-8 max-w-xl">
          <Skeleton className="h-12 w-full" rounded="xl" />
        </div>

        {/* Tag Filters Skeleton */}
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3" aria-hidden="true">
          <Skeleton className="h-8 w-14" rounded="lg" />
          <Skeleton className="h-8 w-24" rounded="lg" />
          <Skeleton className="h-8 w-28" rounded="lg" />
          <Skeleton className="h-8 w-20" rounded="lg" />
        </div>

        {/* Article Rows List Skeletons */}
        <div className="mt-8 divide-y divide-black/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <ArticleRowSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
