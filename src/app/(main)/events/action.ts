"use server";

import { validateUserSession } from "@/auth";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { EventFormSchemaType, eventFormSchemaZod } from "@/schema/events";
import { and, eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function updateEvent({
  eventData,
  eventId,
}: {
  eventData: EventFormSchemaType;
  eventId: string;
}): Promise<{ error: string }> {
  try {
    const { user } = await validateUserSession();

    const { name, description, duration, isActive } =
      eventFormSchemaZod.parse(eventData);

    if (!user) {
      return { error: "Unauthorized" };
    }

    await db
      .update(EventTable)
      .set({
        name,
        description,
        duration,
        isActive,
      })
      .where(and(eq(EventTable.id, eventId), eq(EventTable.userId, user.id)));

    return redirect("/events");
  } catch (error) {
    console.error(error);
    if (isRedirectError(error)) throw error;

    return { error: "Something went wrong" };
  }
}

export async function createEvent(
  eventData: EventFormSchemaType
): Promise<{ error: string }> {
  try {
    const { user } = await validateUserSession();

    const { name, description, isActive, duration } =
      eventFormSchemaZod.parse(eventData);

    if (!user) {
      return { error: "Unauthorized" };
    }

    await db.insert(EventTable).values({
      name,
      description: description || "",
      userId: user.id,
      isActive,
      duration,
    });

    redirect("/events");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { error: "Something went wrong" };
  }
}

// export async function deleteEvent(eventId: string): Promise<{ error: string }> {
//   try {
//     const { user } = await validateUserSession();

//     if (!user) {
//       return { error: "Unauthorized" };
//     }

//     await db
//       .delete(EventTable)
//       .where(and(eq(EventTable.id, eventId), eq(EventTable.userId, user.id)));

//     return redirect("/events");
//   } catch (error) {
//     if (isRedirectError(error)) throw error;

//     return { error: "Something went wrong" };
//   }
// }

export const deleteEvent = async (eventId: string) => {
  const { user } = await validateUserSession();

  if (!user) {
    return { error: "Unauthorized" };
  }

  await db
    .delete(EventTable)
    .where(and(eq(EventTable.id, eventId), eq(EventTable.userId, user.id)));

  return redirect("/events");
};
