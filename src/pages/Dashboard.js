// src/pages/Dashboard.js
import { useEffect, useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import CityRankingTable from '../components/CityRankingTable';
import { useGlobalData } from '../context/GlobalDataContext';
import { setAuthToken } from '../api';

export default function Dashboard() {
  const { data, loadDataIfNeeded, loading } = useGlobalData();
  const orders = data.orders;

  const [totalDisplay, setTotalDisplay] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);

    // 🔁 Lazy load orders once
    loadDataIfNeeded('orders');
  }, []);

  // 🧠 Derived stats (memoized for performance)
  const {
    totalOrders,
    delivered,
    dispatched,
    cancelled,
  } = useMemo(() => {
    if (!orders) return { totalOrders: 0, delivered: 0, dispatched: 0, cancelled: 0 };

    return {
      totalOrders: orders.length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      dispatched: orders.filter((o) => o.status === 'Dispatched').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    };
  }, [orders]);

  // ✅ Count-up animation for total orders
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setTotalDisplay(count);
      if (count >= totalOrders) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [totalOrders]);

  if (loading.orders && !orders) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Orders" value={totalDisplay} color="bg-blue-500" />
        <DashboardCard title="Delivered" value={delivered} color="bg-green-500" />
        <DashboardCard title="Dispatched" value={dispatched} color="bg-yellow-500 text-black" />
        <DashboardCard title="Cancelled" value={cancelled} color="bg-red-500" />
      </div>

      {/* 📍 City Ranking Table */}
      <CityRankingTable orders={orders || []} />
    </div>
  );
}
