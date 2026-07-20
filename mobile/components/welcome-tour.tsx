import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSession } from "../lib/session";
import { colors, font, radius, spacing } from "../lib/theme";

const VERSION = "v1";
const keyFor = (userId: string) => `rekalla:welcome-seen:${VERSION}:${userId}`;

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}

const PATIENT_SLIDES: Slide[] = [
  {
    icon: "sunny-outline",
    title: "Welcome to Rekalla",
    body: "A calm, simple place to keep track of your day — reminders, a daily routine, and the people who matter.",
  },
  {
    icon: "checkmark-circle-outline",
    title: "Your day at a glance",
    body: "The Summary screen shows what's coming up and how your day is going. Tap Done on a reminder once you've handled it.",
  },
  {
    icon: "heart-outline",
    title: "Let family help",
    body: "Tap the heart icon at the top to see your connect code. Share it with a family member so they can help set things up for you.",
  },
];

const CAREGIVER_SLIDES: Slide[] = [
  {
    icon: "people-outline",
    title: "Welcome to Rekalla",
    body: "Help someone you care for stay on top of their day — right from your own phone.",
  },
  {
    icon: "key-outline",
    title: "Connect with a code",
    body: "Ask your loved one to open Rekalla and read you their 6-letter connect code. Enter it on the People screen — no shared passwords.",
  },
  {
    icon: "create-outline",
    title: "Set up their day",
    body: "Add reminders, build a daily routine, and fill their Memory Vault with people and photos. It appears on their phone instantly.",
  },
];

/**
 * A short, one-time walkthrough shown the first time someone signs in.
 * `enabled` is passed once the terms gate is resolved, so the tour never
 * competes with the terms screen for the foreground.
 */
export function WelcomeTour({ enabled }: { enabled: boolean }) {
  const { session, profile, loading } = useSession();
  const userId = session?.user.id;

  const [checked, setChecked] = useState(false);
  const [seen, setSeen] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (loading) return;
    if (!userId) {
      setChecked(false);
      setStep(0);
      return;
    }
    AsyncStorage.getItem(keyFor(userId)).then((value) => {
      if (cancelled) return;
      setSeen(value === "1");
      setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, loading]);

  const slides =
    profile?.account_type === "caregiver" ? CAREGIVER_SLIDES : PATIENT_SLIDES;
  const isLast = step >= slides.length - 1;
  const slide = slides[step];

  async function finish() {
    if (userId) await AsyncStorage.setItem(keyFor(userId), "1");
    setSeen(true);
  }

  const visible = enabled && Boolean(userId) && checked && !seen;

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.screen}>
          <Pressable
            accessibilityRole="button"
            onPress={finish}
            style={styles.skip}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>

          <View style={styles.body}>
            <View style={styles.iconWrap}>
              <Ionicons name={slide.icon} size={56} color={colors.label} />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.body}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.dots}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === step && styles.dotActive]}
                />
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => (isLast ? finish() : setStep((s) => s + 1))}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.buttonText}>
                {isLast ? "Get started" : "Next"}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.base, padding: spacing(6) },
  skip: { alignSelf: "flex-end", minHeight: 44, justifyContent: "center", paddingHorizontal: spacing(2) },
  skipText: { color: colors.label3, fontSize: font.base, fontWeight: "600" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing(5) },
  iconWrap: {
    width: 112,
    height: 112,
    borderRadius: 32,
    backgroundColor: colors.elev1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.label,
    fontSize: font.x2,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  text: {
    color: colors.label3,
    fontSize: font.lg,
    lineHeight: 27,
    textAlign: "center",
    maxWidth: 340,
  },
  footer: { gap: spacing(5) },
  dots: { flexDirection: "row", gap: spacing(2), justifyContent: "center" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.elev3,
  },
  dotActive: { backgroundColor: colors.label, width: 22 },
  button: {
    minHeight: 54,
    borderRadius: radius.md,
    backgroundColor: colors.label,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#000000", fontSize: font.base, fontWeight: "700" },
});
