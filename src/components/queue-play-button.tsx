import { type Playlist, type User, type Queue } from "@prisma/client";
import { Button, type ButtonProps } from "./ui/button";
import { type ReactNode } from "react";
import { useQueue } from "@/hooks/use-queue";
import { type QueueListSliceType } from "@/state/slices/queue-list";
import { useGetPlayData } from "@/hooks/use-get-play-data";

export type QueuePlayButtonProps = {
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
    typePlaylist?: Playlist;
    typeArtist?: User;
  };
  playlist?: Playlist | null;
  children: ReactNode;
} & ButtonProps;

export function QueuePlayButton({
  data,
  children,
  playlist,
  ...buttonProps
}: QueuePlayButtonProps) {
  const { play } = useQueue();
  const playlistData = useGetPlayData({ playlist });
  return (
    <Button
      {...buttonProps}
      disabled={
        buttonProps.disabled ||
        (!data && (playlistData?.tracks?.tracks?.length ?? 0) === 0)
      }
      onClick={(e) => {
        buttonProps.onClick?.(e);
        if (data) void play(data ?? playlistData);
      }}
    >
      {children}
    </Button>
  );
}
