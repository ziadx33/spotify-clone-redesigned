"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { type ReactNode } from "react";
import { MiniMenu } from "./mini-menu";
import { useMiniMenu } from "@/hooks/use-mini-menu";
import { cn } from "@/lib/utils";

type ChildrenContainerProps = {
  children: ReactNode;
};

export function ChildrenContainer({ children }: ChildrenContainerProps) {
  const { value } = useMiniMenu();
  return (
    <div className="flex h-[93%]">
      <ScrollArea
        className={cn(
          "w-full rounded-lg border-l border-t",
          value ? "border-r" : "",
        )}
      >
        {children}
      </ScrollArea>
      <MiniMenu />
    </div>
  );
}
