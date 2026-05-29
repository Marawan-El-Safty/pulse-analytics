"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "#", label: "Analytics", icon: BarChart3 },
  { href: "#", label: "Orders", icon: ShoppingCart },
  { href: "#", label: "Payments", icon: CreditCard },
  { href: "#", label: "Activity", icon: Activity },
  { href: "#", label: "Settings", icon: Settings },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = item.href === pathname;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand/12 text-brand"
                : "text-muted hover:bg-elevated hover:text-fg",
            )}
          >
            <item.icon className="size-4.5 size-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
        <Activity className="size-4" />
      </span>
      <span className="text-lg font-semibold tracking-tight">Pulse</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-line bg-panel lg:block">
      <div className="sticky top-0">
        <Brand />
        <NavList />
      </div>
    </aside>
  );
}

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-line bg-panel lg:hidden"
          >
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-lg text-muted hover:text-fg"
              >
                <X className="size-5" />
              </button>
            </div>
            <NavList onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
