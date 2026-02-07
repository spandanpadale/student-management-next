export default function DashboardCards({ stats, activeFilter, onSelect }) {

  const cardClass = (type) =>
  `rounded-xl border p-5 cursor-pointer transition-all
   ${activeFilter === type
     ? "border-blue-600 bg-blue-50 shadow-md"
     : "border-slate-300 bg-white hover:bg-slate-50"}`;

return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  
  {/* TOTAL */}
 <div
  onClick={() => onSelect("all")}
  className={cardClass("all")}
>
  <p className="text-sm text-slate-500">Total Students</p>
  <p className="text-3xl font-bold text-blue-600">
    {stats.totalStudents}
    
  </p>

</div>


  {/* ACTIVE */}
  <div
  onClick={() => onSelect("active")}
  className={cardClass("active")}
>
  <p className="text-sm text-slate-500">Active Students</p>
  <p className="text-3xl font-bold text-green-600">
    {stats.activeStudents}
  </p>
</div>


  {/* INACTIVE */}
  <div
  onClick={() => onSelect("inactive")}
  className={cardClass("inactive")}
>
  <p className="text-sm text-slate-500">Inactive Students</p>
  

  <p className="text-3xl font-bold text-red-500">
    {stats.inactiveStudents}
  </p>
  
</div>


  {/* DELETED */}
  <div
  onClick={() => onSelect("deleted")}
  className={cardClass("deleted")}
>
  <p className="text-sm text-slate-500">Deleted Students</p>
  <p className="text-3xl font-bold text-slate-600">
    {stats.deletedStudents}
  </p>
</div>
  </div> 

);
;



}
