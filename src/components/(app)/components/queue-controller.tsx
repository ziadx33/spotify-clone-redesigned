import { AvatarData } from "@/components/avatar-data";
import { type TrackSliceType } from "@/state/slices/tracks";
import { type QueueList } from "@prisma/client";
import Link from "next/link";
import { PlayControls } from "./play-controls";
import { QueueProgressBar } from "./queue-progress-bar";
import { memo } from "react";

export function Comp({
  getData,
  data,
}: {
  getData?: TrackSliceType;
  data: QueueList;
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
        <QueueProgressBar duration={getData?.track?.duration} />
      </div>
      <PlayControls volumeLevel={data.volumeLevel} />
    </div>
  );
}

export const QueueController = memo(Comp);
