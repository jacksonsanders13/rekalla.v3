import { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { colors, font, radius, spacing } from "../lib/theme";
import { Card, Button } from "./ui";

/**
 * Permanent account deletion, required by the App Store for any app with
 * sign-up. Two steps: open the panel, then type DELETE to arm the button.
 */
export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const armed = confirmText.trim().toUpperCase() === "DELETE";

  async function handleDelete() {
    if (!armed || busy) return;
    setBusy(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc("delete_my_account");
    if (rpcError) {
      setBusy(false);
      setError(
        "We couldn't delete your account just now. Please try again, or contact us if it keeps happening.",
      );
      return;
    }
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-up");
  }

  if (!open) {
    return (
      <Button
        label="Delete my account"
        variant="ghost"
        onPress={() => setOpen(true)}
      />
    );
  }

  return (
    <Card>
      <Text style={styles.title}>Delete this account?</Text>
      <Text style={styles.body}>
        This permanently erases your account and everything in it — reminders,
        routine, memory bank, wellness history, and caregiver connections. It
        cannot be undone.
      </Text>
      <Text style={styles.body}>
        To continue, type <Text style={styles.strong}>DELETE</Text> below.
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        value={confirmText}
        onChangeText={setConfirmText}
        autoCapitalize="characters"
        autoCorrect={false}
        placeholder="Type DELETE"
        placeholderTextColor={colors.label4}
        style={styles.input}
        accessibilityLabel="Type DELETE to confirm"
      />
      <Button
        label="Permanently delete my account"
        variant="danger"
        loading={busy}
        disabled={!armed}
        style={!armed ? styles.disabled : undefined}
        onPress={handleDelete}
      />
      <Button
        label="Keep my account"
        variant="secondary"
        onPress={() => {
          setOpen(false);
          setConfirmText("");
          setError(null);
        }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.red, fontSize: font.xl, fontWeight: "700" },
  body: { color: colors.label2, fontSize: font.base, lineHeight: 24 },
  strong: { fontWeight: "700", color: colors.label },
  error: { color: colors.red, fontSize: font.base, fontWeight: "600" },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.elev2,
    color: colors.label,
    paddingHorizontal: spacing(4),
    fontSize: font.base,
    letterSpacing: 2,
  },
  disabled: { opacity: 0.4 },
});
