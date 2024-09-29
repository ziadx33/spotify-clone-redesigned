import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch, type RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentQueue } from "@/state/slices/queue-list";
import { useEffect, useRef } from "react";
import { useAudios } from "./use-audios";

export function useQueueController() {
  const data = useSelector((state: RootState) => state.queueController.data);
  const currentQueue = useSelector((data: RootState) =>
    getCurrentQueue({ queue: data.queueList }),
  );
  const dispatch = useDispatch<AppDispatch>();

  const queueData = useSelector((state: RootState) => state.queueList.data);
  const setCurrentDataDone = useRef(false);
  const audios = useAudios();

  useEffect(() => {
    if (setCurrentDataDone.current) return;
    if (!queueData) return;

    dispatch(
      editQueueController({
        progress: currentQueue?.queueData?.currentPlayingProgress,
        volume: queueData.queueList.volumeLevel,
        currentTrackId: currentQueue?.queueData?.currentPlaying,
      }),
    );
    setCurrentDataDone.current = true;
  }, [currentQueue, dispatch, queueData, queueData?.queueList]);

  const playAudio = async (
    startTime?: number,
    trackId = data.currentTrackId,
  ) => {
    const audioItem = audios?.data.current?.find(
      (item) => item.track.id === trackId,
    );

    if (audioItem?.audio) {
      if (audios?.currentTrackRef)
        audios.currentTrackRef.current = audioItem.audio;
      audioItem.audio.currentTime = startTime ?? data.progress ?? 0;

      try {
        await audioItem.audio.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const pauseAudio = () => {
    audios?.currentTrackRef.current?.pause();
  };

  const pause = () => {
    dispatch(editQueueController({ isPlaying: false }));
    pauseAudio();
  };

  const play = async (isPlaying = true, trackId = data.currentTrackId) => {
    dispatch(editQueueController({ isPlaying }));
    await playAudio(undefined, trackId);
  };

  const toggle = async () => {
    await (data.isPlaying ? pause() : play());
  };

  const skipToTime = async (time: number, trackId = data.currentTrackId) => {
    pauseAudio();
    await playAudio(time, trackId);
  };

  const skipToTrack = async (trackId = data.currentTrackId) => {
    dispatch(
      editQueueController({
        progress: 0,
        isPlaying: true,
        currentTrackId: trackId,
      }),
    );
    await skipToTime(0, trackId);
  };

  return {
    data,
    toggle,
    play,
    pause,
    skipToTime,
    skipToTrack,
    disablePlayButton: audios?.isLoading,
  };
}
