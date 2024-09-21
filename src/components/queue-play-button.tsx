import { type Playlist, type User, type Queue } from "@prisma/client";
import { Button, type ButtonProps } from "./ui/button";
import { type ReactNode } from "react";
import { useQueue } from "@/hooks/use-queue";
import { type QueueListSliceType } from "@/state/slices/queue-list";

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
  children: ReactNode;
} & ButtonProps;

export function QueuePlayButton({
  data,
  children,
  ...buttonProps
}: QueuePlayButtonProps) {
  const { play } = useQueue();
  return (
    <Button
      {...buttonProps}
      disabled={buttonProps.disabled ?? !data}
      onClick={(e) => {
        buttonProps.onClick?.(e);
        if (data) void play(data);
      }}
    >
      {children}
    </Button>
  );
}
