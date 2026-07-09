import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-elev-1 p-7 sm:p-9">
      <h1 className="text-3xl font-bold tracking-tight text-label">{title}</h1>
      <p className="mt-2 text-base text-label-3">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl bg-tint-red/15 px-4 py-3.5"
    >
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-tint-red" aria-hidden="true" />
      <p className="text-base font-medium text-tint-red">{message}</p>
    </div>
  );
}
