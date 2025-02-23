"use server";

import { GOOGLE_URL_CALLBACK } from "@/auth";
import { CONFIG_APP } from "@/config";
import { google } from "googleapis";

import { addMinutes, endOfDay, startOfDay } from "date-fns";
import { OAuth2Tokens } from "arctic";

export async function getGoogleCalendarEvents({
  token,
  startDate,
  endDate,
}: {
  token: OAuth2Tokens;
  startDate: Date;
  endDate: Date;
}) {
  const OAuthClient = await getOAuthClient(token);

  const calendar = google.calendar({ version: "v3", auth: OAuthClient });

  const events = await calendar.events.list({
    calendarId: "primary",
    singleEvents: true,
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    maxResults: 2500,
    auth: OAuthClient,
  });

  const AllEvents =
    events.data.items
      ?.map((event) => {
        if (event.start?.date != null && event.end?.date != null) {
          return {
            start: startOfDay(event.start.date),
            end: endOfDay(event.end.date),
          };
        }
        if (event.start?.dateTime != null && event.end?.dateTime != null) {
          return {
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
          };
        }
      })
      .filter((date) => date != null) || [];

  return AllEvents;
}

async function getOAuthClient(token: OAuth2Tokens) {
  const client = new google.auth.OAuth2(
    CONFIG_APP.env.GOOGLE_CLIENT_ID!,
    CONFIG_APP.env.GOOGLE_CLIENT_SECRET!,
    `${CONFIG_APP.env.NEXT_PUBLIC_BASE_URL}${GOOGLE_URL_CALLBACK}`
  );

  client.setCredentials({
    access_token: token.accessToken(),
    // refresh_token: token.refreshToken(),
  });

  return client;
}

export async function createGoogleCalendarEvent({
  token,
  event,
}: {
  token: OAuth2Tokens;
  event: {
    name: string;
    start: Date;
    guestEmail: string;
    guestName: string;
    ownerEmail: string;
    ownerName: string;
    guestNotes?: string;
    durationInMinutes: number;
  };
}) {
  const OAuthClient = await getOAuthClient(token);

  const calendar = google.calendar({ version: "v3", auth: OAuthClient });

  const newEvent = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      attendees: [
        {
          email: event.guestEmail,
          displayName: event.guestName,
        },
        {
          email: event.ownerEmail,
          displayName: event.ownerName,
          responseStatus: "accepted",
        },
      ],
      start: {
        dateTime: event.start.toISOString(),
      },
      end: {
        dateTime: addMinutes(
          event.start,
          event.durationInMinutes
        ).toISOString(),
      },
      summary: `${event.guestName} + ${event.guestName}: ${event.name}`,
      description: event.guestNotes
        ? `Additional Description: ${event.guestNotes}`
        : undefined,
    },
  });

  return newEvent.data;
}
