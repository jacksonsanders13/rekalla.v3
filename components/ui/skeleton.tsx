import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton", className)} />;
}

/** Generic card-shaped loading placeholder used by route loading.tsx files. */
export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-3xl bg-elev-1 p-6">
      <Skeleton className="h-6 w-44 bg-elev-2" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full bg-elev-2" />
        ))}
      </div>
    </div>
  );
}
