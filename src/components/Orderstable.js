import { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import StatusDropdown from './StatusDropdown';

const statusColors = {
  Delivered: 'bg-green-100',
  Shipped: 'bg-yellow-100',
  Ordered: 'bg-orange-100',
  Cancelled: 'bg-red-100',
  Processing: 'bg-blue-100',
};

export default function OrdersTable({ orders, onChangeStatus }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    return (
      order._id.toLowerCase().includes(query) ||
      (Array.isArray(order.products)
        ? order.products.map(p => (typeof p === 'string' ? p : p.name)).join(',').toLowerCase()
        : ''
      ).includes(query) ||
      (order.owner?.email || '').toLowerCase().includes(query)
    );
  });

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const centerCell = "py-2 px-4 text-center align-middle";

  return (
    <div className="mt-4">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID, Products, or Email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
        />
      </div>

      <table className="min-w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className={centerCell}>Order ID</th>
            <th className={centerCell}>Products</th>
            <th className={centerCell}>Order Date</th>
            <th className={centerCell}>Order Total</th>
            <th className={centerCell}>Status</th>
            <th className={centerCell}>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.flatMap(order => {
            const productNames = Array.isArray(order.products)
              ? order.products.map(p => (typeof p === 'string' ? p : p.name)).join(', ')
              : '';

            const orderTotal = order.totalPrice || (
              Array.isArray(order.products)
                ? order.products.reduce((sum, p) => sum + (typeof p === 'string' ? 0 : p.price || 0), 0)
                : 0
            );

            return [
              // 🔹 Main row
              <tr
                key={order._id}
                className={`border-t transition ${statusColors[order.status] || 'bg-white'}`}
              >
                <td className={`${centerCell} font-semibold`}>{order._id}</td>
                <td className={centerCell}>{productNames}</td>
                <td className={centerCell}>{order.date}</td>
                <td className={`${centerCell} font-semibold`}>
                  ₹{orderTotal.toLocaleString("en-IN")}
                </td>
                <td className={centerCell}>
                  <StatusDropdown
                    current={order.status}
                    onChange={status => onChangeStatus(order._id, status)}
                    customClass={
                      "inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm " +
                      (order.status === "Delivered"
                        ? "bg-green-500 text-white"
                        : order.status === "Shipped"
                        ? "bg-yellow-500 text-yellow-900"
                        : order.status === "Ordered"
                        ? "bg-orange-500 text-white"
                        : order.status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white")
                    }
                  />
                </td>
                <td className={centerCell}>
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="text-gray-600 hover:text-black text-base"
                    title="Order Details"
                  >
                    {expandedOrderId === order._id ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                </td>
              </tr>,

              // 🔻 Expanded row
              ...(expandedOrderId === order._id
                ? [<tr key={`${order._id}-expand`}>
                    <td colSpan={6} className="bg-gray-50 px-6 py-4">
                      <table className="w-full text-center text-xs border border-gray-200 bg-white">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr>
                            <th className="px-3 py-2">Owner Name</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Phone</th>
                            <th className="px-3 py-2">City</th>
                            <th className="px-3 py-2">Address</th>
                            <th className="px-3 py-2">Coupon</th>
                            <th className="px-3 py-2">Offer</th>
                            <th className="px-3 py-2">Payment Mode</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="px-3 py-2">{order.owner?.name || '—'}</td>
                            <td className="px-3 py-2">{order.owner?.email || '—'}</td>
                            <td className="px-3 py-2">{order.owner?.phone || '—'}</td>
                            <td className="px-3 py-2">{order.owner?.city || '—'}</td>
                            <td className="px-3 py-2">{order.owner?.address || '—'}</td>
                            <td className="px-3 py-2">{order.coupon || '—'}</td>
                            <td className="px-3 py-2">{order.offer || '—'}</td>
                            <td className="px-3 py-2">{order.paymentMode || '—'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>] : [])
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
