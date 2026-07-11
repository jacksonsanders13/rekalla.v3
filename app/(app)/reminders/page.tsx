import type { Metadata } from "next";
import { requirePatient } from "@/lib/session";
import { RemindersView } from "@/components/reminders/reminders-view";

export const metadata: Metadata = { title: "Reminders" };

export default async function RemindersPage() {
  const { user } = await requirePatient();

  // Patients view and complete reminders; a caregiver adds and edits them.
  return (
    <RemindersView
      userId={user.id}
      actorId={user.id}
      canManage={false}
      description="Check things off as you go. Your caregiver keeps this list up to date."
    />
  );
}
