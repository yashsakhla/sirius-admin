// src/components/UserOrdersTable.js

export default function UserOrdersTable({ orders }) {
  return (
    <table className="w-full mt-2 ml-4 border border-gray-200 text-sm bg-gray-50">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="py-1 px-2">Order ID</th>
          <th className="py-1 px-2">Product IDs</th>
          <th className="py-1 px-2">No. of Products</th>
          <th className="py-1 px-2">Product Names</th>
          <th className="py-1 px-2">Order Date</th>
          <th className="py-1 px-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-2 px-4 text-center text-gray-500">
              No orders found.
            </td>
          </tr>
        ) : (
          orders.map((order, index) => (
            <tr key={index} className="border-t border-gray-200 bg-white">
              <td className="py-1 px-2">{order.orderId}</td>
              <td className="py-1 px-2">{order.productIds.join(', ')}</td>
              <td className="py-1 px-2">{order.productIds.length}</td>
              <td className="py-1 px-2">{order.products.join(', ')}</td>
              <td className="py-1 px-2">{order.orderDate}</td>
              <td className="py-1 px-2">{order.status}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
