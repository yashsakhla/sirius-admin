// src/pages/Dashboard.js
import { useEffect, useState, useMemo, useRef } from 'react';
import DashboardCard from '../components/DashboardCard';
import CityRankingTable from '../components/CityRankingTable';
import TrendChart from '../components/charts/TrendChart';
import { useGlobalData } from '../context/GlobalDataContext';
import { setAuthToken } from '../api';
import { buildMonthlyOrderTrend } from '../utils/orderTrends';

export default function Dashboard() {
  const { data, loadDataIfNeeded, loading } = useGlobalData();
  const orders = data.orders;

  const [totalDisplay, setTotalDisplay] = useState(0);
  const loadDataRef = useRef(loadDataIfNeeded);
  loadDataRef.current = loadDataIfNeeded;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    loadDataRef.current('orders');
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

  const monthlyTrend = useMemo(() => buildMonthlyOrderTrend(orders || []), [orders]);
  const ordersSeries = useMemo(
    () => monthlyTrend.map((m) => ({ label: m.label, value: m.count })),
    [monthlyTrend]
  );
  const revenueSeries = useMemo(
    () => monthlyTrend.map((m) => ({ label: m.label, value: m.revenue })),
    [monthlyTrend]
  );

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

  if (loading.orders && !orders) return <p className="p-6 text-gray-500">Loading orders...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of orders and delivery performance</p>
        </div>
      </div>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Orders" value={totalDisplay} color="bg-blue-500" />
        <DashboardCard title="Delivered" value={delivered} color="bg-green-500" />
        <DashboardCard title="Dispatched" value={dispatched} color="bg-yellow-500 text-black" />
        <DashboardCard title="Cancelled" value={cancelled} color="bg-red-500" />
      </div>

      {/* 📈 Orders & Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart
          title="Orders Trend"
          subtitle="Number of orders placed per month"
          points={ordersSeries}
          color="#2a78d6"
          valueLabel="Orders"
          formatValue={(v) => Math.round(v).toLocaleString('en-IN')}
        />
        <TrendChart
          title="Revenue Generated"
          subtitle="Total order value per month"
          points={revenueSeries}
          color="#eb6834"
          valueLabel="Revenue"
          formatValue={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
        />
      </div>

      {/* 📍 City Ranking Table */}
      <CityRankingTable orders={orders || []} />
    </div>
  );
}
