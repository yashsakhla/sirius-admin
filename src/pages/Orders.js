// pages/Orders.js

import { useEffect, useState } from 'react';
import OrdersTable from '../components/Orderstable';
import { getAllOrders, updateOrderStatus, setAuthToken } from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch orders on mount (admin)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);

    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
        alert(err?.response?.data?.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Handle status change from dropdown
  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, Deliverystatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err.message);
      alert("Failed to update status");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading orders...</p>;

  return (
    <div className="p-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">Track and update delivery status for all orders</p>
        </div>
      </div>

      {/* 💡 Enhanced Orders Table (can support filtering/sorting) */}
      <OrdersTable orders={orders} onChangeStatus={handleChangeStatus} />
    </div>
  );
}
