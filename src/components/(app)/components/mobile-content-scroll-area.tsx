import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueue } from "@/hooks/use-queue";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export function MobileContentScrollArea({children}: {children: ReactNode}) {
    const {
        data: { status },
      } = useQueue();
    return    <ScrollArea
    className={cn("relative size-full rounded-lg border-l border-t", status === "success" && "pb-16")}
    id="content-container"
  >
    {children}
  </ScrollArea>
}