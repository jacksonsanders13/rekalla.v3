import type { NotificationChannel } from "@/types/database";

export interface NotificationPayload {
  /** The recipient's user id. */
  userId: string;
  title: string;
  body?: string | null;
  /** Channel-specific delivery details (device token, email, phone number). */
  metadata?: Record<string, unknown>;
}

export interface SendResult {
  ok: boolean;
  /** Provider message id, when the provider returns one. */
  providerId?: string;
  error?: string;
}

/**
 * One adapter per delivery channel. Swap the mock adapters in
 * `providers/` for real ones (Expo push, Resend, Twilio) without touching
 * anything else — the queue processor only knows this interface.
 */
export interface NotificationProvider {
  channel: NotificationChannel;
  /** Whether the provider has the config it needs (API keys, etc.). */
  isConfigured(): boolean;
  send(payload: NotificationPayload): Promise<SendResult>;
}
