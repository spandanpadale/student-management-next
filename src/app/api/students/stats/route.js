import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  const db = await getDB();

  const total = await db.get(`
    SELECT COUNT(*) as count
    FROM students
    WHERE isDeleted = 0
  `);

  const active = await db.get(`
    SELECT COUNT(*) as count
    FROM students
    WHERE isDeleted = 0 AND isActive = 1
  `);

  const inactive = await db.get(`
    SELECT COUNT(*) as count
    FROM students
    WHERE isDeleted = 0 AND isActive = 0
  `);

  const deleted = await db.get(`
    SELECT COUNT(*) as count
    FROM students
    WHERE isDeleted = 1
  `);

  return NextResponse.json({
    totalStudents: total.count,      // active + inactive
    activeStudents: active.count,
    inactiveStudents: inactive.count,
    deletedStudents: deleted.count
  });
}
