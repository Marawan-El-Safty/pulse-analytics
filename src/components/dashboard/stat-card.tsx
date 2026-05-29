"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Kpi } from "@/lib/data";
import { useCountUp } from "@/hooks/use-count-up";
import { cn, formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { Card } from "../ui/card";
import { Sparkline } from "./sparkline";

function display(kind: Kpi["kind"], value: number) {
  if (kind === "currency") return formatCurrency(value);
  if (kind === "percent") return `${value.toFixed(2)}%`;
  return formatNumber(Math.round(value));
}

export function StatCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const animated = useCountUp(kpi.value);
  const up = kpi.delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <span className="text-sm text-muted">{kpi.label}</span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
              up ? "bg-success/12 text-success" : "bg-danger/12 text-danger",
            )}
          >
            {up ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {formatPercent(kpi.delta)}
          </span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            {display(kpi.kind, animated)}
          </span>
          <Sparkline
            data={kpi.spark}
            color={up ? "#22c55e" : "#ef4444"}
          />
        </div>
      </Card>
    </motion.div>
  );
}
