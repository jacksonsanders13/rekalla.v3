import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function RoutineLoading() {
  return (
    <div>
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-6 w-80" />
      </div>
      <CardSkeleton rows={5} />
    </div>
  );
}
