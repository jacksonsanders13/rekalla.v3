import { z } from "zod";

export const routineItemSchema = z.object({
  title: z
    .string()
    .min(1, "Please describe this part of the day.")
    .max(120, "That's a bit long — try something shorter."),
  period: z.enum(["morning", "afternoon", "evening"]),
  timeOfDay: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional()
    .or(z.literal("")),
});

export type RoutineItemValues = z.infer<typeof routineItemSchema>;
