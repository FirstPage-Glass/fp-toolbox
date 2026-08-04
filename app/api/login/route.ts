import { NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
  if (!validateCredentials(username, password)) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }
  const response = NextResponse.json({ success: true, username });
  response.cookies.set("fp-auth", username, {
    httpOnly: false, // NavBar reads it client-side
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
