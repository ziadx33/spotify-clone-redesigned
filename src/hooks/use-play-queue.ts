import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";
import { useGetPlayData } from "./use-get-play-data";
import { useQueue } from "./use-queue";
import { useQueueController } from "./use-queue-controller";
import { type QueuePlayButtonProps } from "@/components/queue-play-button";
import { wait } from "@/utils/wait";
import { type QueueList } from "@prisma/client";

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
    const returnedData = await getData();
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
        await skipBy(skipToTrack);
        return;
      }
      await toggle();
      return;
    }
    pause();
    const playData = await play(returnData, queueListData, skipToTrack);

    dispatch(
      editQueueController({
        isPlaying: false,
        progress: 0,
        currentTrackId: playData?.trackId,
      }),
    );

    if (skipToTrack && currentQueue?.queueData?.trackList.includes(skipToTrack))
      await wait(300);
    else await audios?.loadTracks(returnData.tracks?.tracks ?? []);
    if (playAudio) await playTrack(true, playData?.trackId, 0);
  };
  return {
    isPlaying,
    playHandler,
    isCurrentPlaying,
    currentQueue,
    audios,
  };
}
