import { Slider } from "@/components/ui/slider";
import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch } from "@/state/store";
import { parseDurationTime } from "@/utils/parse-duration-time";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { QueueControls } from "./queue-controls";
import { editTrackById } from "@/server/actions/track";
import { useQueue } from "@/hooks/use-queue";
import { useQueueController } from "@/hooks/use-queue-controller";
import { useUpdateUser } from "@/hooks/use-update-user";

type QueueSliderProps = {
  duration?: number;
};

export function QueueProgressBar({ duration = 0 }: QueueSliderProps) {
  const {
    data: { progress, isPlaying },
    skipToTime,
    disablePlayButton,
    editProgress,
  } = useQueueController();
  const isPlayingStarted = useRef(false);

  const [value, setValue] = useState(progress);
  const dispatch = useDispatch<AppDispatch>();
  const currentInterval = useRef<NodeJS.Timeout | null>(null);
  const {
    currentQueue,
    skipBy,
    currentData: { isLastQueue, isLastTrack },
    data: { data },
  } = useQueue();
  const currentRepeat = useRef(data?.queueList.repeatQueue);
  const { update, user } = useUpdateUser();

  const isTrackEdited = useRef(false);

  useEffect(() => {
    if (isTrackEdited.current || !currentQueue?.queueData?.currentPlaying)
      return;

    const request = async () => {
      const currentPlaying = currentQueue.queueData?.currentPlaying;
      if (currentPlaying) {
        await editTrackById({
          id: currentPlaying,
          data: { plays: { decrement: 1 } },
        });
        await update({
          data: {
            tracksHistory: [
              ...(user?.user?.tracksHistory ?? []),
              currentPlaying,
            ],
          },
        });
      }
    };

    void request();
    isTrackEdited.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQueue]);

  useEffect(() => {
    if (isPlayingStarted.current) return;
    if (!isPlaying) return;
    isPlayingStarted.current = true;
  }, [isPlaying]);

  useEffect(() => {
    const isCurNotEqualQueueList =
      currentRepeat.current !== data?.queueList.repeatQueue;
    if (isCurNotEqualQueueList) {
      currentRepeat.current = data?.queueList.repeatQueue;
    }
    const clear = () => {
      if (currentInterval.current) {
        clearInterval(currentInterval.current);
        currentInterval.current = null;
        return;
      }
    };
    if (!isPlaying) return clear();
    if (isCurNotEqualQueueList) {
      clear();
    }

    if (isPlaying)
      currentInterval.current = setInterval(() => {
        setValue((prevValue) => {
          if (prevValue >= duration) {
            const handleEndOfTrack = async () => {
              const currentTrackId = currentQueue?.queueData?.currentPlaying;
              if (!currentTrackId) return;

              if (data?.queueList.repeatQueue === "TRACK") {
                editProgress(0);
                await skipToTime(0, currentTrackId);
              } else if (isLastQueue && isLastTrack) {
                let nextTrack: string | undefined = currentTrackId;
                if (data?.queueList.repeatQueue === "PLAYLIST") {
                  nextTrack = await skipBy(
                    currentQueue.queueData!.trackList[0]!,
                  );
                }
                editProgress(0);

                void skipToTime(0, nextTrack);
              } else {
                const nextTrack = await skipBy(1);
                if (!nextTrack)
                  if (currentInterval.current)
                    clearInterval(currentInterval.current);
                  else {
                    editProgress(0);
                    void skipToTime(0, nextTrack);
                  }
              }
            };

            void handleEndOfTrack();
            return data?.queueList.repeatQueue === "TRACK" ||
              (isLastQueue && isLastTrack)
              ? 0
              : duration;
          }

          return prevValue + 1;
        });
      }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, data?.queueList.repeatQueue]);

  const onSliderChange = async (newValue: number) => {
    setValue(newValue);

    if (Math.abs(newValue - progress) > 1) {
      void skipToTime(newValue);
    }
  };

  const editProgressFn = (editPromise = true) => {
    if (!isPlayingStarted.current) return;
    isPlayingStarted.current = true;
    if (progress === value) return;
    if (!isPlaying && editPromise) {
      editProgress(value);
    }
    dispatch(editQueueController({ progress: value }));
  };

  useEffect(() => {
    editProgressFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  useEffect(() => {
    setValue(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  useEffect(() => {
    if (isPlaying) return;
    editProgressFn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <QueueControls />
      <div className="flex gap-2">
        <h5 className="w-10">{parseDurationTime(value)}</h5>
        <Slider
          disabled={disablePlayButton}
          value={[value]}
          onValueChange={(v) => onSliderChange(v[0] ?? 0)}
          unselectable="off"
          max={duration}
          step={1}
          className="w-[30rem]"
        />
        <h5 className="ml-0.5 w-10">{parseDurationTime(duration)}</h5>
      </div>
    </>
  );
}
