import { z } from "zod";

export const vaultItemSchema = z.object({
  category: z.enum([
    "family",
    "contact",
    "doctor",
    "medication",
    "important_date",
    "emergency",
    "note",
  ]),
  title: z
    .string()
    .min(1, "Please give this a name.")
    .max(120, "That name is a bit long."),
  subtitle: z.string().max(160).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z
    .string()
    .email("That doesn't look like an email address.")
    .optional()
    .or(z.literal("")),
  address: z.string().max(240).optional().or(z.literal("")),
  dateValue: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  isPinned: z.boolean(),
});

export type VaultItemValues = z.infer<typeof vaultItemSchema>;
