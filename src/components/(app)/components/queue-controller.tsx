"use client";

import { AvatarData } from "@/components/avatar-data";
import { useQueue } from "@/hooks/use-queue";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { type ReactNode } from "react";
import { QueueProgressBar } from "./queue-progress-bar";
import { PlayControls } from "./play-controls";
import { QueueControls } from "./queue-controls";
import { type Queue, type QueueList } from "@prisma/client";
import { type TrackSliceType } from "@/state/slices/tracks";

export function QueueControllerContainer({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: { status, data },
    getTrack,
    currentQueue,
  } = useQueue();
  const currentTrack = getTrack(currentQueue?.queueData?.currentPlaying ?? "");
  console.log("f eldel", data);
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
      {status === "success" && (
        <QueueController
          getData={currentTrack}
          queueData={currentQueue?.queueData}
          data={data.queueList}
        />
      )}
    </div>
  );
}
function QueueController({
  getData,
  data,
  queueData,
}: {
  getData?: TrackSliceType;
  data: QueueList;
  queueData?: Queue;
}) {
  return (
    <div className="flex h-[10%] w-full border-t p-4">
      <div className="flex h-full w-56 gap-2">
        <AvatarData
          containerClasses="h-full w-fit rounded-md"
          src={getData?.track?.imgSrc}
          alt={getData?.track?.title}
        />
        <div className="my-auto flex flex-col font-semibold">
          <Link href={`/playlist/${getData?.album?.id}`}>
            {getData?.track?.title}
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground"
            href={`/artist/${getData?.track?.id}?playlist=${getData?.album?.id}`}
          >
            {getData?.author?.name}
          </Link>
        </div>
      </div>
      <div className="mx-auto flex w-fit flex-col items-center justify-center gap-2">
        <QueueControls />
        <QueueProgressBar
          defaultValue={queueData?.currentPlayingProgress}
          duration={getData?.track?.duration}
        />
      </div>
      <PlayControls volumeLevel={data.volumeLevel} />
    </div>
  );
}
