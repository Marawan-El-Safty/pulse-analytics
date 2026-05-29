"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { getDashboard, RANGES, type RangeKey } from "@/lib/data";
import { Shell } from "@/components/dashboard/shell";
import { RangeFilter } from "@/components/dashboard/range-filter";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaChart } from "@/components/dashboard/area-chart";
import { BarChart } from "@/components/dashboard/bar-chart";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { OverviewSkeleton } from "@/components/dashboard/skeleton";
import { Card, CardHeader } from "@/components/ui/card";

export default function OverviewPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [loading, setLoading] = useState(true);

  // Simulate an initial data fetch so the skeleton state is showcased.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [range]);

  const days = RANGES.find((r) => r.key === range)!.days;
  const data = useMemo(() => getDashboard(days), [days]);

  return (
    <Shell
      title="Overview"
      subtitle="Welcome back — here's how your store is performing."
      right={<RangeFilter value={range} onChange={setRange} />}
    >
      {loading ? (
        <OverviewSkeleton />
      ) : (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.kpis.map((kpi, i) => (
              <StatCard key={kpi.id} kpi={kpi} index={i} />
            ))}
          </div>

          {/* Revenue + traffic */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader
                title="Revenue"
                subtitle={`Last ${days} days`}
              />
              <div className="px-2 pb-4">
                <AreaChart data={data.revenue} prefix="$" />
              </div>
            </Card>
            <Card>
              <CardHeader title="Traffic by device" />
              <div className="flex items-center justify-center px-5 pb-6 pt-2">
                <DonutChart data={data.traffic} />
              </div>
            </Card>
          </div>

          {/* Channels + visitors */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Revenue by channel" />
              <div className="px-5 pb-6">
                <BarChart data={data.channels} />
              </div>
            </Card>
            <Card>
              <CardHeader title="Visitors" subtitle={`Last ${days} days`} />
              <div className="px-2 pb-4">
                <AreaChart data={data.visitors} color="#06b6d4" />
              </div>
            </Card>
          </div>

          {/* Recent orders */}
          <Card>
            <CardHeader
              title="Recent orders"
              subtitle="Latest transactions across all channels"
              action={
                <button className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-fg">
                  <Download className="size-4" />
                  Export
                </button>
              }
            />
            <div className="px-2 pb-3">
              <OrdersTable orders={data.recent.slice(0, 8)} />
            </div>
          </Card>
        </div>
      )}
    </Shell>
  );
}
