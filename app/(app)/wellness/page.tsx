import type { Metadata } from "next";
import { requirePatient } from "@/lib/session";
import { WellnessView } from "@/components/wellness/wellness-view";

export const metadata: Metadata = { title: "Wellness" };

export default async function WellnessPage() {
  const { user } = await requirePatient();

  // Wellness stays fully patient-controlled — it's their own daily check-in.
  return <WellnessView userId={user.id} />;
}
