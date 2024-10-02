import {
  type Playlist,
  type User,
  type Queue,
  type Track,
} from "@prisma/client";
import { Button, type ButtonProps } from "./ui/button";
import { type ReactNode } from "react";
import { useQueue } from "@/hooks/use-queue";
import { type QueueListSliceType } from "@/state/slices/queue-list";
import { useGetPlayData } from "@/hooks/use-get-play-data";
import { useQueueController } from "@/hooks/use-queue-controller";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { editQueueController } from "@/state/slices/queue-controller";

export type QueuePlayButtonProps = Omit<ButtonProps, "children"> & {
  data?: {
    data: {
      trackList: Queue["trackList"];
      type: Queue["type"];
      typeId: Queue["typeId"];
      currentPlaying: Queue["currentPlaying"];
    };
    tracks: NonNullable<
      QueueListSliceType["data"]
    >["queues"][number]["dataTracks"];
    typePlaylist?: Playlist | null;
    typeArtist?: User;
  };
  playlist?: Playlist | null;
  artist?: User | null;
  track?: Track | null;

  children: (
    isPlaying: boolean,
    checkTrack?: (trackId: string) => boolean,
  ) => ReactNode;
  isDiv?: boolean;
  skipToTrack?: string;
};

export function QueuePlayButton({
  data,
  children,
  playlist,
  isDiv,
  track,
  artist,
  skipToTrack,
  ...buttonProps
}: QueuePlayButtonProps) {
  const { play, currentQueue, skipBy } = useQueue();
  const dispatch = useDispatch<AppDispatch>();
  const {
    toggle,
    play: playTrack,
    data: { isPlaying },
    pause,
    audios,
  } = useQueueController();
  const { getData } = useGetPlayData({ playlist, artist, track, skipToTrack });
  const isCurrentlyPlayingTrack =
    currentQueue?.queueData?.currentPlaying === track?.id;
  const isCurrentlyPlayingArtist =
    currentQueue?.artistTypeData?.id === artist?.id;
  const isCurrentlyPlayingPlaylist =
    currentQueue?.playlistTypeData?.id === playlist?.id;

  const isCurrentPlaying = playlist
    ? isCurrentlyPlayingPlaylist
    : artist
      ? isCurrentlyPlayingArtist
      : isCurrentlyPlayingTrack;

  const playHandler = async () => {
    const returnedData = await getData();
    const returnData = (data ?? returnedData.data)!;

    if (isCurrentPlaying) {
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
    await audios?.loadTracks(returnData.tracks?.tracks ?? []);

    await playTrack(true, trackId, 0);
  };
  return !isDiv ? (
    <Button
      {...buttonProps}
      disabled={!!buttonProps.disabled}
      onClick={async (e) => {
        e.stopPropagation();
        buttonProps.onClick?.(e);
        await playHandler();
      }}
    >
      {children(isCurrentPlaying && isPlaying)}
    </Button>
  ) : (
    <div
      className={buttonProps.className}
      onClick={async (e) => {
        e.stopPropagation();
        await playHandler();
      }}
    >
      {children(
        isCurrentPlaying && isPlaying,
        (trackId: string) =>
          currentQueue?.queueData?.currentPlaying === trackId,
      )}
    </div>
  );
}
