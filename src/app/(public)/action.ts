"use server";

import { google as googleAuth } from "@/auth";
import { db } from "@/drizzle/db";
import { getValidTimesFromSchedule } from "@/lib/utils";
import { meetingActionSchema, MeetingActionSchemaType } from "@/schema/meeting";
import { redirect } from "next/navigation";
import { createGoogleCalendarEvent } from "../server/googleCalendar";

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
          googleRT: true,
        },
      },
    },
  });

  if (event == null || event.user.googleRT == null) {
    return { error: true };
  }

  const token = await googleAuth.refreshAccessToken(event.user.googleRT);

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
