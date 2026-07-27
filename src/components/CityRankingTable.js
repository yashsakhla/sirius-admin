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
    <div className="card mt-6 p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Cities by Deliveries</h2>
      <div className="table-shell">
        <table className="min-w-full text-sm text-left">
          <thead className="table-head-row">
            <tr>
              <th className="table-cell">City</th>
              <th className="table-cell">Delivered</th>
              <th className="table-cell">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {cityList.length === 0 ? (
              <tr>
                <td colSpan={3} className="table-cell text-center text-gray-500">
                  No order data yet.
                </td>
              </tr>
            ) : (
              cityList.map(([city, stats]) => (
                <tr key={city} className="table-row">
                  <td className="table-cell font-medium text-gray-900">{city}</td>
                  <td className="table-cell text-emerald-700">{stats.delivered}</td>
                  <td className="table-cell">{stats.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
