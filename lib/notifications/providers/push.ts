import type { NotificationPayload, NotificationProvider, SendResult } from "../types";

/**
 * Push notifications, targeting the future Expo mobile app.
 *
 * Mock implementation: logs and reports success. To go live, exchange this
 * for a call to the Expo push API (https://exp.host/--/api/v2/push/send)
 * using device tokens stored in `metadata.pushToken`.
 */
export const pushProvider: NotificationProvider = {
  channel: "push",

  isConfigured() {
    return Boolean(process.env.EXPO_ACCESS_TOKEN);
  },

  async send(payload: NotificationPayload): Promise<SendResult> {
    console.info(
      `[notifications:push] (mock) → user ${payload.userId}: ${payload.title}`,
    );
    return { ok: true, providerId: `mock-push-${Date.now()}` };
  },
};
