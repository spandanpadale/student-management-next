"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess("Admin created successfully. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Server error");
    }
  };

  return (
  <div className="min-h-screen flex">

    {/* LEFT SIDE — 30% */}
    <div className="w-[30%] hidden md:flex flex-col justify-center px-10 text-white
                    bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700">
      <h1 className="text-5xl font-extrabold leading-tight mb-6">
        Student<br />Management System
      </h1>

      <p className="text-xl text-blue-100 max-w-sm mb-6">
        Manage student records, track activity, export data, and maintain your
        institution efficiently — all from one dashboard.
      </p>

      <ul className="space-y-3 text-xl text-blue-100">
        <li>• Add, edit & delete students</li>
        <li>• Track active & inactive status</li>
        <li>• Export student data to CSV</li>
        <li>• Secure admin-only access</li>
      </ul>
    </div>

    {/* RIGHT SIDE — 70% */}
<div
  className="w-full md:w-[70%] relative flex items-center justify-center overflow-hidden
             bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
>

      {/* Decorative background blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-32 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-30" />

      {/* LOGIN CARD */}

      {/* Subtle grid pattern */}
<div
  className="absolute inset-0 opacity-[0.07]"
  style={{
    backgroundImage:
      "linear-gradient(to right, #2563eb 1px, transparent 1px), linear-gradient(to bottom, #2563eb 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  }}
/>

{/* Soft radial glow */}
<div className="absolute w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl opacity-20 -top-40 right-20" />
<div className="absolute w-[400px] h-[400px] bg-indigo-300 rounded-full blur-3xl opacity-20 bottom-0 left-20" />

      <form
  onSubmit={submit}
  className="
    bg-white w-full max-w-md p-8 rounded-2xl
             shadow-[0_20px_60px_rgba(0,0,0,0.12)]
             border border-slate-200
    animate-[fadeInUp_0.6s_ease-out]
    relative z-10 
  "
>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Create Admin Account
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          New admin access
        </p>

        {error && (
          <div className="mb-4 text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-lg py-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-center text-green-700 bg-green-50 border border-green-200 rounded-lg py-2">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold"
        >
          Create Admin
        </button>

        <p className="text-xs text-center text-slate-400 mt-6">
          © 2026 Student Management System
        </p>
      </form>
    </div>
    </div>
  );
}
