import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch, type RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useAudios } from "./use-audios";
import { editQueueById, getCurrentQueue } from "@/state/slices/queue-list";
import { updateQueue } from "@/server/actions/queue";
import { wait } from "@/utils/wait";

export function useQueueController() {
  const data = useSelector((state: RootState) => state.queueController.data);
  const dispatch = useDispatch<AppDispatch>();
  const currentQueue = useSelector((state: RootState) =>
    getCurrentQueue({ queue: state.queueList }),
  );

  const audios = useAudios();

  const playAudio = async (
    startTime?: number,
    trackId = data.currentTrackId,
    volume = data.volume,
  ) => {
    const audioItem = audios?.data.current?.find(
      (item) => item.track.id === trackId,
    );

    if (audioItem?.audio) {
      if (data.isPlaying) audios?.currentTrackRef.current?.pause();
      if (audios?.currentTrackRef)
        audios.currentTrackRef.current = audioItem.audio;
      audioItem.audio.currentTime = startTime ?? data.progress ?? 0;
      audioItem.audio.volume = volume / 100 ?? 1;

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

  const play = async (
    isPlaying = true,
    trackId = data.currentTrackId,
    startTime = data.progress,
    volume = data.volume,
  ) => {
    dispatch(
      editQueueController({
        isPlaying,
        progress: startTime,
        currentTrackId: trackId,
      }),
    );
    await playAudio(startTime, trackId, volume);
  };

  const toggle = async () => {
    await (data.isPlaying ? pause() : play());
  };

  const skipToTime = async (
    time: number,
    trackId = data.currentTrackId,
    volume = data.volume,
  ) => {
    if (data.isPlaying) {
      pauseAudio();
      await playAudio(time, trackId, volume);
    }
  };

  const editProgress = (value: number) => {
    if (currentQueue?.queueData) {
      const data = { currentPlayingProgress: value };
      dispatch(editQueueById({ data, id: currentQueue.queueData.id }));
      void updateQueue({
        data: { ...currentQueue.queueData, currentPlayingProgress: value },
        id: currentQueue.queueData.id,
      });
    }
    dispatch(editQueueController({ progress: value }));
  };

  const skipToTrack = async (trackId = data.currentTrackId) => {
    dispatch(
      editQueueController({
        currentTrackId: trackId,
        isPlaying: false,
      }),
    );

    if (audios?.isLoading) return;

    await wait(300);

    await play(true, trackId, 0);
    editProgress(0);
  };

  return {
    editProgress,
    data,
    toggle,
    play,
    pause,
    skipToTime,
    skipToTrack,
    disablePlayButton: audios?.isLoading,
    audios,
  };
}
