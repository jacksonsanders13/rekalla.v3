"use client";

import { Check, Clock3, RotateCcw, AlarmClock } from "lucide-react";
import { REMINDER_CATEGORIES } from "@/lib/constants";
import { cn, formatTimeOfDay } from "@/lib/utils";
import type { ReminderOccurrence } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * A single reminder for today: what it is, when it's due, and the two big
 * actions that matter — Done and Snooze.
 */
export function OccurrenceCard({
  occurrence,
  onAction,
  busy,
  readOnly = false,
}: {
  occurrence: ReminderOccurrence;
  onAction?: (action: "complete" | "snooze" | "reopen") => void;
  busy?: boolean;
  readOnly?: boolean;
}) {
  const { reminder, status, event } = occurrence;
  const meta = REMINDER_CATEGORIES[reminder.category];
  const done = status === "completed";
  const snoozed = status === "snoozed";
  const overdue = status === "overdue";

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-5 shadow-soft transition-all",
        done ? "border-sand-100 opacity-70" : "border-sand-100 hover:shadow-lifted",
        overdue && "border-clay-100 bg-clay-50/40",
      )}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          done ? "bg-sage-100 text-sage-700" : "bg-sand-100 text-sand-600",
        )}
      >
        {done ? (
          <Check className="size-6" aria-hidden="true" />
        ) : (
          <meta.icon className="size-6" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-lg font-semibold text-sand-950",
            done && "line-through decoration-sand-400",
          )}
        >
          {reminder.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-sand-600">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-5" aria-hidden="true" />
            {formatTimeOfDay(reminder.time_of_day)}
          </span>
          <Badge tone={meta.tone}>{meta.label}</Badge>
          {overdue && !event && (
            <span className="font-medium text-clay-600">Still waiting</span>
          )}
          {snoozed && event?.snoozed_until && (
            <span className="font-medium text-honey-600">
              Snoozed until{" "}
              {new Date(event.snoozed_until).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        {reminder.description && !done && (
          <p className="mt-1.5 text-base text-sand-600">{reminder.description}</p>
        )}
      </div>

      {!readOnly && onAction && (
        <div className="flex w-full gap-2.5 sm:w-auto">
          {done ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => onAction("reopen")}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Undo
            </Button>
          ) : (
            <>
              <Button
                className="flex-1 sm:flex-none"
                disabled={busy}
                onClick={() => onAction("complete")}
              >
                <Check className="size-5" aria-hidden="true" />
                Done
              </Button>
              {!snoozed && (
                <Button
                  variant="secondary"
                  className="flex-1 sm:flex-none"
                  disabled={busy}
                  onClick={() => onAction("snooze")}
                >
                  <AlarmClock className="size-5" aria-hidden="true" />
                  Snooze
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </li>
  );
}
