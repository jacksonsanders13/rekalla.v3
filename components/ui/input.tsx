import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const inputClasses =
  "block w-full min-h-13 rounded-xl border border-sand-200 bg-white px-4 py-3 text-base text-sand-950 shadow-sm transition-colors placeholder:text-sand-400 hover:border-sand-300 focus:border-sage-500 focus:outline-none focus:ring-[3px] focus:ring-sage-500/25 disabled:cursor-not-allowed disabled:bg-sand-100 aria-[invalid=true]:border-clay-500 aria-[invalid=true]:focus:ring-clay-500/25";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(inputClasses, className)} {...props} />;
});
