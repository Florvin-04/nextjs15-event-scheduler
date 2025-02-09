import { z } from "zod";

export const eventFormSchemaZod = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1).optional(),
  isActive: z.boolean().default(true),
  duration: z.coerce
    .number()
    .int()
    .positive("Duration must be greater than zero(0)")
    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),
});

export type EventFormSchemaType = z.infer<typeof eventFormSchemaZod>;
