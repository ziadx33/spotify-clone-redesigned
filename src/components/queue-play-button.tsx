import {
  type Playlist,
  type User,
  type Queue,
  type Track,
} from "@prisma/client";
import { Button, type ButtonProps } from "./ui/button";
import { useRef, type ReactNode } from "react";
import { type QueueListSliceType } from "@/state/slices/queue-list";
import { usePlayQueue } from "@/hooks/use-play-queue";

export type QueuePlayButtonProps = Omit<
  ButtonProps,
  "children" | "className"
> & {
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
  noDefPlaylist?: boolean;
  className?: ((va: boolean, isQueuePlaying: boolean) => string) | string;
  queueTypeId?: string;
  isCurrent?: boolean;
};

export function QueuePlayButton({
  data,
  children,
  playlist,
  isDiv,
  track,
  artist,
  skipToTrack,
  noDefPlaylist,
  className,
  queueTypeId,
  isCurrent,
  ...buttonProps
}: QueuePlayButtonProps) {
  const { isPlaying, playHandler, isCurrentPlaying, currentQueue, audios } =
    usePlayQueue({
      data,
      playlist,
      track,
      artist,
      skipToTrack,
      noDefPlaylist,
      queueTypeId,
      isCurrent,
    });
  const clickedRef = useRef(false);
  const buttonClass =
    typeof className === "function"
      ? className(isCurrentPlaying, isPlaying)
      : className;
  return !isDiv ? (
    <Button
      {...buttonProps}
      className={buttonClass}
      disabled={
        !!buttonProps.disabled || (audios?.isLoading && clickedRef.current)
      }
      onClick={async (e) => {
        e.stopPropagation();
        buttonProps.onClick?.(e);
        clickedRef.current = true;
        await playHandler();
      }}
    >
      {children(isCurrentPlaying && isPlaying)}
    </Button>
  ) : (
    <div
      className={buttonClass}
      onClick={async (e) => {
        if (audios?.isLoading) return;
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
