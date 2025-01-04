import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type Playlist, type Track } from "@prisma/client";
import { type ReactNode, type Dispatch, type SetStateAction } from "react";
import { TrackContext } from "@/components/contexts/track-context";

type TrackContainerProps = {
  setShowButtons: Dispatch<SetStateAction<boolean>>;
  skeleton: boolean;
  track?: Track;
  hidePlayButton?: boolean;
  selected?: boolean;
  children: ReactNode[];
  playlist?: Playlist;
  album?: Playlist;
  hideTrackContext?: boolean;
};

export function TrackContainer({
  setShowButtons,
  skeleton,
  track,
  hidePlayButton,
  selected,
  children,
  playlist,
  album,
  hideTrackContext,
}: TrackContainerProps) {
  const hoverTrackHandler = (value: boolean) => {
    setShowButtons(value);
  };

  const content = (
    <TableRow
      key={!skeleton ? track!.id : crypto.randomUUID()}
      onMouseOver={() => hoverTrackHandler(true)}
      onMouseLeave={() => hoverTrackHandler(false)}
      className={cn(
        "group w-full overflow-hidden",
        hidePlayButton ? "flex w-full justify-between" : "",
        selected ? "bg-muted" : "",
      )}
    >
      {children}
    </TableRow>
  );

  return !hideTrackContext ? (
    <TrackContext
      track={!skeleton ? track : undefined}
      playlist={!skeleton ? playlist : undefined}
      album={!skeleton ? album : undefined}
      dragController={!skeleton}
    >
      {content}
    </TrackContext>
  ) : (
    content
  );
}
