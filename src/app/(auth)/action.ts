"use server";

import {
  signInSchema,
  signInSchemaType,
  signUpSchema,
  signUpSchemaType,
} from "@/schema/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import argon2 from "argon2";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema/users";
import { eq } from "drizzle-orm";
import { createCookieSession } from "../(main)/action";

export const handleSignUpAction = async (
  credentials: signUpSchemaType
): Promise<{ error: string }> => {
  try {
    const { email, password, firstName, lastName } =
      signUpSchema.parse(credentials);

    const passwordHash = await argon2.hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      // outputLen: 32,
      parallelism: 1,
    });

    const isUserExist = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    // console.log({ isUserExist: isUserExist.length, passwordHash });

    if (isUserExist.length) {
      return { error: "User already exists" };
    }

    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
        lastName,
      })
      .returning();

    await createCookieSession({
      userId: `${newUser[0].id}`,
    });

    // console.log({ sessionCookie });

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { error: "Something went wrong" };
  }
};

export const handleSignInAction = async (
  credentials: signInSchemaType
): Promise<{ error: string }> => {
  try {
    const { email, password } = signInSchema.parse(credentials);

    const errorMessage = "Invalid Credentials";

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user.length) {
      return { error: errorMessage };
    }

    const isPasswordValid = await argon2.verify(user[0].passwordHash, password);

    if (!isPasswordValid) {
      return { error: errorMessage };
    }

    await createCookieSession({
      userId: `${user[0].id}`,
    });

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { error: "Something went wrong" };
  }
};
