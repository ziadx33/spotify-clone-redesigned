import { useQueue } from "@/hooks/use-queue";
import { useMemo } from "react";
import { QueueItem } from "./queue-item";

export function MiniMenuNextQueue() {
  const {
    getQueue,
    data: { data: queueListData },
    getTrack,
    getCurrentData,
  } = useQueue();
  const currentQueue = getQueue(queueListData?.queueList.currentQueueId);
  const currentData = getCurrentData(currentQueue);
  const { isLastTrack, nextQueue: nextQueueData } = currentData || {};

  const id =
    currentQueue?.queueData?.trackList.indexOf(
      currentQueue?.queueData?.currentPlaying,
    ) ?? 0;

  const nextTrack = getTrack(
    !isLastTrack
      ? currentQueue?.queueData?.trackList[id + 1]
      : nextQueueData?.queueData?.trackList?.[0],
    isLastTrack ? nextQueueData?.queueData?.id : undefined,
  );

  const nextQueue = useMemo(() => {
    if (!nextTrack.track) return;

    return (
      <QueueItem
        queue={currentQueue!}
        trackData={nextTrack}
        isNowPlaying={false}
        key={nextTrack?.track?.id}
      />
    );
  }, [currentQueue, nextTrack]);

  return nextQueue ? (
    <div className="mx-auto mt-3.5 flex w-[95%] flex-col gap-2 overflow-hidden rounded-lg bg-muted p-3 pt-3.5">
      <h3 className="mb-2 font-semibold">Next in queue</h3>
      {nextQueue}
    </div>
  ) : null;
}
