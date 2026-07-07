"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal built on the native <dialog> element, which gives us focus trapping,
 * Escape-to-close, and correct screen-reader semantics for free.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        // Clicks on the backdrop land on the <dialog> element itself.
        if (event.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
      className={cn(
        "m-auto w-[calc(100vw-2rem)] max-w-lg rounded-3xl bg-white p-0 shadow-lifted backdrop:bg-sand-950/40 backdrop:backdrop-blur-sm",
        "open:animate-scale-in",
        className,
      )}
    >
      <div className="max-h-[85dvh] overflow-y-auto p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="dialog-title"
              className="font-display text-2xl font-medium text-sand-950"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 text-base text-sand-600">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sand-500 transition-colors hover:bg-sand-100 hover:text-sand-800"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
