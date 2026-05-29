import { Card } from "../ui/card";

function Block({ className }: { className?: string }) {
  return <div className={`shimmer rounded-md bg-elevated ${className}`} />;
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Block className="h-4 w-24" />
            <Block className="mt-4 h-7 w-32" />
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <Block className="h-5 w-40" />
          <Block className="mt-5 h-[260px] w-full" />
        </Card>
        <Card className="p-5">
          <Block className="h-5 w-32" />
          <Block className="mt-5 h-[260px] w-full" />
        </Card>
      </div>
      <Card className="p-5">
        <Block className="h-5 w-40" />
        <Block className="mt-5 h-64 w-full" />
      </Card>
    </div>
  );
}
