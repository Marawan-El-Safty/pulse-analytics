"use client";

import { useMemo, useState } from "react";
import { getDashboard, RANGES, type RangeKey } from "@/lib/data";
import { Shell } from "@/components/dashboard/shell";
import { RangeFilter } from "@/components/dashboard/range-filter";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaChart } from "@/components/dashboard/area-chart";
import { BarChart } from "@/components/dashboard/bar-chart";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { Card, CardHeader } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("90d");
  const days = RANGES.find((r) => r.key === range)!.days;
  const data = useMemo(() => getDashboard(days), [days]);

  return (
    <Shell
      title="Analytics"
      subtitle="Deep-dive into revenue, traffic, and channel performance."
      right={<RangeFilter value={range} onChange={setRange} />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.kpis.map((kpi, i) => (
            <StatCard key={kpi.id} kpi={kpi} index={i} />
          ))}
        </div>

        <Card>
          <CardHeader title="Revenue trend" subtitle={`Last ${days} days`} />
          <div className="px-2 pb-4">
            <AreaChart data={data.revenue} prefix="$" />
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Visitors" subtitle={`Last ${days} days`} />
            <div className="px-2 pb-4">
              <AreaChart data={data.visitors} color="#06b6d4" />
            </div>
          </Card>
          <Card>
            <CardHeader title="Traffic by device" />
            <div className="flex items-center justify-center px-5 pb-6 pt-2">
              <DonutChart data={data.traffic} />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Revenue by channel" />
          <div className="px-5 pb-6">
            <BarChart data={data.channels} />
          </div>
        </Card>
      </div>
    </Shell>
  );
}
