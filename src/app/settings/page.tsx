"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Shell } from "@/components/dashboard/shell";
import { Card, CardHeader } from "@/components/ui/card";

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
      />
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm text-muted">{desc}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand" : "bg-line",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("Marawan Elsafty");
  const [email, setEmail] = useState("hello@pulse.app");
  const [prefs, setPrefs] = useState({
    weekly: true,
    productUpdates: false,
    alerts: true,
  });
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Shell title="Settings" subtitle="Manage your account and preferences.">
      <div className="grid max-w-4xl gap-6">
        {/* Profile */}
        <Card>
          <CardHeader title="Profile" subtitle="Update your personal details." />
          <form onSubmit={save} className="space-y-4 px-5 pb-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-soft"
              >
                Save changes
              </button>
              {saved && (
                <span className="text-sm text-success">Saved ✓</span>
              )}
            </div>
          </form>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader title="Appearance" subtitle="Choose your interface theme." />
          <div className="flex gap-3 px-5 pb-5">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-colors",
                  theme === t
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-line text-muted hover:text-fg",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader title="Notifications" subtitle="What should we email you about?" />
          <div className="divide-y divide-line px-5 pb-3">
            <Toggle
              label="Weekly summary"
              desc="A digest of your store's performance every Monday."
              checked={prefs.weekly}
              onChange={(v) => setPrefs((p) => ({ ...p, weekly: v }))}
            />
            <Toggle
              label="Product updates"
              desc="News about new features and improvements."
              checked={prefs.productUpdates}
              onChange={(v) => setPrefs((p) => ({ ...p, productUpdates: v }))}
            />
            <Toggle
              label="Real-time alerts"
              desc="Get notified about large orders and refunds."
              checked={prefs.alerts}
              onChange={(v) => setPrefs((p) => ({ ...p, alerts: v }))}
            />
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="border-danger/30">
          <CardHeader title="Danger zone" subtitle="Irreversible actions." />
          <div className="px-5 pb-5">
            <button className="rounded-lg border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10">
              Delete account
            </button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
