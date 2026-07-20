import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Screen, Card, Button } from "../../components/ui";
import { ProfileEditor } from "../../components/profile-editor";
import { DeleteAccount } from "../../components/delete-account";

export default function CaregiverAccount() {
  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <Screen>
      <ProfileEditor fallbackName="Caregiver" />
      <Card>
        <Button label="Sign out" variant="secondary" onPress={signOut} />
      </Card>
      <DeleteAccount />
    </Screen>
  );
}
