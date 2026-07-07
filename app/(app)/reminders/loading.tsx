import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function RemindersLoading() {
  return (
    <div>
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-6 w-80" />
      </div>
      <Skeleton className="mb-6 h-14 w-72 rounded-2xl" />
      <CardSkeleton rows={4} />
    </div>
  );
}
