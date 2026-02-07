"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function StudentProfileClient({ id }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ SINGLE SOURCE OF TRUTH
  const [editMode, setEditMode] = useState(false);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    course: "",
    isActive: 0,
  });

  const [profile, setProfile] = useState({
    phone: "",
    dob: "",
    guardian: "",
    address: "",
    notes: "",
  });

  /* =========================
     INITIAL EDIT MODE FROM URL
  ========================= */
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setEditMode(true);
    }
  }, [searchParams]);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        // BASIC STUDENT
        const studentRes = await fetch(`/api/students/${id}`);
        if (!studentRes.ok) return;

        const s = await studentRes.json();
        setStudent({
          name: s.name ?? "",
          email: s.email ?? "",
          course: s.course ?? "",
          isActive: s.isActive ?? 0,
        });

        // PROFILE (optional)
        const profileRes = await fetch(`/api/students/${id}/profile`);
        if (profileRes.ok) {
          const p = await profileRes.json();
          setProfile({
            phone: p.phone ?? "",
            dob: p.dob ?? "",
            guardian: p.guardian ?? "",
            address: p.address ?? "",
            notes: p.notes ?? "",
          });
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /* =========================
     SAVE PROFILE
  ========================= */
 const handleSave = async () => {
  try {
    /* 1️⃣ SAVE BASIC STUDENT INFO */
    const studentRes = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: student.name,
        email: student.email,
        course: student.course,
        isActive: student.isActive,
      }),
    });

    if (!studentRes.ok) {
      console.error("Student save failed", await studentRes.text());
      throw new Error("Student save failed");
    }

    /* 2️⃣ SAVE PROFILE INFO */
    const profileRes = await fetch(`/api/students/${id}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!profileRes.ok) {
      console.error("Profile save failed", await profileRes.text());
      throw new Error("Profile save failed");
    }

    setEditMode(false);
    alert("Profile saved successfully");
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save profile");
  }
};



  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading student profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-white py-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {student.name ? student.name.charAt(0).toUpperCase() : "?"}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {student.name || "Student Profile"}
            </h1>
            <p className="text-slate-500 text-sm">
              View and update student information
            </p>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-10">

          {/* BASIC INFORMATION */}
<div>
  <h2 className="text-lg font-semibold text-slate-700 mb-4">
    🧑 Basic Information
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Name */}
   <div className="space-y-1">
  <label className="text-xs font-medium text-slate-500">
    Full Name
  </label>
  <input
    value={student.name || ""}
    readOnly={!editMode}
    onChange={(e) =>
      editMode && setStudent({ ...student, name: e.target.value })
    }
    className={`input transition ${
  !editMode
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white focus:ring-2 focus:ring-blue-500"
}`}
  />
    </div>

    {/* Email */}
    <div className="space-y-1">
  <label className="text-xs font-medium text-slate-500">
Mail  </label>
  <input
    value={student.email || ""}
    readOnly={!editMode}
    onChange={(e) =>
      editMode && setStudent({ ...student, email: e.target.value })
    }
    className={`input transition ${
  !editMode
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white focus:ring-2 focus:ring-blue-500"
}`}
  />
    </div>

    {/* Course */}
   <div className="space-y-1">
  <label className="text-xs font-medium text-slate-500">
    Name of Course
  </label>
  <input
    value={student.course || ""}
    readOnly={!editMode}
    onChange={(e) =>
      editMode && setStudent({ ...student, course: e.target.value })
    }
    className={`input transition ${
  !editMode
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white focus:ring-2 focus:ring-blue-500"
}`}
  />
    </div>

    {/* Status */}
    <div>
      <label className="label">Status</label>
      {editMode ? (
        <select
          value={student.isActive}
          onChange={(e) =>
            setStudent({
              ...student,
              isActive: Number(e.target.value),
            })
          }
          className="input"
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
      ) : (
        <span
  className={`px-3 py-1 rounded-full text-sm font-medium
    ${
      student.isDeleted
        ? "bg-gray-200 text-gray-700"
        : student.isActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
>
  {student.isDeleted
    ? "Deleted"
    : student.isActive
    ? "Active"
    : "Inactive"}
</span>

      )}
    </div>
  </div>
</div>


          {/* ADDITIONAL DETAILS */}
<div>
  <h2 className="text-lg font-semibold text-slate-700 mb-4">
     📄 Additional Details
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Contact */}
    
    <div className="space-y-1">
  <label className="text-xs font-medium text-slate-500">
    Contact Number
  </label>
  <input
    value={profile.phone || ""}
    readOnly={!editMode}
    onChange={(e) =>
      editMode && setProfile({ ...profile, phone: e.target.value })
    }
    className={`input transition ${
  !editMode
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white focus:ring-2 focus:ring-blue-500"
}`}
  />
    </div>

    {/* DOB */}
    <div className="space-y-1">
  <label className="text-xs font-medium text-slate-500">
    Date of Birth
  </label>
  <input
    value={profile.dob || ""}
    readOnly={!editMode}
    onChange={(e) =>
      editMode && setProfile({ ...profile, dob: e.target.value })
    }
    className={`input transition ${
  !editMode
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white focus:ring-2 focus:ring-blue-500"
}`}/>
    </div>

    {/* Guardian */}
    <div className="space-y-1">
  <label className="text-xs font-medium text-slate-500">
    Name of Guardian
  </label>
  <input
    value={profile.guardian || ""}
    readOnly={!editMode}
    onChange={(e) =>
      editMode && setProfile({ ...profile, guardian: e.target.value })
    }
    className={`input transition ${
  !editMode
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white focus:ring-2 focus:ring-blue-500"
}`}
  />
    </div>

    {/* Address */}
    <div className="space-y-1">
  <label className="text-xs font-medium text-slate-500">
    Address
  </label>
  <input
    value={profile.address || ""}
    readOnly={!editMode}
    onChange={(e) =>
      editMode && setProfile({ ...profile, address: e.target.value })
    }
    className={`input transition ${
  !editMode
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white focus:ring-2 focus:ring-blue-500"
}`}
  />
    </div>

    {/* Notes (FULL WIDTH) */}
    <div className="md:col-span-2">
        <label className="text-xs font-medium text-slate-500">
Notes / Remarks  </label>
      <textarea
        rows={4}
        value={profile.notes}
        readOnly={!editMode}
        onChange={(e) =>
          editMode && setProfile({ ...profile, notes: e.target.value })
        }
 className={`input transition ${
  !editMode
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white focus:ring-2 focus:ring-blue-500"
}`}/>
    </div>
  </div>
</div>


          {/* ACTIONS */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
  <button
    onClick={() => router.push("/")}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
  >
    ← Back to Dashboard
  </button>

              {!editMode ? (
    <button
      onClick={() => router.push(`/students/${id}?edit=true`)}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg "
    >
      Edit Profile
    </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            )}
          </div>
        </div>
      </div>

     <style jsx>{`
  .input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #cbd5f5;
    font-size: 14px;
    outline: none;
  }

  .label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
  }
`}</style>

    </div>
  );
}
