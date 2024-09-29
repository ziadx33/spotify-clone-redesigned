import { AvatarData } from "@/components/avatar-data";
import { TrackMoreButton } from "@/components/components/track-more-button";
import { useQueue } from "@/hooks/use-queue";
import { useQueueController } from "@/hooks/use-queue-controller";
import { cn } from "@/lib/utils";
import { type QueueSliceType } from "@/state/slices/queue-list";
import { type TrackSliceType } from "@/state/slices/tracks";
import Link from "next/link";

type QueueItemProps = {
  trackData: TrackSliceType;
  isNowPlaying: boolean;
  queue: QueueSliceType;
};

export function QueueItem({
  trackData: data,
  isNowPlaying,
  queue,
}: QueueItemProps) {
  const { skipBy } = useQueue();
  const clickHandler = async () => {
    await skipBy(data.track?.id ?? "", queue.queueData?.id);
  };
  return (
    <button
      onClick={clickHandler}
      className="group relative flex h-16 w-full gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
    >
      <AvatarData
        containerClasses="rounded-md h-full w-fit"
        alt={data.track?.title}
        src={data.track?.imgSrc}
      />
      <div className="flex flex-col items-start">
        <h4 className={cn("mb-0", isNowPlaying ? "text-primary" : "")}>
          {data.track?.title}
        </h4>
        <Link
          href={`/artist/${data.author?.id}?playlist=${data.album?.id}`}
          className="text-sm text-muted-foreground"
        >
          {data.author?.name}
        </Link>
      </div>
      <TrackMoreButton
        className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
        track={data.track}
        playlist={data.album}
      />
    </button>
  );
}
