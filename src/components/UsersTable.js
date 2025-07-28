// src/components/UsersTable.js
import React from 'react';
import { useState } from 'react';
import PremiumToggle from './PremiumToggle';
import UserOrdersTable from './UserOrdersTable';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

function formatAddress(address) {
  if (!address) return 'N/A';
  const { street, city, state, pincode } = address;
  return [street, city, state, pincode].filter(Boolean).join(', ');
}

export default function UsersTable({ users, onTogglePremium }) {
  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleExpand = (userId) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="overflow-x-auto rounded shadow bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">User Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">City</th>
            <th className="py-2 px-4">Address</th>
            <th className="py-2 px-4">Premium</th>
            <th className="py-2 px-4">Orders</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <React.Fragment key={user._id}>
              <tr className="border-t">
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4">{user._id}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.address?.city || '—'}</td>
                <td className="py-2 px-4">{formatAddress(user.address)}</td>
                <td className="py-2 px-4">
                  <PremiumToggle
                    isPremium={user.premiumUser}
                    onToggle={() => onTogglePremium(user._id)}
                  />
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => toggleExpand(user._id)}
                    className="text-gray-600 hover:text-black"
                    title="View Orders"
                  >
                    {expandedUserId === user._id ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                </td>
              </tr>
              {expandedUserId === user._id && (
                <tr>
                  <td colSpan="8" className="bg-gray-50 px-4 py-2">
                    <UserOrdersTable orders={user.orders} />
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
