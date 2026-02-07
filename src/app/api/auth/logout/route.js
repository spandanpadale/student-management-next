import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // delete cookie on server
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
