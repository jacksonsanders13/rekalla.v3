import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function CaregiverLoading() {
  return (
    <div>
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-6 w-96" />
      </div>
      <div className="space-y-6">
        <CardSkeleton rows={2} />
        <CardSkeleton rows={2} />
      </div>
    </div>
  );
}
