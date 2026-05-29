"use client";

import { motion } from "framer-motion";
import type { Point } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function BarChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex h-[260px] flex-col justify-end gap-3 px-1">
      {data.map((d, i) => (
        <div key={d.label} className="group flex items-center gap-3">
          <span className="w-16 shrink-0 text-right text-xs text-muted">
            {d.label}
          </span>
          <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-bg">
            <motion.div
              className="h-full rounded-md bg-gradient-to-r from-brand to-brand-soft"
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
            />
          </div>
          <span className="w-16 shrink-0 text-xs font-medium tabular-nums">
            {formatCurrency(d.value, true)}
          </span>
        </div>
      ))}
    </div>
  );
}
