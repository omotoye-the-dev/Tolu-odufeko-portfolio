import { clsx } from "clsx";
import Skeleton from "@/component/UI/Skeleton";

export interface ProjectCardSkeletonProps {
  readonly className?: string;
  readonly featured?: boolean;
}

export function ProjectCardSkeleton({
  className,
  featured = false,
}: ProjectCardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "flex flex-col overflow-hidden rounded-2xl border bg-light",
        featured
          ? "border-accent border-l-4 shadow-xs"
          : "border-black/15",
        className
      )}
    >
      {/* Image Skeleton */}
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <Skeleton className="h-full w-full" rounded="none" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Categories */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" rounded="sm" />
            <Skeleton className="h-4 w-20" rounded="sm" />
          </div>

          {/* Title */}
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton className="h-6 w-4/5" rounded="md" />
            <Skeleton className="h-6 w-3/5" rounded="md" />
          </div>

          {/* Excerpt */}
          <div className="mt-3 flex flex-col gap-1.5">
            <Skeleton className="h-4 w-full" rounded="sm" />
            <Skeleton className="h-4 w-full" rounded="sm" />
            <Skeleton className="h-4 w-3/4" rounded="sm" />
          </div>
        </div>

        {/* CTA Link */}
        <div className="pt-6">
          <Skeleton className="h-4 w-32" rounded="sm" />
        </div>
      </div>
    </div>
  );
}

export default ProjectCardSkeleton;
