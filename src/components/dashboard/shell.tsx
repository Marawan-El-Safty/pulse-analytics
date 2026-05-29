"use client";

import { useState, type ReactNode } from "react";
import { MobileSidebar, Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function Shell({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  const [menu, setMenu] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MobileSidebar open={menu} onClose={() => setMenu(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          subtitle={subtitle}
          right={right}
          onMenu={() => setMenu(true)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
