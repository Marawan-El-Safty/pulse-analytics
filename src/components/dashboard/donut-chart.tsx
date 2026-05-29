"use client";

import { motion } from "framer-motion";
import type { Point } from "@/lib/data";

const COLORS = ["#3b82f6", "#06b6d4", "#f59e0b"];
const SIZE = 180;
const STROKE = 22;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function DonutChart({ data }: { data: Point[] }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = frac * C;
            const seg = (
              <motion.circle
                key={d.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              />
            );
            offset += dash;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold">{total}%</span>
          <span className="text-xs text-muted">total</span>
        </div>
      </div>

      <ul className="space-y-3">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-muted">{d.label}</span>
            <span className="ml-auto font-medium tabular-nums">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
