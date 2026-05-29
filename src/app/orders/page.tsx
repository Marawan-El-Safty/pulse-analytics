"use client";

import { useMemo } from "react";
import { CheckCircle2, Clock, RotateCcw, ShoppingBag } from "lucide-react";
import { getDashboard } from "@/lib/data";
import { Shell } from "@/components/dashboard/shell";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { Card, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function OrdersPage() {
  const data = useMemo(() => getDashboard(90), []);

  const stats = useMemo(() => {
    const paid = data.recent.filter((o) => o.status === "Paid");
    const pending = data.recent.filter((o) => o.status === "Pending");
    const refunded = data.recent.filter((o) => o.status === "Refunded");
    const sum = (a: typeof data.recent) => a.reduce((t, o) => t + o.amount, 0);
    return [
      { label: "Total orders", value: String(data.recent.length), icon: ShoppingBag, tone: "text-brand bg-brand/12" },
      { label: "Paid", value: formatCurrency(sum(paid)), icon: CheckCircle2, tone: "text-success bg-success/12" },
      { label: "Pending", value: String(pending.length), icon: Clock, tone: "text-warn bg-warn/12" },
      { label: "Refunded", value: String(refunded.length), icon: RotateCcw, tone: "text-danger bg-danger/12" },
    ];
  }, [data]);

  return (
    <Shell title="Orders" subtitle="Every order across all channels.">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="flex items-center gap-4 p-5">
              <span className={`grid size-11 place-items-center rounded-lg ${s.tone}`}>
                <s.icon className="size-5" />
              </span>
              <div>
                <div className="text-sm text-muted">{s.label}</div>
                <div className="text-xl font-semibold tabular-nums">{s.value}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader title="All orders" subtitle={`${data.recent.length} records`} />
          <div className="px-5 pb-5">
            <OrdersTable orders={data.recent} searchable />
          </div>
        </Card>
      </div>
    </Shell>
  );
}
