import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { supabase } from "../../lib/supabase";
import { colors, font, spacing } from "../../lib/theme";
import { Screen, Card, Button, Field, Title, Subtitle } from "../../components/ui";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSend() {
    setError(null);
    if (!email.trim()) return setError("Please enter your email address.");
    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
    );
    setBusy(false);
    if (resetError) return setError(resetError.message);
    setSent(true);
  }

  return (
    <Screen>
      <Card>
        <Title>Reset your password</Title>
        {sent ? (
          <>
            <Subtitle>
              If an account exists for {email.trim()}, we&apos;ve sent a link to
              reset your password. Open the email on this phone and follow the
              link, then come back and log in.
            </Subtitle>
            <Link href="/(auth)/sign-in" asChild>
              <Button label="Back to log in" variant="secondary" />
            </Link>
          </>
        ) : (
          <>
            <Subtitle>
              Enter your email and we&apos;ll send you a link to set a new
              password.
            </Subtitle>

            {error && <Text style={styles.error}>{error}</Text>}

            <Field
              label="Email address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@example.com"
            />

            <Button label="Send reset link" loading={busy} onPress={handleSend} />

            <Link href="/(auth)/sign-in" asChild>
              <Pressable accessibilityRole="link" style={styles.link}>
                <Text style={styles.linkText}>Back to log in</Text>
              </Pressable>
            </Link>
          </>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.red, fontSize: font.base, fontWeight: "600" },
  link: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  linkText: { color: colors.label2, fontSize: font.base, fontWeight: "600" },
});
