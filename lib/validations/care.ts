import { z } from "zod";

export const inviteCaregiverSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter their email address.")
    .email("That doesn't look like an email address."),
  relationship: z
    .string()
    .max(60, "Keep the relationship short, like 'Daughter'.")
    .optional()
    .or(z.literal("")),
});

export type InviteCaregiverValues = z.infer<typeof inviteCaregiverSchema>;
