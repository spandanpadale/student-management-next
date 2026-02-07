import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

/* =========================
   GET — ALL students
========================= */
export async function GET() {
  const db = await getDB();

  const students = await db.all(`
    SELECT * FROM students
    ORDER BY id DESC
  `);

  return NextResponse.json(students);
}

/* =========================
   POST — add student
========================= */
export async function POST(req) {
  try {
    const { name, email, course } = await req.json();

    if (!name || !email || !course) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDB();

    await db.run(
      `
      INSERT INTO students (name, email, course, isActive, isDeleted)
      VALUES (?, ?, ?, 1, 0)
      `,
      [name, email, course]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADD STUDENT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}
