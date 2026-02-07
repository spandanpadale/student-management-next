import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    const { email, password } = body;
    const db = await getDB();

    const admin = await db.get(
      "SELECT * FROM admins WHERE email = ?",
      email
    );

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔒 SAFE bcrypt compare
    const match = bcrypt.compareSync(password, admin.password);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set("admin_session", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax"
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
