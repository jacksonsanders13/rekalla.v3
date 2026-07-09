import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tones = {
  green: "bg-tint-green/15 text-tint-green",
  blue: "bg-tint-blue/15 text-tint-blue",
  teal: "bg-tint-teal/15 text-tint-teal",
  orange: "bg-tint-orange/15 text-tint-orange",
  pink: "bg-tint-pink/15 text-tint-pink",
  purple: "bg-tint-purple/15 text-tint-purple",
  yellow: "bg-tint-yellow/15 text-tint-yellow",
  red: "bg-tint-red/15 text-tint-red",
  gray: "bg-white/10 text-label-2",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone = "gray",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
