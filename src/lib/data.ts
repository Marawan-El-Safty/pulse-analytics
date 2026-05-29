/**
 * Local analytics data engine — deterministic, range-aware, zero backend.
 * Everything is generated in-process from a seed so the dashboard is fully
 * interactive (date ranges recompute KPIs, charts, and trends) while staying
 * free to host anywhere.
 */

export type RangeKey = "7d" | "30d" | "90d";
export const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Point {
  label: string;
  value: number;
}

export interface Kpi {
  id: string;
  label: string;
  value: number;
  delta: number; // % vs previous period
  kind: "currency" | "number" | "percent";
  spark: number[];
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "Paid" | "Pending" | "Refunded";
  date: string;
  channel: string;
}

const NAMES = [
  "Olivia Bennett", "Liam Carter", "Noah Schmidt", "Emma Rossi", "Ava Müller",
  "Lucas Silva", "Mia Tanaka", "Ethan Brooks", "Sofia Costa", "Leo Andersen",
  "Maya Haddad", "Daniel Kim", "Zoe Laurent", "Adam Novak", "Layla Hassan",
];
const CHANNELS = ["Organic", "Paid Ads", "Referral", "Social", "Email"];
const STATUSES: Order["status"][] = ["Paid", "Paid", "Paid", "Pending", "Refunded"];

function dayLabel(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Build a smooth-ish daily series with an upward bias. */
function series(rand: () => number, days: number, base: number, vol: number) {
  const out: Point[] = [];
  let v = base;
  for (let i = days - 1; i >= 0; i--) {
    v = Math.max(0, v + (rand() - 0.45) * vol);
    out.push({ label: dayLabel(i), value: Math.round(v) });
  }
  return out;
}

function sum(arr: Point[]) {
  return arr.reduce((a, p) => a + p.value, 0);
}

export function getDashboard(days: number) {
  const rand = mulberry32(days * 7919 + 13);

  const revenue = series(rand, days, 4200, 1400);
  const visitors = series(rand, days, 9000, 2600);
  const orders = series(rand, days, 320, 90);

  // Previous-period totals to compute trend deltas.
  const prevRand = mulberry32(days * 6113 + 29);
  const prevRevenue = sum(series(prevRand, days, 3900, 1400));
  const prevVisitors = sum(series(prevRand, days, 8600, 2600));
  const prevOrders = sum(series(prevRand, days, 300, 90));

  const totalRevenue = sum(revenue);
  const totalVisitors = sum(visitors);
  const totalOrders = sum(orders);
  const conversion = (totalOrders / totalVisitors) * 100;
  const prevConversion = (prevOrders / prevVisitors) * 100;

  const pct = (cur: number, prev: number) =>
    prev === 0 ? 0 : ((cur - prev) / prev) * 100;

  const kpis: Kpi[] = [
    {
      id: "revenue",
      label: "Total Revenue",
      value: totalRevenue,
      delta: pct(totalRevenue, prevRevenue),
      kind: "currency",
      spark: revenue.slice(-12).map((p) => p.value),
    },
    {
      id: "visitors",
      label: "Visitors",
      value: totalVisitors,
      delta: pct(totalVisitors, prevVisitors),
      kind: "number",
      spark: visitors.slice(-12).map((p) => p.value),
    },
    {
      id: "orders",
      label: "Orders",
      value: totalOrders,
      delta: pct(totalOrders, prevOrders),
      kind: "number",
      spark: orders.slice(-12).map((p) => p.value),
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: conversion,
      delta: pct(conversion, prevConversion),
      kind: "percent",
      spark: orders.slice(-12).map((p, i) => p.value / (visitors.slice(-12)[i]?.value || 1) * 100),
    },
  ];

  // Channel breakdown (bar)
  const channels: Point[] = CHANNELS.map((label) => ({
    label,
    value: Math.round(totalRevenue * (0.1 + rand() * 0.25)),
  }));

  // Traffic sources (donut) — normalized
  const trafficRaw = ["Desktop", "Mobile", "Tablet"].map((label) => ({
    label,
    value: Math.round(20 + rand() * 80),
  }));
  const trafficTotal = sum(trafficRaw);
  const traffic = trafficRaw.map((t) => ({
    ...t,
    value: Math.round((t.value / trafficTotal) * 100),
  }));

  // Recent orders table
  const recent: Order[] = Array.from({ length: 24 }, (_, i) => {
    const name = NAMES[Math.floor(rand() * NAMES.length)];
    return {
      id: `#${(10248 + i).toString()}`,
      customer: name,
      email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@mail.com`,
      amount: Math.round(40 + rand() * 960),
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      date: dayLabel(Math.floor(rand() * days)),
      channel: CHANNELS[Math.floor(rand() * CHANNELS.length)],
    };
  });

  return { revenue, visitors, kpis, channels, traffic, recent };
}

export type Dashboard = ReturnType<typeof getDashboard>;
