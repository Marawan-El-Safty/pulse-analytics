import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  Paid: "bg-success/12 text-success",
  Pending: "bg-warn/12 text-warn",
  Refunded: "bg-danger/12 text-danger",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        STYLES[status] ?? "bg-muted/15 text-muted",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
