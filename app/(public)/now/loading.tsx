import Container from "@/component/UI/Container";
import Skeleton from "@/component/UI/Skeleton";

export default function NowLoading() {
  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        {/* Header Skeleton */}
        <div className="border-b border-dark-one/15 pb-10">
          <Skeleton className="h-4 w-32" rounded="sm" />
          <Skeleton className="mt-3 h-10 w-64 sm:w-80" rounded="md" />
          <Skeleton className="mt-4 h-5 w-full max-w-lg" rounded="sm" />
        </div>

        {/* Timeline Items List Skeleton */}
        <div className="mt-6 divide-y divide-dark-one/15" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-[200px_1fr] sm:gap-6 px-3 sm:px-4"
            >
              <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2">
                <Skeleton className="h-4 w-24" rounded="sm" />
                <Skeleton className="h-5 w-20" rounded="md" />
              </div>

              <div className="flex flex-col gap-2.5">
                <Skeleton className="h-7 w-3/4" rounded="md" />
                <Skeleton className="h-4 w-full" rounded="sm" />
                <Skeleton className="h-4 w-5/6" rounded="sm" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
