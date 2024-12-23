"use client";

import { useQueue } from "@/hooks/use-queue";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { QueueController } from "./queue-controller";

export function QueueControllerContainer({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: { status, data },
  } = useQueue();

  return (
    <div className="flex size-full flex-col items-start">
      <div
        className={cn(
          "flex w-full",
          status === "success" ? "h-[90%]" : "h-full",
        )}
      >
        {children}
      </div>
      {status === "success" && <QueueController data={data} />}
    </div>
  );
}
