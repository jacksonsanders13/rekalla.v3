import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-sand-200 bg-sand-50/50 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
        <Icon className="size-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-sand-950">{title}</h3>
      <p className="mt-2 max-w-sm text-base text-sand-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
