"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const submit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      setError(data?.error || "Login failed");
      return;
    }

    // SUCCESS
    router.push("/");
  } catch (err) {
    setError(err.message || "Server error");
  }
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #c7d2fe",
  marginBottom: "14px",
  fontSize: "14px",
  outline: "none",
  transition: "all 0.2s ease",
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


        <div className="text-center mb-6">
          <span className="inline-block text-xs font-semibold text-blue-600
                           bg-blue-100 px-3 py-1 rounded-full mb-3">
            Secure Admin Access
          </span>

          <h2 className="text-2xl font-bold text-slate-800">
            Admin Panel
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Sign in to manage students
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-center text-red-600
                          bg-red-50 border border-red-200 rounded-lg py-2">
            {error}
          </div>
        )}

       <div className="space-y-6 mb-6">

  <input
    type="email"
    placeholder="Admin Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="
      w-full p-3 rounded-lg border border-slate-300
      focus:outline-none focus:ring-2 focus:ring-blue-500
      transition-all duration-200
    hover:bg-white-700 hover:-translate-y-[1px]
    active:translate-y-0 active:scale-[0.98]
    "
    required
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="
      w-full p-3 rounded-lg border border-slate-300
      focus:outline-none focus:ring-2 focus:ring-blue-500
     transition-all duration-200
    hover:bg-white-700 hover:-translate-y-[1px]
    active:translate-y-0 active:scale-[0.98]
    "
    required
  />

</div>


       <button
  className="
    bg-blue-600 text-white w-full py-3 rounded-lg font-semibold
    transition-all duration-200
    hover:bg-blue-700 hover:-translate-y-[1px]
    active:translate-y-0 active:scale-[0.98]
  "
>
  Login
</button>

<div className="mt-5 text-center">
  <p className="text-sm text-slate-500">
    New admin?{" "}
    <button
      type="button"
      onClick={() => router.push("/register")}
      className="text-blue-600 font-semibold hover:underline"
    >
      Create admin account
    </button>
  </p>
</div>

<p className="text-xs text-center text-slate-400 mt-6">
  © 2026 Student Management System
</p>

      </form>
    </div>
  </div>
);







}
