import type { NotificationPayload, NotificationProvider, SendResult } from "../types";

/**
 * Email notifications.
 *
 * Mock implementation: logs and reports success. To go live, exchange this
 * for a Resend (or similar) API call using `metadata.email` as the
 * recipient address.
 */
export const emailProvider: NotificationProvider = {
  channel: "email",

  isConfigured() {
    return Boolean(process.env.RESEND_API_KEY);
  },

  async send(payload: NotificationPayload): Promise<SendResult> {
    console.info(
      `[notifications:email] (mock) → user ${payload.userId}: ${payload.title}`,
    );
    return { ok: true, providerId: `mock-email-${Date.now()}` };
  },
};
