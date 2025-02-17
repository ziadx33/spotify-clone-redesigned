import { AvatarData } from "@/components/avatar-data";
import Link from "next/link";
import { PlayControls } from "./play-controls";
import { QueueProgressBar } from "./queue-progress-bar";
import { memo } from "react";
import { TrackContext } from "@/components/contexts/track-context";
import { PlaylistContext } from "@/components/contexts/playlist-context";
import { AuthorContext } from "@/components/contexts/author-context";
import { type QueueListSliceType } from "@/state/slices/queue-list";
import { useQueue } from "@/hooks/use-queue";

export function Comp({ data }: { data: QueueListSliceType["data"] }) {
  const { getTrack, getQueue } = useQueue();
  const currentQueue = getQueue(data?.queueList?.currentQueueId);
  const currentTrack = getTrack(currentQueue?.queueData?.currentPlaying ?? "");
  return;
  return (
    <div className="flex h-[10%] w-full border-t p-4">
      <div className="flex h-full w-56 gap-2">
        <TrackContext
          track={currentTrack?.track}
          playlist={currentTrack?.album}
        >
          <Link href={`/playlist/${currentTrack?.album?.id}`}>
            <AvatarData
              containerClasses="h-full w-fit rounded-md"
              src={currentTrack?.track?.imgSrc}
              alt={currentTrack?.track?.title}
            />
          </Link>
        </TrackContext>
        <div className="my-auto flex flex-col font-semibold">
          <PlaylistContext playlist={currentTrack?.album}>
            <Link href={`/playlist/${currentTrack?.album?.id}`}>
              {currentTrack?.track?.title}
            </Link>
          </PlaylistContext>
          <AuthorContext
            artist={currentTrack?.author}
            playlistId={currentTrack?.album?.id ?? "playing"}
          >
            <Link
              className="text-sm font-medium text-muted-foreground"
              href={`/artist/${currentTrack?.author?.id}?playlist=${currentTrack?.album?.id}`}
            >
              {currentTrack?.author?.name}
            </Link>
          </AuthorContext>
        </div>
      </div>
      <div className="mx-auto flex w-fit flex-col items-center justify-center gap-2">
        <QueueProgressBar duration={currentTrack?.track?.duration} />
      </div>
      <PlayControls volumeLevel={data?.queueList.volumeLevel ?? 50} />
    </div>
  );
}

export const QueueController = memo(Comp);
