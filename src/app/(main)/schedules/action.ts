"use server";

import { validateUserSession } from "@/auth";
import { db } from "@/drizzle/db";
import { ScheduleAvailabilityTable, ScheduleTable } from "@/drizzle/schema";
import { ScheduleFormSchemaType, scheduleSFormSchema } from "@/schema/schedule";
import { eq } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";

export async function createSchedule(
  scheduleData: ScheduleFormSchemaType
): Promise<{ error?: string; success?: boolean }> {
  const { user } = await validateUserSession();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { timezone, availabilities } = scheduleSFormSchema.parse(scheduleData);

  const scheduleResponse = await db
    .insert(ScheduleTable)
    .values({
      timezone,
      userId: user.id,
    })
    .onConflictDoUpdate({
      target: ScheduleTable.userId,
      set: { timezone },
    })
    .returning({ id: ScheduleTable.id });

  const statements: [BatchItem<"pg">] = [
    db
      .delete(ScheduleAvailabilityTable)
      .where(eq(ScheduleAvailabilityTable.scheduleId, scheduleResponse[0].id)),
  ];

  if (availabilities.length > 0) {
    statements.push(
      db.insert(ScheduleAvailabilityTable).values(
        availabilities.map((availability) => ({
          scheduleId: scheduleResponse[0].id,
          startTime: availability.startTime,
          endTime: availability.endTime,
          dayOfWeek: availability.dayOfWeek,
        }))
      )
    );
  }

  await db.batch(statements);

  return { success: true };
}
