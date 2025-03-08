import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";
import { useGetPlayData } from "./use-get-play-data";
import { useQueue } from "./use-queue";
import { useQueueController } from "./use-queue-controller";
import { type QueuePlayButtonProps } from "@/components/queue-play-button";
import { wait } from "@/utils/wait";
import { type QueueList } from "@prisma/client";

let globalController: AbortController | null = null;

const withAbortCheck = async <T>(
  promise: Promise<T> | undefined,
  signal: AbortSignal,
): Promise<Awaited<T> | undefined> => {
  const result = await promise;
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  return result;
};

export function usePlayQueue({
  playlist,
  artist,
  track,
  skipToTrack,
  noDefPlaylist,
  data,
  queueTypeId,
  isCurrent,
}: Omit<QueuePlayButtonProps, "children"> & { queueTypeId?: string }) {
  const {
    play,
    getQueue,
    skipBy,
    data: { data: queueListData },
  } = useQueue();
  const currentQueue = getQueue(queueListData?.queueList.currentQueueId);
  const dispatch = useDispatch<AppDispatch>();
  const {
    toggle,
    play: playTrack,
    data: { isPlaying, currentTrackId },
    pause,
    audios,
  } = useQueueController();
  const { getData } = useGetPlayData({
    playlist,
    artist,
    track,
    skipToTrack,
    noDefPlaylist,
    queueTypeId,
  });

  const isCurrentlyPlayingTrack = currentTrackId === track?.id;
  const isCurrentlyPlayingArtist =
    currentQueue?.artistTypeData?.id === artist?.id;
  const isCurrentlyPlayingPlaylist =
    currentQueue?.playlistTypeData?.id === playlist?.id;

  const isCurrentPlaying = !isCurrent
    ? playlist && noDefPlaylist
      ? isCurrentlyPlayingPlaylist
      : artist
        ? isCurrentlyPlayingArtist
        : isCurrentlyPlayingTrack
    : queueTypeId === currentQueue?.queueData?.typeId;

  const playHandler = async (
    playAudio = true,
    queueListData?: Partial<QueueList>,
  ) => {
    if (globalController) {
      globalController.abort();
    }

    globalController = new AbortController();
    const signal = globalController.signal;
    try {
      const returnedData = await withAbortCheck(getData(), signal);
      const returnData = (data ? data : returnedData!.data)!;

      if (
        !isCurrent
          ? isCurrentPlaying
          : queueTypeId === currentQueue?.queueData?.typeId
      ) {
        if (
          skipToTrack &&
          skipToTrack !== currentQueue?.queueData?.currentPlaying
        ) {
          await withAbortCheck(skipBy(skipToTrack), signal);
          return;
        }
        await withAbortCheck(toggle(), signal);
        return;
      }

      pause();
      const playData = await withAbortCheck(
        play(returnData, queueListData, skipToTrack),
        signal,
      );

      dispatch(
        editQueueController({
          isPlaying: false,
          progress: 0,
          currentTrackId: playData?.trackId,
        }),
      );

      if (
        skipToTrack &&
        currentQueue?.queueData?.trackList.includes(skipToTrack)
      )
        await withAbortCheck(wait(300), signal);
      else
        await withAbortCheck(
          audios?.loadTracks(returnData.tracks?.tracks ?? []),
          signal,
        );

      if (playAudio)
        await withAbortCheck(playTrack(true, playData?.trackId, 0), signal);
      if (playAudio) await playTrack(true, playData?.trackId, 0);
    } catch (error) {
      if (signal.aborted) {
        console.log("Previous playHandler call aborted");
      } else {
        console.error(error);
      }
    }
  };
  return {
    isPlaying,
    playHandler,
    isCurrentPlaying,
    currentQueue,
    audios,
  };
}
