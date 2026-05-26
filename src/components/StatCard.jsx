export default function StatCard({ title, value, tone = "default" }) {
  const toneClass = {
    default: "from-white to-[#fbf7ef]",
    green: "from-emerald-50 to-white",
    amber: "from-amber-50 to-white",
    sky: "from-sky-50 to-white",
  }[tone] || "from-white to-[#fbf7ef]";

  return (
    <div className={`card min-h-24 bg-gradient-to-b ${toneClass} p-3 sm:min-h-28 sm:p-5`}>
      <p className="break-words text-xs leading-4 text-slate-500 sm:text-sm">{title}</p>
      <p className="mt-2 text-xl font-bold leading-none text-slate-900 sm:mt-3 sm:text-3xl">{value}</p>
    </div>
  );
}
