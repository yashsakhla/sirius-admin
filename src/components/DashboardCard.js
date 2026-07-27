// src/components/DashboardCard.js
export default function DashboardCard({ title, value, color }) {
  return (
    <div className={`rounded-xl shadow-md p-5 text-white transition-transform hover:-translate-y-0.5 ${color}`}>
      <h2 className="text-sm font-medium uppercase tracking-wide opacity-90">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
