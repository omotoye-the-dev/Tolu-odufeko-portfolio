import Container from "@/component/UI/Container";
import ProjectCardSkeleton from "@/component/UI/ProjectCardSkeleton";
import Skeleton from "@/component/UI/Skeleton";

export default function ProjectsLoading() {
  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        {/* Header Skeleton */}
        <div className="border-b border-dark-one/15 pb-10">
          <Skeleton className="h-4 w-24" rounded="sm" />
          <Skeleton className="mt-3 h-10 w-48 sm:w-64" rounded="md" />
          <Skeleton className="mt-4 h-5 w-full max-w-md" rounded="sm" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3" aria-hidden="true">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>

        {/* Project Grid Skeletons */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} featured={i === 0} />
          ))}
        </div>
      </Container>
    </div>
  );
}
