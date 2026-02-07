"use client";

import { useState } from "react";

export default function AddStudentForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const submit = async e => {
    e.preventDefault();

    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, course })
    });

    setName("");
    setEmail("");
    setCourse("");
    onSuccess();
  };

 return (
  <form
    onSubmit={submit}
      // className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
  >
      <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Student name"
      className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="student@email.com"
      className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <input
      value={course}
      onChange={(e) => setCourse(e.target.value)}
      placeholder="Course name"
      className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <button
      type="submit"
      className="bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      Add Student 
    </button>
  </form>
);



}
