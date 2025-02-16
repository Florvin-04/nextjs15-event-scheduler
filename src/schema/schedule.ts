import { DAYS_OF_WEEK_IN_ORDER } from "@/lib/constants";
import { timeToInt } from "@/lib/utils";
import { z } from "zod";

export const scheduleSFormSchema = z.object({
  timezone: z.string().min(1, "Required"),
  availabilities: z
    .array(
      z.object({
        dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
        startTime: z
          .string()
          .regex(
            /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in 24h format (HH:MM)"
          ),
        endTime: z
          .string()
          .regex(
            /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in 24h format (HH:MM)"
          ),
      })
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((eachAvailability, eachAvailabilityIndex) => {
        const eachAvailabilityStartTime = timeToInt(eachAvailability.startTime);
        const eachAvailabilityEndTime = timeToInt(eachAvailability.endTime);

        const isOverlap = availabilities.some(
          (allAvailability, allAvailabilityIndex) => {
            const allAvailabilityStartTime = timeToInt(
              allAvailability.startTime
            );
            const allAvailabilityEndTime = timeToInt(allAvailability.endTime);

            return (
              eachAvailabilityIndex !== allAvailabilityIndex &&
              allAvailability.dayOfWeek === eachAvailability.dayOfWeek &&
              allAvailabilityStartTime < eachAvailabilityEndTime &&
              allAvailabilityEndTime > eachAvailabilityStartTime
            );
          }
        );

        if (isOverlap) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Availability overlaps with another",
            path: [eachAvailabilityIndex, "startTime"],
          });
        }

        if (eachAvailabilityStartTime >= eachAvailabilityEndTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start time must be before end time",
            path: [eachAvailabilityIndex, "startTime"],
          });
        }
      });
    }),
});

export type ScheduleFormSchemaType = z.infer<typeof scheduleSFormSchema>;

export type Availability = ScheduleFormSchemaType["availabilities"][number];
