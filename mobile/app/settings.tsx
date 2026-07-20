import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { Screen, Card, Button } from "../components/ui";
import { ProfileEditor } from "../components/profile-editor";
import { DeleteAccount } from "../components/delete-account";

/** Shared settings screen (patients reach it from the Summary header). */
export default function Settings() {
  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <Screen>
      <ProfileEditor fallbackName="You" />
      <Card>
        <Button label="Sign out" variant="secondary" onPress={signOut} />
      </Card>
      <DeleteAccount />
    </Screen>
  );
}
