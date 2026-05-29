"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import type { Order } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "../ui/badge";

type SortKey = "customer" | "amount" | "status" | "date";

export function OrdersTable({
  orders,
  searchable = false,
}: {
  orders: Order[];
  searchable?: boolean;
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({
    key: "date",
    dir: -1,
  });
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    let r = orders;
    if (q.trim()) {
      const t = q.toLowerCase();
      r = r.filter(
        (o) =>
          o.customer.toLowerCase().includes(t) ||
          o.email.toLowerCase().includes(t) ||
          o.id.toLowerCase().includes(t),
      );
    }
    return [...r].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av < bv) return -1 * sort.dir;
      if (av > bv) return 1 * sort.dir;
      return 0;
    });
  }, [orders, q, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));
  }

  const Th = ({ k, label, className }: { k: SortKey; label: string; className?: string }) => (
    <th className={cn("px-4 py-3 text-left font-medium", className)}>
      <button
        onClick={() => toggleSort(k)}
        className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
      >
        {label}
        <ArrowUpDown
          className={cn(
            "size-3.5",
            sort.key === k ? "text-brand" : "text-muted/50",
          )}
        />
      </button>
    </th>
  );

  return (
    <div>
      {searchable && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm md:max-w-xs">
          <Search className="size-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customers…"
            className="w-full bg-transparent outline-none placeholder:text-muted"
          />
        </div>
      )}

      <div className="overflow-x-auto scroll-thin">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-muted">
            <tr className="border-b border-line">
              <Th k="customer" label="Customer" />
              <th className="px-4 py-3 text-left font-medium">Order</th>
              <Th k="amount" label="Amount" />
              <Th k="status" label="Status" />
              <th className="px-4 py-3 text-left font-medium">Channel</th>
              <Th k="date" label="Date" />
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                className="border-b border-line/60 transition-colors hover:bg-elevated"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/12 text-xs font-medium text-brand">
                      {o.customer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium">{o.customer}</div>
                      <div className="truncate text-xs text-muted">{o.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{o.id}</td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatCurrency(o.amount)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-muted">{o.channel}</td>
                <td className="px-4 py-3 text-muted">{o.date}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
