"use server";

import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";

export const createCookieSession = async ({ userId }: { userId: string }) => {
  const cookieStore = await cookies();

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  // const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  const stringifiedCookieValue = JSON.stringify({
    value: userId,
    token: "123",
  });

  cookieStore.set(COOKIE_NAME, stringifiedCookieValue, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return {
    sessionCookie: cookieStore.get(COOKIE_NAME),
  };
};
