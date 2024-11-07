import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

export function SkeletonSettings() {
  return Array.from({ length: 10 }).map((_, i) => {
    return (
      <div key={i} className="flex items-center justify-between">
        <Skeleton className="h-4 w-96" />
        <Switch disabled />
      </div>
    );
  });
}
