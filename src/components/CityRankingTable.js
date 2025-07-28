// components/CityRankingTable.js

export default function CityRankingTable({ orders = [] }) {
  const grouped = {};

  // Group by city
  orders.forEach((order) => {
    const city = order?.owner?.city || 'Unknown';
    if (!grouped[city]) grouped[city] = { delivered: 0, total: 0 };
    grouped[city].total += 1;
    if (order.status === 'Delivered') grouped[city].delivered += 1;
  });

  const cityList = Object.entries(grouped); // [ [city, {delivered, total}], ... ]

  return (
    <div className="bg-white shadow mt-6 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Top Cities by Deliveries</h2>
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">City</th>
            <th className="px-4 py-2">Delivered</th>
            <th className="px-4 py-2">Total Orders</th>
          </tr>
        </thead>
        <tbody>
          {cityList.map(([city, stats]) => (
            <tr key={city} className="border-t">
              <td className="px-4 py-2">{city}</td>
              <td className="px-4 py-2">{stats.delivered}</td>
              <td className="px-4 py-2">{stats.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
