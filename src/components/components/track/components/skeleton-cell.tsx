import { Skeleton } from "@/components/ui/skeleton";
import { TableCell } from "@/components/ui/table";

export function SkeletonCell({ className }: { className?: string }) {
  return (
    <TableCell>
      <Skeleton className={className} />
    </TableCell>
  );
}
