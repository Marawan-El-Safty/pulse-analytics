"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Point } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

const W = 640;
const H = 260;
const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

/** Catmull-Rom → cubic bezier smoothing for a natural curve. */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function AreaChart({
  data,
  color = "#3b82f6",
  prefix = "",
}: {
  data: Point[];
  color?: string;
  prefix?: string;
}) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);

  const { pts, areaD, lineD, max, min, ticks } = useMemo(() => {
    const values = data.map((d) => d.value);
    const max = Math.max(...values) * 1.1;
    const min = Math.min(...values) * 0.9;
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;
    const pts = data.map((d, i) => ({
      x: PAD.left + (i / (data.length - 1)) * iw,
      y: PAD.top + ih - ((d.value - min) / (max - min || 1)) * ih,
    }));
    const lineD = smoothPath(pts);
    const areaD = `${lineD} L ${pts[pts.length - 1].x},${PAD.top + ih} L ${pts[0].x},${PAD.top + ih} Z`;
    const ticks = Array.from({ length: 4 }, (_, i) => min + ((max - min) / 3) * i);
    return { pts, areaD, lineD, max, min, ticks };
  }, [data]);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(
      ((x - PAD.left) / (W - PAD.left - PAD.right)) * (data.length - 1),
    );
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        style={{ height: 260 }}
      >
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* grid + y labels */}
        {ticks.map((t, i) => {
          const ih = H - PAD.top - PAD.bottom;
          const y = PAD.top + ih - ((t - min) / (max - min || 1)) * ih;
          return (
            <g key={i}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                stroke="rgb(var(--line))"
                strokeDasharray="3 4"
              />
              <text
                x={PAD.left - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-muted"
                fontSize="10"
              >
                {formatNumber(t, true)}
              </text>
            </g>
          );
        })}

        <motion.path
          d={areaD}
          fill={`url(#fill-${id})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={lineD}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* x labels (sparse) */}
        {data.map((d, i) =>
          i % Math.ceil(data.length / 6) === 0 ? (
            <text
              key={i}
              x={pts[i].x}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted"
              fontSize="10"
            >
              {d.label}
            </text>
          ) : null,
        )}

        {/* hover crosshair + dot */}
        {hover !== null && (
          <g>
            <line
              x1={pts[hover].x}
              x2={pts[hover].x}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke={color}
              strokeOpacity="0.4"
            />
            <circle cx={pts[hover].x} cy={pts[hover].y} r="5" fill={color} />
            <circle
              cx={pts[hover].x}
              cy={pts[hover].y}
              r="9"
              fill={color}
              fillOpacity="0.2"
            />
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-elevated px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${(pts[hover].x / W) * 100}%`,
            top: `${(pts[hover].y / H) * 100}%`,
          }}
        >
          <div className="text-muted">{data[hover].label}</div>
          <div className="font-semibold">
            {prefix}
            {formatNumber(data[hover].value)}
          </div>
        </div>
      )}
    </div>
  );
}
