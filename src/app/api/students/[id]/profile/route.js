import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

/* =========================
   GET — fetch student profile
========================= */
export async function GET(req, context) {
  const { id } = await context.params; // ✅ REQUIRED
  const db = await getDB();

  const profile = await db.get(
    `
    SELECT phone, dob, guardian, address, notes
    FROM student_profiles
    WHERE student_id = ?
    `,
    [id]
  );

  return NextResponse.json(
    profile || {
      phone: "",
      dob: "",
      guardian: "",
      address: "",
      notes: "",
    }
  );
}

/* =========================
   PUT — save student profile
========================= */
export async function PUT(req, context) {
  const { id } = await context.params; // ✅ REQUIRED
  const body = await req.json();
  const db = await getDB();

  const { phone, dob, guardian, address, notes } = body;

  await db.run(
    `
    INSERT INTO student_profiles (student_id, phone, dob, guardian, address, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(student_id) DO UPDATE SET
      phone = excluded.phone,
      dob = excluded.dob,
      guardian = excluded.guardian,
      address = excluded.address,
      notes = excluded.notes
    `,
    [id, phone, dob, guardian, address, notes]
  );

  return NextResponse.json({ success: true });
}
