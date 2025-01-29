"use server";

import { signUpSchema, signUpSchemaType } from "@/schema/resgiter";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import argon2 from "argon2";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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

    console.log({ isUserExist: isUserExist.length, passwordHash });

    if (isUserExist.length) {
      return { error: "User already exists" };
    }

    // return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { error: "Something went wrong" };
  }
};
