import { clsx } from "clsx";
import Skeleton from "@/component/UI/Skeleton";

export interface ArticleRowSkeletonProps {
  readonly className?: string;
}

export function ArticleRowSkeleton({ className }: ArticleRowSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "grid grid-cols-1 gap-6 sm:grid-cols-[220px_1fr] md:grid-cols-[280px_1fr] items-center border-b border-black/15 py-6 sm:py-8",
        className
      )}
    >
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-black/10">
        <Skeleton className="h-full w-full" rounded="none" />
      </div>

      {/* Text Details Skeleton */}
      <div className="flex flex-col justify-center gap-2">
        {/* Date & Read Time */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-24" rounded="sm" />
          <Skeleton className="h-3 w-16" rounded="sm" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5 mt-1">
          <Skeleton className="h-6 w-3/4" rounded="md" />
        </div>

        {/* Excerpt */}
        <div className="flex flex-col gap-1.5 mt-1">
          <Skeleton className="h-4 w-full" rounded="sm" />
          <Skeleton className="h-4 w-5/6" rounded="sm" />
        </div>

        {/* Read More Link */}
        <div className="mt-1">
          <Skeleton className="h-4 w-28" rounded="sm" />
        </div>
      </div>
    </div>
  );
}

export default ArticleRowSkeleton;
