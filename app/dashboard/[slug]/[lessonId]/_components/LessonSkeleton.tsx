import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <Skeleton className="aspect-video w-full rounded-lg" />

      <div className="py-4 border-b">
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <div className="space-y-3 pt-3">
        <Skeleton className="h-10 w-3/4" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-8/12" />
        </div>
      </div>
    </div>
  );
}
