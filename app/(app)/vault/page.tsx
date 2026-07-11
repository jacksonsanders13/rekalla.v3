import type { Metadata } from "next";
import { requirePatient } from "@/lib/session";
import { VaultView } from "@/components/vault/vault-view";

export const metadata: Metadata = { title: "Memory Vault" };

export default async function VaultPage() {
  const { user } = await requirePatient();

  return (
    <VaultView
      userId={user.id}
      canManage={false}
      description="People, doctors, medications, and important details — kept up to date by your caregiver."
    />
  );
}
