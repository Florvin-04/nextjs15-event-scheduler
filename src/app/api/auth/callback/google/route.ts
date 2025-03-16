import { createCookieSession } from "@/app/(main)/action";
import { google as gooleAuth } from "@/auth";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { redisObj } from "@/redis/redis";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

async function setRedisUserSession(payload: { id: string }) {
  const sessionId = crypto.randomUUID();

  await createCookieSession({ userId: sessionId });

  await redisObj.setUserSession({
    valueToStore: payload,
    sessionId: sessionId,
    type: "session",
  });

  await redisObj.setUserSession({
    valueToStore: { id: sessionId },
    sessionId: payload.id,
    type: "user",
  });
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const awaitedCookies = await cookies();

  const storedState = awaitedCookies.get("state")?.value;
  const storedCodeVerifier = awaitedCookies.get("code_verifier")?.value;

  console.log({
    code,
    state,
    storedState,
    storedCodeVerifier,
    url: req.nextUrl,
  });

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const token = await gooleAuth.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );

    const accessToken = token.accessToken();
    const refreshToken = token.refreshToken();

    // console.log({ token: accessToken, tokens: token });

    // const googleUser = await KyInstance.get(
    //   "https://www.googleapis.com/oauth2/v1/userinfo",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token.accessToken}`,
    //     },
    //   }
    // ).json<{ id: string; name: string; picture: string }>();

    const googleUser = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userInfo = await googleUser.json();

    const userGoogleExists = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.googleId, userInfo.id),
    });

    if (userGoogleExists) {
      const user = await db
        .update(users)
        .set({
          googleRT: refreshToken,
        })
        .where(eq(users.googleId, userInfo.id))
        .returning({ id: users.id });

      const redisSessionUser = {
        id: user[0].id,
      };

      await setRedisUserSession(redisSessionUser);

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const user = await db
      .insert(users)
      .values({
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        googleId: userInfo.id,
        googleRT: refreshToken,
        passwordHash: "",
      })
      .returning({ id: users.id });

    await createCookieSession({ userId: user[0].id });

    const redisSessionUser = {
      id: user[0].id,
    };

    await setRedisUserSession(redisSessionUser);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}
