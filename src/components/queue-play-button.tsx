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
import { useAudios } from "@/hooks/use-audios";

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

  children: (isPlaying: boolean) => ReactNode;
  isDiv?: boolean;
};

export function QueuePlayButton({
  data,
  children,
  playlist,
  isDiv,
  track,
  artist,
  ...buttonProps
}: QueuePlayButtonProps) {
  const {
    play,
    data: { data: queueData },
    currentQueue,
  } = useQueue();
  const dispatch = useDispatch<AppDispatch>();
  const {
    toggle,
    data: { isPlaying },
    skipToTime,
    pause,
  } = useQueueController();
  const audios = useAudios();
  const playlistData = useGetPlayData({ playlist, artist, track });
  console.log("go away", playlistData);
  const returnData = (data ?? playlistData)!;
  const isCurrentPlaying =
    (!!currentQueue?.artistTypeData?.id
      ? currentQueue?.artistTypeData?.id === returnData?.typeArtist?.id
      : false) ||
    (!!currentQueue?.playlistTypeData?.id
      ? returnData?.typePlaylist?.id === currentQueue?.playlistTypeData?.id
      : false);

  const playHandler = async () => {
    if (queueData && isCurrentPlaying) {
      await toggle();
      return;
    }
    pause();
    console.log("teslam ya sika", returnData);
    const trackId = await play(returnData);
    await audios?.loadTracks(returnData.tracks?.tracks ?? []);
    dispatch(
      editQueueController({
        isPlaying: true,
        progress: 0,
        currentTrackId: trackId,
      }),
    );
    await skipToTime(0, trackId);
  };
  console.log("basha inta 3abd", playlistData);
  return !isDiv ? (
    <Button
      {...buttonProps}
      disabled={
        !!buttonProps.disabled ||
        (playlistData?.tracks?.tracks?.length ?? 0) === 0
      }
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
      {children(isCurrentPlaying && isPlaying)}
    </div>
  );
}
