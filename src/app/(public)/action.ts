"use server";

import { db } from "@/drizzle/db";
import { meetingActionSchema, MeetingActionSchemaType } from "@/schema/meeting";
import { cookies } from "next/headers";
import { google as googleAuth } from "@/auth";
import { getValidTimesFromSchedule } from "@/lib/utils";
import { createGoogleCalendarEvent } from "../server/googleCalendar";
import { redirect } from "next/navigation";

export async function createMeeting(unsafeData: MeetingActionSchemaType) {
  const { success, data } = meetingActionSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true };
  }

  const event = await db.query.EventTable.findFirst({
    where: (event, { eq, and }) =>
      and(
        eq(event.id, data.eventId),
        eq(event.userId, data.userId),
        eq(event.isActive, true)
      ),

    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("Rtoken");

  const token = await googleAuth.refreshAccessToken(sessionCookie?.value || "");

  if (event == null) {
    return { error: true };
  }

  const validTimes = await getValidTimesFromSchedule({
    event: {
      durationInMinutes: event.duration,
      userId: event.userId,
    },
    timesInOrder: [data.startTime],
    token,
  });

  if (validTimes.length === 0) {
    return { error: true };
  }

  const eventPayload = {
    name: event.name,
    start: data.startTime,
    guestEmail: data.guestEmail,
    guestName: data.guestName,
    ownerEmail: event.user.email,
    ownerName: `${event.user.firstName} ${event.user.lastName}`,
    guestNotes: data.guestNotes,
    durationInMinutes: event.duration,
  };

  await createGoogleCalendarEvent({
    event: eventPayload,
    token,
  });

  redirect(`/book/${event.userId}`);
}
