import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SidebarSkeletonItemProps = {
  className?: string;
};

export function SidebarSkeletonItem({ className }: SidebarSkeletonItemProps) {
  return (
    <Skeleton
      className={cn("h-[1.5rem] w-full justify-start gap-2", className)}
    />
  );
}
