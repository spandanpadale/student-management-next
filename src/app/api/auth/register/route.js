import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const existing = await db.get(
      "SELECT id FROM admins WHERE email = ?",
      email
    );

    if (existing) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await db.run(
      "INSERT INTO admins (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
