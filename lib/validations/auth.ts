import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("That doesn't look like an email address."),
  password: z.string().min(1, "Please enter your password."),
});

export const signupSchema = z.object({
  accountType: z.enum(["patient", "caregiver"], {
    required_error: "Please choose which describes you.",
  }),
  fullName: z
    .string()
    .min(2, "Please enter your name.")
    .max(120, "That name is too long."),
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("That doesn't look like an email address."),
  password: z
    .string()
    .min(8, "Your password needs at least 8 characters."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("That doesn't look like an email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Your password needs at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The two passwords don't match.",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
