// src/components/DashboardCard.js
export default function DashboardCard({ title, value, color }) {
  return (
    <div className={`rounded-lg shadow-md p-4 text-white ${color}`}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
