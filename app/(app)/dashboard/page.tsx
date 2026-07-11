import type { Metadata } from "next";
import { requirePatient } from "@/lib/session";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = { title: "Home" };

export default async function DashboardPage() {
  const { user, profile } = await requirePatient();

  return (
    <DashboardView
      userId={user.id}
      displayName={profile?.full_name || user.email || "there"}
    />
  );
}
