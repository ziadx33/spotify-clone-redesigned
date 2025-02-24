"use client";

import { useQueue } from "@/hooks/use-queue";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { QueueController } from "./queue-controller";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileQueueController } from "./mobile-queue-controller";

export function QueueControllerContainer({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: { status, data },
  } = useQueue();
  const isMobile = useIsMobile();

  return (
    <div className="flex size-full flex-col items-start">
      <div
        className={cn(
          "flex w-full",
          status === "success" && !isMobile ? "h-[90%]" : "h-full",
        )}
      >
        {children}
      </div>
      {status === "success" &&
        (!isMobile ? (
          <QueueController data={data} />
        ) : (
          <MobileQueueController data={data} />
        ))}
    </div>
  );
}
