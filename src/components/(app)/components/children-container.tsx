"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { type ReactNode } from "react";
import { MiniMenu } from "./mini-menu";
import { useMiniMenu } from "@/hooks/use-mini-menu";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useQueue } from "@/hooks/use-queue";

type ChildrenContainerProps = {
  children: ReactNode;
};

export function ChildrenContainer({ children }: ChildrenContainerProps) {
  const { value } = useMiniMenu();
  const {
    data: { status },
  } = useQueue();
  const menu = <MiniMenu />;
  return (
    <div className="flex h-[93%] w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ScrollArea
            className={cn(
              "relative size-full rounded-lg border-l border-t",
              value ? "border-r" : "",
            )}
            id="content-container"
          >
            {children}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle className="bg-transparent" disabled={!value} />
        <ResizablePanel
          className={!value || status === "loading" ? "hidden" : ""}
          defaultSize={27}
        >
          {menu}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
