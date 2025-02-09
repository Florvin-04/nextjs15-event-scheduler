import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "required field")
      .email("Inavlid Email Address"),

    firstName: z
      .string()
      .trim()
      .min(1, "required field")
      .regex(/^[a-zA-Z]+$/, "Must be an alphabet"),

    lastName: z
      .string()
      .trim()
      .min(1, "required field")
      .regex(/^[a-zA-Z]+$/, "Must be an alphabet"),

    password: z
      .string()
      .trim()
      .min(1, "required field")
      .min(8, "Must be at least 8 characters"),

    confirmPassword: z.string().trim().min(1, "required field"),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type signUpSchemaType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "required field")
    .email("Inavlid Email Address"),
  password: z.string().trim().min(1, "required field"),
  // .superRefine((val, ctx) => {
  //   if (!/[A-Z]/.test(val)) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: "At least one uppercase letter",
  //     });
  //   }
  //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: "At least one special character",
  //     });
  //   }
  // }),
});

export type signInSchemaType = z.infer<typeof signInSchema>;
