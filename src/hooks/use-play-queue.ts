import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";
import { useGetPlayData } from "./use-get-play-data";
import { useQueue } from "./use-queue";
import { useQueueController } from "./use-queue-controller";
import { type QueuePlayButtonProps } from "@/components/queue-play-button";

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

  const playHandler = async () => {
    const returnedData = await getData();
    const returnData = (data ? data : returnedData!.data)!;

    console.log(returnData, "sorry zay el lurry");

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

    const trackId = await play(returnData, undefined, skipToTrack);
    dispatch(
      editQueueController({
        isPlaying: false,
        progress: 0,
        currentTrackId: trackId,
      }),
    );
    console.log("aw momken", returnData.tracks?.tracks);
    await audios?.loadTracks(returnData.tracks?.tracks ?? []);

    console.log("law 7ad keda");

    await playTrack(true, trackId, 0);
  };
  return {
    isPlaying,
    playHandler,
    isCurrentPlaying,
    currentQueue,
    audios,
  };
}
