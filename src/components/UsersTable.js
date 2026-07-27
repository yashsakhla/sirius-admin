import React, { useState } from 'react';
import PremiumToggle from './PremiumToggle';
import UserOrdersTable from './UserOrdersTable';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { getUserOrders } from '../api'; // make sure this is correctly imported

function formatAddress(address) {
  if (!address) return 'N/A';
  const { street, city, state, pincode } = address;
  return [street, city, state, pincode].filter(Boolean).join(', ');
}

export default function UsersTable({ users, onTogglePremium }) {
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userOrders, setUserOrders] = useState({}); // { userId: [orders...] }
  const [loadingOrders, setLoadingOrders] = useState({}); // { userId: boolean }

  const toggleExpand = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }
    setExpandedUserId(userId);

    // Only fetch if not already loaded
    if (!userOrders[userId] && !loadingOrders[userId]) {
      setLoadingOrders((prev) => ({ ...prev, [userId]: true }));
      try {
        const res = await getUserOrders(userId); // assumes this returns { data: [...] }
        setUserOrders((prev) => ({ ...prev, [userId]: res.data }));
      } catch (err) {
        setUserOrders((prev) => ({ ...prev, [userId]: [] }));
        alert('Failed to load user orders');
      } finally {
        setLoadingOrders((prev) => ({ ...prev, [userId]: false }));
      }
    }
  };

  return (
    <div className="table-shell">
      <table className="min-w-full text-sm">
        <thead className="table-head-row">
          <tr>
            <th className="table-cell">#</th>
            <th className="table-cell">User ID</th>
            <th className="table-cell">User Name</th>
            <th className="table-cell">Email</th>
            <th className="table-cell">City</th>
            <th className="table-cell">Address</th>
            <th className="table-cell">Premium</th>
            <th className="table-cell">Orders</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <React.Fragment key={user._id}>
              <tr className="table-row">
                <td className="table-cell text-gray-500">{idx + 1}</td>
                <td className="table-cell text-gray-500">{user._id}</td>
                <td className="table-cell font-medium text-gray-900">{user.name}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">{user.address?.city || '—'}</td>
                <td className="table-cell">{formatAddress(user.address)}</td>
                <td className="table-cell">
                  <PremiumToggle
                    isPremium={user.premiumUser}
                    onToggle={() => onTogglePremium(user._id)}
                  />
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => toggleExpand(user._id)}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    title="View Orders"
                  >
                    {expandedUserId === user._id ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                </td>
              </tr>
              {expandedUserId === user._id && (
                <tr>
                  <td colSpan="8" className="bg-gray-50/70 px-4 py-3">
                    {loadingOrders[user._id] ? (
                      <div className="text-sm text-gray-500">Loading Orders...</div>
                    ) : (
                      <UserOrdersTable orders={userOrders[user._id] || []} />
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
