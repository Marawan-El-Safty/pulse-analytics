"use client";

import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";

export function Topbar({
  title,
  subtitle,
  onMenu,
  right,
}: {
  title: string;
  subtitle?: string;
  onMenu: () => void;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 py-3.5 sm:px-6">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:text-fg lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-sm text-muted">{subtitle}</p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm text-muted md:flex">
            <Search className="size-4" />
            <input
              placeholder="Search…"
              className="w-40 bg-transparent outline-none placeholder:text-muted"
            />
            <kbd className="rounded border border-line px-1.5 text-xs">⌘K</kbd>
          </div>
          {right}
          <ThemeToggle />
          <div className="size-9 rounded-full bg-gradient-to-br from-brand to-cyan" />
        </div>
      </div>
    </header>
  );
}
