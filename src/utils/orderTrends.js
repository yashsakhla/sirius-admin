// Aggregates raw orders into monthly buckets for trend charts.
// Kept separate from the chart component so the bucketing logic (which
// field wins for revenue, how buckets are keyed/sorted) is testable and
// reusable without touching rendering code.

function orderRevenue(order) {
  if (typeof order.totalPrice === "number") return order.totalPrice;
  if (!Array.isArray(order.products)) return 0;
  return order.products.reduce(
    (sum, p) => sum + (typeof p === "string" ? 0 : p.price || 0),
    0
  );
}

/**
 * Buckets orders by calendar month (based on `order.date`) and sums the
 * order count and revenue per month. Returns buckets sorted chronologically,
 * capped to the most recent `maxMonths` (default 12) so the trend charts
 * stay readable.
 */
export function buildMonthlyOrderTrend(orders = [], maxMonths = 12) {
  const buckets = new Map();

  orders.forEach((order) => {
    const d = order?.date ? new Date(order.date) : null;
    if (!d || Number.isNaN(d.getTime())) return;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        sortKey: d.getFullYear() * 12 + d.getMonth(),
        count: 0,
        revenue: 0,
      });
    }

    const bucket = buckets.get(key);
    bucket.count += 1;
    bucket.revenue += orderRevenue(order);
  });

  return Array.from(buckets.values())
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(-maxMonths);
}
