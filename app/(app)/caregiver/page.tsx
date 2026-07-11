import type { Metadata } from "next";
import { getSessionProfile } from "@/lib/session";
import { CaregiverHome } from "@/components/caregiver/caregiver-home";
import { PatientConnect } from "@/components/caregiver/patient-connect";

export const metadata: Metadata = { title: "Caregivers" };

export default async function CaregiverPage() {
  const { user, profile } = await getSessionProfile();

  if (profile?.account_type === "caregiver") {
    return <CaregiverHome caregiverId={user.id} />;
  }

  // Patient: show their connect code and connected caregivers.
  return (
    <PatientConnect
      patientId={user.id}
      connectCode={profile?.connect_code ?? "……"}
    />
  );
}
