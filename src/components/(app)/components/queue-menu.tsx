import { useQueue } from "@/hooks/use-queue";
import { useMemo } from "react";
import { QueueItem } from "./queue-item";

export function QueueMenu() {
  const {
    data: { data },
    getTrack,
    getQueue,
  } = useQueue();
  const currentQueue = getQueue(data?.queueList.currentQueueId);
  const currentTrackId = currentQueue?.queueData?.currentPlaying ?? "";
  const currentTrack = getTrack(currentTrackId);

  const queueItems = useMemo(() => {
    return data?.queues.map((queue) => {
      const isCurrentQueue =
        queue.queueData?.id === currentQueue?.queueData?.id;
      const trackList = queue.queueData?.trackList ?? [];

      const tracks = [...(queue.dataTracks?.tracks ?? [])]
        ?.sort((a, b) => {
          return trackList.indexOf(a.id) - trackList.indexOf(b.id);
        })
        ?.slice(
          isCurrentQueue ? (trackList.indexOf(currentTrackId) ?? 0) + 1 : 0,
        );
      if (!tracks || tracks.length === 0) return null;

      const typeId = queue.queueData?.typeId?.replaceAll("-", " ");

      console.log(
        "hases eny tamam",
        queue?.playlistTypeData?.title,
        queue.artistTypeData?.artistPick,
      );

      return (
        <div key={queue.queueData?.id} className="flex w-full flex-col">
          <h3 className="mb-2.5 text-lg font-semibold">
            Next from:{" "}
            {queue?.artistTypeData?.name ??
              queue?.playlistTypeData?.title ??
              typeId?.slice(0, typeId?.length - 2)}
          </h3>
          {tracks.map((track) => {
            const trackData = getTrack(track.id, queue.queueData?.id);
            return (
              <QueueItem
                queue={queue}
                key={track.id}
                trackData={trackData}
                isNowPlaying={false}
              />
            );
          })}
        </div>
      );
    });
  }, [currentTrackId, currentQueue?.queueData?.id, data?.queues, getTrack]);

  return (
    <div className="flex w-full flex-col gap-6 p-4 pb-2.5 pt-4">
      <div className="flex w-full flex-col">
        <h3 className="mb-2.5 text-lg font-semibold">Now Playing</h3>
        <QueueItem
          queue={currentQueue!}
          trackData={currentTrack}
          isNowPlaying
        />
      </div>
      {queueItems}
    </div>
  );
}
