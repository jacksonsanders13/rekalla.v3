import { z } from "zod";

export const reminderSchema = z
  .object({
    title: z
      .string()
      .min(1, "Please give this reminder a name.")
      .max(120, "That title is a bit long — try something shorter."),
    description: z.string().max(500).optional().or(z.literal("")),
    category: z.enum([
      "medication",
      "meals",
      "appointments",
      "exercise",
      "family_calls",
      "custom",
    ]),
    timeOfDay: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Please choose a time."),
    recurrence: z.enum(["once", "daily", "weekly", "monthly"]),
    daysOfWeek: z.array(z.number().int().min(0).max(6)),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date."),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => data.recurrence !== "weekly" || data.daysOfWeek.length > 0,
    {
      message: "Pick at least one day of the week.",
      path: ["daysOfWeek"],
    },
  )
  .refine(
    (data) => !data.endDate || data.endDate >= data.startDate,
    {
      message: "The end date can't be before the start date.",
      path: ["endDate"],
    },
  );

export type ReminderValues = z.infer<typeof reminderSchema>;
