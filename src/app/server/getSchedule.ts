"use server";

import { db } from "@/drizzle/db";

export async function getSchedules(userId: string) {
  const schedule = await db.query.ScheduleTable.findFirst({
    where: (schedule, { eq }) => eq(schedule.userId, userId),
    with: {
      availabilities: true,
    },
  });

  return schedule;
}
