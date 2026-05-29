"use client";

import { useMemo } from "react";
import { getDashboard } from "@/lib/data";
import { Shell } from "@/components/dashboard/shell";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { Card, CardHeader } from "@/components/ui/card";

export default function CustomersPage() {
  const data = useMemo(() => getDashboard(90), []);

  return (
    <Shell
      title="Customers"
      subtitle="Search, sort, and review every customer order."
    >
      <Card>
        <CardHeader
          title="All orders"
          subtitle={`${data.recent.length} records`}
        />
        <div className="px-5 pb-5">
          <OrdersTable orders={data.recent} searchable />
        </div>
      </Card>
    </Shell>
  );
}
