import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

/* =========================
   GET — fetch single student
========================= */
export async function GET(req, context) {
  const params = await context.params;
  const id = Number(params.id);
  const studentId = id;


  if (!studentId) {
    return NextResponse.json(
      { error: "Invalid student ID" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const student = await db.get(
    `
    SELECT
      id,
      name,
      email,
      course,
      isActive,
      isDeleted,
      phone,
      dob,
      guardian,
      address,
      notes
    FROM students
    WHERE id = ?
    `,
    [studentId]
  );

  if (!student) {
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(student);
}

/* =========================
   PUT — update student
========================= */
export async function PUT(req, context) {
const params = await context.params;
  const id = Number(params.id);
  const studentId = id;


  if (!studentId) {
    return NextResponse.json(
      { error: "Invalid student ID" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { name, email, course, isActive } = body;

  if (!name || !email || !course) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  
  const db = await getDB();

  await db.run(
    `
    UPDATE students
    SET name = ?, email = ?, course = ?, isActive = ?
    WHERE id = ?
    `,
    [name, email, course, isActive ? 1 : 0, studentId]
  );

  return NextResponse.json({ success: true });
}

/* =========================
   DELETE — soft delete student
========================= */



export async function DELETE(req, context) {
  const params = await context.params;
  const id = Number(params.id);
  const studentId = id;


  if (!studentId) {
    return NextResponse.json(
      { error: "Invalid student ID" },
      { status: 400 }
    );
  }

  const db = await getDB();

  await db.run(
    `
    UPDATE students
    SET isDeleted = 1, isActive = 0
    WHERE id = ?
    `,
    [studentId]
  );

  return NextResponse.json({ success: true });
}
