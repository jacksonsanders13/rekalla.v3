import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { WellnessView } from "@/components/wellness/wellness-view";

export const metadata: Metadata = { title: "Wellness" };

export default async function WellnessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <WellnessView userId={user!.id} />;
}
