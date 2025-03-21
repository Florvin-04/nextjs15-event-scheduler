import { google } from "@/auth";
import { generateState, generateCodeVerifier } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiesStore = await cookies();
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = google.createAuthorizationURL(state, codeVerifier, [
    "email",
    "profile",
    "openid",
    "https://www.googleapis.com/auth/calendar",
  ]);

  // Append essential params
  url.searchParams.append("access_type", "offline");
  url.searchParams.append("prompt", "consent"); // Forces refresh_token to be reissued

  cookiesStore.set("state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookiesStore.set("code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  console.log(url.searchParams.get("redirect_uri"));

  return NextResponse.redirect(url.toString(), 302);
}
