"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, RotateCcw, UserPlus } from "lucide-react";
import { getDashboard, type Order } from "@/lib/data";
import { Shell } from "@/components/dashboard/shell";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Event = {
  icon: typeof CheckCircle2;
  tone: string;
  text: React.ReactNode;
  time: string;
};

function toEvents(orders: Order[]): Event[] {
  return orders.map((o, i) => {
    if (o.status === "Refunded")
      return {
        icon: RotateCcw,
        tone: "text-danger bg-danger/12",
        text: (
          <>
            Refund issued to <b>{o.customer}</b> for{" "}
            {formatCurrency(o.amount)}
          </>
        ),
        time: o.date,
      };
    if (o.status === "Pending")
      return {
        icon: Clock,
        tone: "text-warn bg-warn/12",
        text: (
          <>
            <b>{o.customer}</b> placed order {o.id} — awaiting payment
          </>
        ),
        time: o.date,
      };
    if (i % 4 === 0)
      return {
        icon: UserPlus,
        tone: "text-brand bg-brand/12",
        text: (
          <>
            New customer <b>{o.customer}</b> signed up via {o.channel}
          </>
        ),
        time: o.date,
      };
    return {
      icon: CheckCircle2,
      tone: "text-success bg-success/12",
      text: (
        <>
          Payment received from <b>{o.customer}</b> —{" "}
          {formatCurrency(o.amount)}
        </>
      ),
      time: o.date,
    };
  });
}

export default function ActivityPage() {
  const data = useMemo(() => getDashboard(90), []);
  const events = useMemo(() => toEvents(data.recent), [data]);

  return (
    <Shell title="Activity" subtitle="A live feed of everything happening.">
      <Card className="p-6">
        <ol className="relative space-y-6">
          <span className="absolute bottom-2 left-[18px] top-2 w-px bg-line" />
          {events.map((e, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="relative flex items-start gap-4"
            >
              <span
                className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full ring-4 ring-panel ${e.tone}`}
              >
                <e.icon className="size-4" />
              </span>
              <div className="flex-1 pt-1">
                <p className="text-sm">{e.text}</p>
                <p className="mt-0.5 text-xs text-muted">{e.time}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </Card>
    </Shell>
  );
}
