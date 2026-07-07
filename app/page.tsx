import Link from "next/link";
import {
  BellRing,
  CalendarCheck,
  HeartHandshake,
  BookOpen,
  Sunrise,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

const features = [
  {
    icon: BellRing,
    title: "Gentle reminders",
    description:
      "Medications, meals, appointments, and family calls — delivered calmly, never as an alarm bell.",
  },
  {
    icon: Sunrise,
    title: "Daily routines",
    description:
      "A simple morning-to-evening rhythm that brings structure and confidence to every day.",
  },
  {
    icon: BookOpen,
    title: "Memory vault",
    description:
      "Family, doctors, medications, and important dates — always one tap away when a name slips.",
  },
  {
    icon: LineChart,
    title: "Wellness check-ins",
    description:
      "A 30-second daily check-in for mood, sleep, and energy that reveals trends over time.",
  },
  {
    icon: HeartHandshake,
    title: "Caregiver connection",
    description:
      "Family members can set up reminders and quietly stay informed — without hovering.",
  },
  {
    icon: CalendarCheck,
    title: "Today, at a glance",
    description:
      "One clear page that answers the only question that matters: what's next today?",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-3" aria-label="Main">
          <Link
            href="/login"
            className="rounded-xl px-5 py-3 text-base font-medium text-sand-800 transition-colors hover:bg-sand-100"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-sage-600 px-5 py-3 text-base font-semibold text-white shadow-soft transition-all hover:bg-sage-700 hover:shadow-lifted"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pt-24">
          <p className="mx-auto mb-6 w-fit rounded-full border border-sage-200 bg-sage-50 px-4 py-1.5 text-sm font-medium text-sage-700 animate-fade-in">
            Memory support, designed with care
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-sand-950 text-balance sm:text-5xl animate-fade-up">
            Independence, with a little help remembering
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-sand-700 text-balance animate-fade-up [animation-delay:100ms]">
            Rekalla helps older adults stay on top of medications, routines,
            and the people they love — and keeps family caregivers gently in
            the loop.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up [animation-delay:200ms]">
            <Link
              href="/signup"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-sage-600 px-8 text-lg font-semibold text-white shadow-soft transition-all hover:bg-sage-700 hover:shadow-lifted"
            >
              Create your free account
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-sand-200 bg-white px-8 text-lg font-semibold text-sand-800 shadow-soft transition-all hover:border-sand-300 hover:shadow-lifted"
            >
              I already have an account
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="features-heading"
          className="border-t border-sand-100 bg-white/60 py-20"
        >
          <div className="mx-auto max-w-6xl px-6">
            <h2
              id="features-heading"
              className="font-display text-3xl font-medium text-sand-950"
            >
              Everything for the day ahead
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-sand-700">
              Six simple tools, one calm place. No clutter, no jargon, nothing
              to figure out.
            </p>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-sand-100 bg-white p-7 shadow-soft transition-shadow hover:shadow-lifted"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                    <feature.icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-sand-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-sand-700">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-medium text-sand-950 text-balance">
            Built for peace of mind — yours and theirs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-sand-700">
            Large text, clear buttons, and one thing at a time. Designed
            hand-in-hand with older adults, so it feels familiar from the very
            first day.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-sage-600 px-8 text-lg font-semibold text-white shadow-soft transition-all hover:bg-sage-700 hover:shadow-lifted"
          >
            Get started today
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-sand-100 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo size="sm" />
          <p className="text-sm text-sand-600">
            Rekalla is not a medical device and does not provide medical
            advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
