import type { ReactNode } from "react";

/** iOS large-title header used at the top of every app page. */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 animate-fade-up">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-label-3">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-label">
          {title}
        </h1>
        {action}
      </div>
      {description && (
        <p className="mt-1.5 max-w-xl text-base text-label-3">{description}</p>
      )}
    </div>
  );
}
