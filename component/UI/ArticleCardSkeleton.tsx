import { clsx } from "clsx";
import Skeleton from "@/component/UI/Skeleton";

export interface ArticleCardSkeletonProps {
  readonly className?: string;
}

export function ArticleCardSkeleton({ className }: ArticleCardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "flex flex-col overflow-hidden rounded-2xl border border-black/15 bg-light",
        className
      )}
    >
      {/* Image Skeleton */}
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <Skeleton className="h-full w-full" rounded="none" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        {/* Date & Read Time */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20" rounded="sm" />
          <Skeleton className="h-3 w-16" rounded="sm" />
        </div>

        {/* Title */}
        <div className="mt-1 flex flex-col gap-2">
          <Skeleton className="h-6 w-5/6" rounded="md" />
          <Skeleton className="h-6 w-2/3" rounded="md" />
        </div>

        {/* Excerpt */}
        <div className="mt-2 flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-full" rounded="sm" />
          <Skeleton className="h-4 w-full" rounded="sm" />
          <Skeleton className="h-4 w-4/5" rounded="sm" />
        </div>

        {/* CTA Link */}
        <div className="pt-3">
          <Skeleton className="h-4 w-28" rounded="sm" />
        </div>
      </div>
    </div>
  );
}

export default ArticleCardSkeleton;
