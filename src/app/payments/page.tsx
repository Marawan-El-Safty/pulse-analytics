"use client";

import { useMemo } from "react";
import { getDashboard } from "@/lib/data";
import { Shell } from "@/components/dashboard/shell";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { AreaChart } from "@/components/dashboard/area-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function PaymentsPage() {
  const data = useMemo(() => getDashboard(90), []);

  const { collected, pending, refunded, paidOrders } = useMemo(() => {
    const sum = (s: string) =>
      data.recent.filter((o) => o.status === s).reduce((t, o) => t + o.amount, 0);
    return {
      collected: sum("Paid"),
      pending: sum("Pending"),
      refunded: sum("Refunded"),
      paidOrders: data.recent.filter((o) => o.status === "Paid"),
    };
  }, [data]);

  const cards = [
    { label: "Collected", value: collected, tone: "text-success" },
    { label: "Pending", value: pending, tone: "text-warn" },
    { label: "Refunded", value: refunded, tone: "text-danger" },
  ];

  return (
    <Shell title="Payments" subtitle="Money in, money out — at a glance.">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <Card key={c.label} className="p-5">
              <div className="text-sm text-muted">{c.label}</div>
              <div className={`mt-1 text-2xl font-semibold tabular-nums ${c.tone}`}>
                {formatCurrency(c.value)}
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader title="Net revenue" subtitle="Last 90 days" />
          <div className="px-2 pb-4">
            <AreaChart data={data.revenue} prefix="$" color="#22c55e" />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Successful payments"
            subtitle={`${paidOrders.length} transactions`}
          />
          <div className="px-5 pb-5">
            <OrdersTable orders={paidOrders} searchable />
          </div>
        </Card>
      </div>
    </Shell>
  );
}
