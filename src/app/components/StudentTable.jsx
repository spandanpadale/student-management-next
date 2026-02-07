"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function StudentTable({
  refresh,
  filter,
  onFilterChange,
  onActionComplete,
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  // const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    course: "",
    isActive: 1,
  });

 useEffect(() => {
  setLoading(true);

  fetch("/api/students")
    .then(res => res.json())
    .then(data => {
      setStudents(data);
      setLoading(false);
    });
}, [refresh]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);


  const saveEdit = async (id) => {
    await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });

    setEditId(null);
    onActionComplete(); // ✅ correct
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    const res = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete student");
      return;
    }

    // ✅ MARK AS DELETED IN STATE (DO NOT REMOVE)
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, isDeleted: 1 }
          : student
      )
    );

    onActionComplete();
  };


  const restoreStudent = async (id) => {
    if (!window.confirm("Restore this student?")) return;

    const res = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restore: true }),
    });

    if (!res.ok) {
      alert("Failed to restore student");
      return;
    }

    // ✅ MARK AS RESTORED IN STATE
    onActionComplete();       // refetch + refresh UI
  };


  const exportToCSV = () => {
        if (!window.confirm(" Convert all student data to CSV?")) return;

    if (!visibleStudents.length) {
      alert("No Students found \n\n Try adjusting your search or filter, or add a new student.");
      return;
    }

    const headers = ["Name", "Email", "Course", "Status"];

    const rows = visibleStudents.map((s) => [
      s.name,
      s.email,
      s.course,
      s.isDeleted
        ? "Deleted"
        : s.isActive
          ? "Active"
          : "Inactive",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const visibleStudents = students.filter((student) => {
    const isDeleted = Number(student.isDeleted) === 1;
    const isActive = Number(student.isActive) === 1;

    // SEARCH FIRST (works inside every filter)
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      student.name.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.course.toLowerCase().includes(q);

      if (loading) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl p-10 text-center">
      <p className="text-slate-500">Loading students…</p>
    </div>
  );
}


    if (!matchesSearch) return false;

    // FILTER LOGIC
    if (filter === "active") {
      return !isDeleted && isActive;
    }

    if (filter === "inactive") {
      return !isDeleted && !isActive;
    }

    if (filter === "deleted") {
      return isDeleted;
    }

    // "all"
    return !isDeleted;
  });

  const totalPages = Math.ceil(
    visibleStudents.length / ITEMS_PER_PAGE
  );

  const statusFilteredStudents = students.filter((s) => {
  if (filter === "active") return s.isActive === 1 && s.isDeleted === 0 ;
  
  if (filter === "inactive") return s.isActive === 0 && s.isDeleted === 0;
  if (filter === "deleted") return s.isDeleted === 1;
  return s.isDeleted === 0; // all
});

const searchedStudents = statusFilteredStudents.filter((s) =>
  `${s.name} ${s.email} ${s.course}`
    .toLowerCase()
    .includes(search.toLowerCase())
);


  const paginatedStudents = visibleStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

const toggleStatus = async (student) => {
 if (!window.confirm("Change student status?")) return;
  const res = await fetch(`/api/students/${student.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: student.name,
      email: student.email,
      course: student.course,
      isActive: student.isActive ? 0 : 1,
    }),
  });
  
  if (!res.ok) {
    alert("Failed to update status");
    return;
  }

  onActionComplete();
};





  return (
    <div className="bg-white rounded-xl shadow border border-slate-300 overflow-hidden">

     <div className="px-4 py-4 border-b border-slate-300 bg-slate-100">

  <div className="flex flex-col md:flex-row gap-4 items-center">
    <input
      type="text"
      placeholder="Search by name, email or course..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-slate-300 rounded px-4 py-2 w-full md:flex-1"
    />

    { <select
  value={filter}
  onChange={(e) => onFilterChange(e.target.value)}
  className="border border-slate-300 rounded px-3 py-2"
>

      < option value="all">All Students</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="deleted">Deleted</option>
    </select> }

    <button
  onClick={exportToCSV}
  className="border border-slate-300 px-4 py-2 rounded bg-white hover:bg-slate-100 whitespace-nowrap"
>

      Export CSV
    </button>
  </div>
</div>





      {/* TABLE */}
      <table className="hidden md:table w-full border-collapse">

        <thead className="bg-slate-100 border-b border-slate-300">
  <tr>
    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-left">
      Name
    </th>
    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-left">
      Email
    </th>
    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-left">
      Course
    </th>
    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-left">
      Status
    </th>
    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-left">
      Actions
    </th>
  </tr>
</thead>

        <tbody>
  {paginatedStudents.map((student) => (
    <tr
      key={student.id}
      className="border-b border-slate-200 hover:bg-slate-50 transition"
    >
      {/* NAME */}
      <td className="p-4">
        {editId === student.id ? (
          <input
            className="border border-slate-300 p-2 rounded w-full"
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
          />
        ) : (
          <span
  onClick={() => window.location.href = `/students/${student.id}`}
  className="text-blue-600 hover:underline cursor-pointer font-medium"
>
  {student.name}
</span>

        )}
      </td>

      {/* EMAIL */}
      <td className="p-4">
        {editId === student.id ? (
          <input
            className="border border-slate-300 p-2 rounded w-full"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
          />
        ) : (
          student.email
        )}
      </td>

      {/* COURSE */}
      <td className="p-4">
        {editId === student.id ? (
          <input
            className="border border-slate-300 p-2 rounded w-full"
            value={editData.course}
            onChange={(e) =>
              setEditData({ ...editData, course: e.target.value })
            }
          />
        ) : (
          student.course
        )}
      </td>

      {/* STATUS */}
      <td className="p-4">
        {editId === student.id ? (
          <select
            className="border border-slate-300 p-2 rounded w-full"
            value={editData.isActive}
            onChange={(e) =>
              setEditData({
                ...editData,
                isActive: Number(e.target.value),
              })
            }
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        ) : student.isDeleted ? (
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
            Deleted
          </span>
        ) : student.isActive ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
            Inactive
          </span>
        )}
      </td>

      {/* ACTIONS */}
      <td className="p-4 flex gap-2">
        {student.isDeleted ? (
          <button
            onClick={() => restoreStudent(student.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Restore
          </button>
        ) : editId === student.id ? (
          <>
            <button
              onClick={() => saveEdit(student.id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditId(null)}
              className="bg-slate-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
  onClick={() => router.push(`/students/${student.id}?edit=true`)}
  className="bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded text-sm"
>
  Edit
</button>

            <button
              onClick={() => deleteStudent(student.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

      </table>
      <div className="md:hidden space-y-4">
        {paginatedStudents.map((student) => (
          <div
            key={student.id}
            className="border border-slate-400 rounded-lg p-4"
          >
            <p><b>Name:</b> {student.name}</p>
            <p><b>Email:</b> {student.email}</p>
            <p><b>Course:</b> {student.course}</p>
            <p>
              <b>Status:</b>{" "}
              {student.isDeleted
                ? "Deleted"
                : student.isActive
                  ? "Active"
                  : "Inactive"}
            </p>

            <div className="flex gap-2 mt-3">
              {!student.isDeleted && (
                <button
                  onClick={() => deleteStudent(student.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              )}

              {student.isDeleted && (
                <button
                  onClick={() => restoreStudent(student.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>


      {totalPages > 1 && (
 <div className="flex justify-center items-center gap-2 py-4 bg-slate-50">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
    className="px-3 py-1 text-sm border rounded
               disabled:opacity-40"
  >
    Prev
  </button>

  {Array.from({ length: totalPages }).map((_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`px-3 py-1 text-sm border rounded ${
        currentPage === i + 1
          ? "bg-blue-600 text-white"
          : "bg-white"
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
    className="px-3 py-1 text-sm border rounded
               disabled:opacity-40"
  >
    Next
  </button>
</div>

      )}

    </div>
  );
}
