import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/session";
import { PatientManager } from "@/components/caregiver/patient-manager";

export const metadata: Metadata = { title: "Patient" };

export default async function ManagePatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patientId } = await params;
  const { user, profile } = await getSessionProfile();

  if (profile?.account_type !== "caregiver") {
    redirect("/caregiver");
  }

  // Confirm an active link exists (RLS only returns the row if it does).
  const supabase = await createClient();
  const { data: link } = await supabase
    .from("care_relationships")
    .select("id, profiles!care_relationships_patient_id_fkey(full_name)")
    .eq("caregiver_id", user.id)
    .eq("patient_id", patientId)
    .eq("status", "active")
    .maybeSingle();

  if (!link) {
    redirect("/caregiver");
  }

  const patientName =
    (link.profiles as unknown as { full_name: string } | null)?.full_name ?? "";

  return (
    <PatientManager
      caregiverId={user.id}
      patientId={patientId}
      patientName={patientName}
    />
  );
}
