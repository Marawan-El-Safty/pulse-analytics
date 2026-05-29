"use client";

import { RANGES, type RangeKey } from "@/lib/data";
import { cn } from "@/lib/utils";

export function RangeFilter({
  value,
  onChange,
}: {
  value: RangeKey;
  onChange: (k: RangeKey) => void;
}) {
  return (
    <div className="flex rounded-lg border border-line bg-panel p-0.5">
      {RANGES.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === r.key
              ? "bg-brand text-white"
              : "text-muted hover:text-fg",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
