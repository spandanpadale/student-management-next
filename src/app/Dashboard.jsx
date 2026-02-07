"use client";

import { useEffect, useState } from "react";
import AddStudentForm from "./components/AddStudentForm";
import DashboardCards from "./components/DashboardCards";
import StudentTable from "./components/StudentTable";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState("all"); 
// all | active | inactive | deleted

  const [stats, setStats] = useState({
    total: 0,
    //active: 0,
    deleted: 0
  });

  const loadStats = async () => {
    const res = await fetch("/api/students/stats");
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, [refresh]);

  const handleLogout = async () => {
  const ok = window.confirm("Are you sure you want to logout?");
  if (!ok) return;

  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
};


return (
  <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-white">
  
  {/* BACKGROUND BLOBS */}
  <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
  <div className="absolute bottom-0 left-24 w-[24rem] h-[24rem] bg-indigo-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

  {/* FULL PAGE GRID */}
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="w-full min-h-full opacity-[0.08]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #2563eb 1px, transparent 1px),
          linear-gradient(to bottom, #2563eb 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  </div>


{/* Soft radial glow */}
{/* <div className="absolute w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl opacity-20 -top-40 right-20" />
<div className="absolute w-[400px] h-[400px] bg-indigo-300 rounded-full blur-3xl opacity-20 bottom-0 left-20" /> */}


    {/* subtle top accent (keep it minimal) */}
    {/* <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" /> */}

    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <div className="rounded-3xl bg-white/70 backdrop-blur border border-slate-200 shadow-lg p-8 space-y-8">

      {/* HEADER */}
      
{/* HEADER */}
<div className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
  <div>
    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
      Student Management System
    </h1>
    <p className="text-slate-600 text-sm mt-1">
      Manage student records, enrollment status, and activity — all in one place
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="self-start sm:self-auto bg-red-600 hover:bg-red-700 active:scale-[0.98] transition text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow"
  >
    Logout           
    <br />
    
  </button>
</div>

      {/* ADD STUDENT */}
      {/* ADD STUDENT */}
<section className="rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-white border border-slate-200 shadow-sm p-6">

  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-lg font-semibold text-slate-800">
        Add New Student 
      </h2>
      <p className="text-sm text-slate-500">
        Create a new student record
      </p>
    </div>
  </div>

  <AddStudentForm onSuccess={() => setRefresh(r => !r)} />
</section>


      {/* STATS — IMPORTANT FIX (NO EXTRA GRID WRAPPER) */}
     {/* STATS */}
<section className="rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-white border border-slate-200 shadow-sm p-6">
  <h2 className="text-sm font-semibold text-slate-600 mb-4 tracking-wide uppercase">
    Overview
  </h2>

 <DashboardCards
  stats={stats}
  activeFilter={filter}
  onSelect={setFilter}
/>


</section>


      {/* TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
<StudentTable
  refresh={refresh}
  filter={filter}
  onFilterChange={setFilter}
  onActionComplete={() => setRefresh(r => !r)}
/>

      </div>
      </div>
    </div>
  </div>
);


// return (
//   <div className="min-h-screen relative overflow-hidden">

//     {/* FULL PAGE GRID BACKGROUND */}
//     <div
//       className="absolute inset-0"
//       style={{
//         backgroundImage: `
//           linear-gradient(to right, rgba(59,130,246,0.06) 1px, transparent 1px),
//           linear-gradient(to bottom, rgba(59,130,246,0.06) 1px, transparent 1px)
//         `,
//         backgroundSize: "40px 40px",
//       }}
//     />

//     {/* SOFT GRADIENT OVERLAY */}
//     <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50" />

//     {/* CONTENT */}
//     <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">

//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">
//             Student Management System
//           </h1>
//           <p className="text-slate-500 text-sm mt-1">
//             Manage student records, enrollment status, and activity
//           </p>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
//         >
//           Logout
//         </button>
//       </div>

//       {/* ADD STUDENT */}
//       <section className="bg-white/80 backdrop-blur rounded-xl shadow border border-slate-200">
//         <AddStudentForm onSuccess={() => setRefresh(r => !r)} />
//       </section>

//       {/* DASHBOARD CARDS */}
//       <section className="bg-white/80 backdrop-blur rounded-xl shadow border border-slate-200 p-6">
//         <DashboardCards
//           stats={stats}
//           activeFilter={filter}
//           onSelect={setFilter}
//         />
//       </section>

//       {/* STUDENT TABLE */}
//       <section className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200">
//         <StudentTable
//           refresh={refresh}
//           filter={filter}
//           onActionComplete={() => setRefresh(r => !r)}
//         />
//       </section>

//     </div>
//   </div>
// );







}
