import { startOfDay } from "date-fns";
import { z } from "zod";

const baseSchema = z.object({
  startTime: z.date().min(new Date(), "Required"),
  guestEmail: z.string().email("Invalid Email Address").min(1, "Required"),
  guestName: z.string().min(1, "Required"),
  guestNotes: z.string().optional(),
  timezone: z.string().min(1, "Required"),
});

export const meetingFormSchema = z
  .object({
    date: z.date().min(startOfDay(new Date()), "Must be a future date"),
  })
  .merge(baseSchema);

export type MeetingFormSchemaType = z.infer<typeof meetingFormSchema>;

export const meetingActionSchema = z
  .object({
    eventId: z.string().min(1, "Required"),
    userId: z.string().min(1, "Required"),
  })
  .merge(baseSchema);

export type MeetingActionSchemaType = z.infer<typeof meetingActionSchema>;
