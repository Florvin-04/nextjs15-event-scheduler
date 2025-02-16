import { cookies } from "next/headers";
import { COOKIE_NAME } from "./lib/constants";
import { users } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "./drizzle/db";
import { cache } from "react";
import { redirect } from "next/navigation";
import { CONFIG_APP } from "./config";
import { Google } from "arctic";

export const GOOGLE_URL_CALLBACK = "/api/auth/callback/google";

export const google = new Google(
  CONFIG_APP.env.GOOGLE_CLIENT_ID!,
  CONFIG_APP.env.GOOGLE_CLIENT_SECRET!,
  `${CONFIG_APP.env.NEXT_PUBLIC_BASE_URL}${GOOGLE_URL_CALLBACK}`
);

export const validateUserSession = cache(async () => {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(COOKIE_NAME);

  const redirectTo = (url?: string) => redirect(url || "/login");

  if (!sessionCookie) {
    return {
      user: null,
      error: "Unauthorized",
      redirect: redirectTo,
    };
  }

  const { value: userIdFromCookie } = JSON.parse(sessionCookie.value);

  const user = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.id, userIdFromCookie))
    .limit(1);

  return {
    user: user[0],
    redirect: redirectTo,
  };
});
