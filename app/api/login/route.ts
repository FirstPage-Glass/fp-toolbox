import { NextResponse } from "next/server";

const VALID_USER = process.env.AUTH_USER || "firstpage";
const VALID_PASS = process.env.AUTH_PASS || "TYRRs61MwW7vWR1M2i6EFJB9HCL7t5Eu";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === VALID_USER && password === VALID_PASS) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("fp-auth", "authenticated", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  }

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
