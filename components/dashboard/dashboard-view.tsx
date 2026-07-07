"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BellRing,
  BookOpen,
  CalendarCheck,
  Check,
  HeartPulse,
  Plus,
  Sunrise,
} from "lucide-react";
import {
  occurrencesFor,
  openOccurrences,
  completionSummary,
} from "@/lib/reminders";
import { MOOD_SCALE } from "@/lib/constants";
import { cn, greetingFor, firstName, toDateKey, formatTimeOfDay } from "@/lib/utils";
import {
  useReminders,
  useReminderEvents,
  useRecordReminderEvent,
} from "@/hooks/use-reminders";
import { useRoutineItems, useRoutineCompletions } from "@/hooks/use-routine";
import { useWellnessEntries } from "@/hooks/use-wellness";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { OccurrenceCard } from "@/components/reminders/occurrence-card";

const QUICK_ACTIONS = [
  {
    href: "/reminders",
    label: "Add a reminder",
    icon: Plus,
    tone: "bg-sage-100 text-sage-700",
  },
  {
    href: "/wellness",
    label: "Daily check-in",
    icon: HeartPulse,
    tone: "bg-clay-100 text-clay-600",
  },
  {
    href: "/vault",
    label: "Look someone up",
    icon: BookOpen,
    tone: "bg-sky-100 text-sky-600",
  },
  {
    href: "/routine",
    label: "My routine",
    icon: Sunrise,
    tone: "bg-honey-100 text-honey-600",
  },
];

function SectionLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-base font-semibold text-sage-700 transition-colors hover:bg-sage-50"
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

export function DashboardView({
  userId,
  displayName,
}: {
  userId: string;
  displayName: string;
}) {
  const todayKey = toDateKey();
  const now = new Date();
  const toast = useToast();

  const reminders = useReminders(userId);
  const events = useReminderEvents(userId, todayKey);
  const recordEvent = useRecordReminderEvent(userId, todayKey);
  const routineItems = useRoutineItems(userId);
  const routineDone = useRoutineCompletions(userId, todayKey);
  const wellness = useWellnessEntries(userId, 7);

  const occurrences = useMemo(
    () => occurrencesFor(reminders.data ?? [], events.data ?? [], todayKey),
    [reminders.data, events.data, todayKey],
  );
  const open = openOccurrences(occurrences);
  const summary = completionSummary(occurrences);

  const upcoming = useMemo(() => {
    const list: { title: string; when: string }[] = [];
    for (let offset = 1; offset <= 7 && list.length < 3; offset++) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const key = toDateKey(date);
      for (const occurrence of occurrencesFor(reminders.data ?? [], [], key)) {
        if (list.length >= 3) break;
        list.push({
          title: occurrence.reminder.title,
          when: `${
            offset === 1
              ? "Tomorrow"
              : date.toLocaleDateString("en-US", { weekday: "long" })
          } at ${formatTimeOfDay(occurrence.reminder.time_of_day)}`,
        });
      }
    }
    return list;
  }, [reminders.data]);

  const routineTotal = routineItems.data?.length ?? 0;
  const routineDoneIds = new Set(
    (routineDone.data ?? []).map((c) => c.routine_item_id),
  );
  const routineDoneCount = (routineItems.data ?? []).filter((i) =>
    routineDoneIds.has(i.id),
  ).length;
  const nextRoutine = (routineItems.data ?? []).filter(
    (i) => !routineDoneIds.has(i.id),
  );

  const todayEntry = (wellness.data ?? []).find(
    (e) => e.entry_date === todayKey,
  );
  const todayMood = todayEntry?.mood
    ? MOOD_SCALE.find((m) => m.value === todayEntry.mood)
    : undefined;

  const loading = reminders.isLoading || events.isLoading;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <header className="animate-fade-up">
        <p className="text-lg text-sand-600">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight text-sand-950">
          {greetingFor(now)}, {firstName(displayName)}
        </h1>
        {!loading && (
          <p className="mt-2 text-lg text-sand-600">
            {summary.total === 0
              ? "Nothing on the schedule today — enjoy it."
              : summary.done === summary.total
                ? "Everything on today's list is done. Wonderful!"
                : `${summary.done} of ${summary.total} things done so far today.`}
          </p>
        )}
      </header>

      {/* Quick actions */}
      <section aria-label="Quick actions" className="animate-fade-up [animation-delay:60ms]">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="flex min-h-24 flex-col justify-between gap-2 rounded-2xl border border-sand-100 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl",
                    action.tone,
                  )}
                >
                  <action.icon className="size-6" aria-hidden="true" />
                </span>
                <span className="text-base font-semibold text-sand-900">
                  {action.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Today's schedule */}
      <section
        aria-labelledby="today-heading"
        className="animate-fade-up [animation-delay:120ms]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="today-heading" className="text-2xl font-semibold text-sand-950">
            Today&apos;s schedule
          </h2>
          <SectionLink href="/reminders">All reminders</SectionLink>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : open.length === 0 ? (
          <div className="flex items-center gap-4 rounded-2xl border border-sage-200 bg-sage-50 p-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-sage-600 text-white">
              <Check className="size-6" aria-hidden="true" />
            </div>
            <p className="text-lg font-medium text-sage-900">
              {summary.total === 0
                ? "No reminders scheduled for today."
                : "All caught up — nothing waiting on you right now."}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {open.slice(0, 4).map((occurrence) => (
              <OccurrenceCard
                key={occurrence.reminder.id}
                occurrence={occurrence}
                busy={recordEvent.isPending}
                onAction={(action) =>
                  recordEvent.mutate(
                    { reminderId: occurrence.reminder.id, action },
                    {
                      onSuccess: () => {
                        if (action === "complete") toast("Nicely done!");
                        if (action === "snooze")
                          toast("Snoozed for 30 minutes.", "info");
                      },
                      onError: () =>
                        toast("Something went wrong. Please try again.", "error"),
                    },
                  )
                }
              />
            ))}
            {open.length > 4 && (
              <li className="text-center">
                <SectionLink href="/reminders">
                  {`${open.length - 4} more on the full list`}
                </SectionLink>
              </li>
            )}
          </ul>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Routine progress */}
        <Card className="animate-fade-up [animation-delay:180ms]">
          <CardHeader
            title="Daily routine"
            action={<SectionLink href="/routine">Open</SectionLink>}
          />
          <CardBody>
            {routineItems.isLoading ? (
              <Skeleton className="h-24" />
            ) : routineTotal === 0 ? (
              <p className="text-base text-sand-600">
                Build a simple morning-to-evening routine to bring structure to
                the day.
              </p>
            ) : (
              <>
                <div
                  role="progressbar"
                  aria-valuenow={routineDoneCount}
                  aria-valuemin={0}
                  aria-valuemax={routineTotal}
                  aria-label={`Routine progress: ${routineDoneCount} of ${routineTotal} done`}
                  className="h-3 overflow-hidden rounded-full bg-sand-100"
                >
                  <div
                    className="h-full rounded-full bg-sage-600 transition-all duration-500"
                    style={{
                      width: `${routineTotal ? (routineDoneCount / routineTotal) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-2.5 text-base font-medium text-sand-700">
                  {routineDoneCount} of {routineTotal} done
                </p>
                {nextRoutine.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {nextRoutine.slice(0, 3).map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 text-base text-sand-800"
                      >
                        <span
                          className="size-2 shrink-0 rounded-full bg-sand-300"
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.title}</span>
                        {item.time_of_day && (
                          <span className="ml-auto shrink-0 text-sm text-sand-500">
                            {formatTimeOfDay(item.time_of_day)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </CardBody>
        </Card>

        {/* Wellness summary */}
        <Card className="animate-fade-up [animation-delay:240ms]">
          <CardHeader
            title="Wellness"
            action={<SectionLink href="/wellness">Open</SectionLink>}
          />
          <CardBody>
            {wellness.isLoading ? (
              <Skeleton className="h-24" />
            ) : todayEntry ? (
              <div className="space-y-3">
                {todayMood && (
                  <p className="flex items-center gap-3 text-lg text-sand-800">
                    <span className="text-3xl" aria-hidden="true">
                      {todayMood.emoji}
                    </span>
                    Feeling {todayMood.label.toLowerCase()} today
                  </p>
                )}
                <dl className="grid grid-cols-2 gap-3 text-base">
                  {todayEntry.sleep_hours != null && (
                    <div className="rounded-xl bg-sand-50 p-3">
                      <dt className="text-sm text-sand-500">Sleep</dt>
                      <dd className="font-semibold text-sand-900">
                        {Number(todayEntry.sleep_hours)} hours
                      </dd>
                    </div>
                  )}
                  {todayEntry.energy != null && (
                    <div className="rounded-xl bg-sand-50 p-3">
                      <dt className="text-sm text-sand-500">Energy</dt>
                      <dd className="font-semibold text-sand-900">
                        {todayEntry.energy} of 5
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ) : (
              <div>
                <p className="text-base text-sand-600">
                  You haven&apos;t checked in yet today. It takes about 30
                  seconds.
                </p>
                <Link
                  href="/wellness"
                  className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-sage-600 px-5 text-base font-semibold text-white shadow-soft transition-colors hover:bg-sage-700"
                >
                  <HeartPulse className="size-5" aria-hidden="true" />
                  Check in now
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Upcoming */}
        <Card className="animate-fade-up [animation-delay:300ms]">
          <CardHeader
            title="Coming up"
            action={<SectionLink href="/reminders">Open</SectionLink>}
          />
          <CardBody>
            {reminders.isLoading ? (
              <Skeleton className="h-24" />
            ) : upcoming.length === 0 ? (
              <p className="flex items-start gap-3 text-base text-sand-600">
                <CalendarCheck
                  className="mt-0.5 size-5 shrink-0 text-sand-400"
                  aria-hidden="true"
                />
                Nothing scheduled for the next few days.
              </p>
            ) : (
              <ul className="space-y-3.5">
                {upcoming.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <BellRing
                      className="mt-1 size-5 shrink-0 text-sand-400"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-sand-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-sand-500">{item.when}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
