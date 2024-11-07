import {
  type Playlist,
  type User,
  type Queue,
  type Track,
} from "@prisma/client";
import { buttonVariants, type ButtonProps } from "./ui/button";
import { useRef, type ReactNode } from "react";
import { type QueueListSliceType } from "@/state/slices/queue-list";
import { usePlayQueue } from "@/hooks/use-play-queue";
import { cn } from "@/lib/utils";

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
  disableButtonVariant?: boolean;
};

export function QueuePlayButton({
  data,
  children,
  playlist,
  track,
  artist,
  skipToTrack,
  noDefPlaylist,
  className,
  queueTypeId,
  isCurrent,
  disableButtonVariant,
  ...buttonProps
}: QueuePlayButtonProps) {
  const { isPlaying, playHandler, isCurrentPlaying, audios } = usePlayQueue({
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
      : cn("pointer-events-auto", className);
  return (
    <button
      {...buttonProps}
      className={cn(
        !disableButtonVariant ? buttonVariants() : undefined,
        buttonClass,
      )}
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
    </button>
  );
}
