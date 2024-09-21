import { useQueue } from "@/hooks/use-queue";
import { useMemo } from "react";
import { QueueItem } from "./queue-item";

export function MiniMenuNextQueue() {
  const { currentQueue, getTrack } = useQueue();
  const id =
    currentQueue?.queueData?.trackList.indexOf(
      currentQueue?.queueData?.currentPlaying,
    ) ?? 0;
  const track = getTrack(currentQueue?.queueData?.trackList[id + 1] ?? "");
  const nextQueue = useMemo(() => {
    if (!track) return;

    return track ? (
      <QueueItem
        queue={currentQueue!}
        trackData={track}
        isNowPlaying={false}
        key={track?.track?.id}
      />
    ) : (
      <h1>no queue</h1>
    );
  }, [currentQueue, track]);
  return track ? (
    <div className="mx-auto mt-3.5 flex w-[95%] flex-col gap-2 overflow-hidden rounded-lg bg-muted p-3 pt-3.5">
      <h3 className="mb-2 font-semibold">Next in queue</h3>
      {nextQueue}
    </div>
  ) : null;
}
