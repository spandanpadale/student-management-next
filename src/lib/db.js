import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

/**
 * Always returns the same DB instance
 */
export async function getDB() {
  if (!db) {
    db = await open({
      filename: "./school.db",
      driver: sqlite3.Database,
    });

    await initializeTables(db);
  }
  return db;
}

/**
 * Create required tables (runs once)
 */
async function initializeTables(db) {
  /* =========================
     STUDENTS TABLE
  ========================= */
  await db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    isDeleted INTEGER DEFAULT 0
  )
`);


  /* =========================
     ADMINS TABLE
  ========================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // /* =========================
  //    STUDENT PROFILES TABLE
  //    (extra details only)
  // ========================= */
  // await db.exec(`
  //   CREATE TABLE IF NOT EXISTS student_profiles (
  //     student_id INTEGER PRIMARY KEY,
  //     phone TEXT,
  //     dob TEXT,
  //     guardian TEXT,
  //     address TEXT,
  //     notes TEXT,
  //     FOREIGN KEY (student_id) REFERENCES students(id)
  //   )
  // `);

  // STUDENT PROFILE TABLE
await db.exec(`
  CREATE TABLE IF NOT EXISTS student_profiles (
    studentId INTEGER PRIMARY KEY,
    phone TEXT,
    dob TEXT,
    guardian TEXT,
    address TEXT,
    notes TEXT,
    FOREIGN KEY (studentId) REFERENCES students(id)
  )
`);

}
