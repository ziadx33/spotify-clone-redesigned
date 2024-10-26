import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type Playlist, type Track } from "@prisma/client";
import {
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  type DragEvent,
  type MutableRefObject,
} from "react";
import { type Props } from "../types";
import { TrackContext } from "@/components/contexts/track-context";

type TrackContainerProps = {
  setShowButtons: Dispatch<SetStateAction<boolean>>;
  skeleton: boolean;
  track?: Track;
  hidePlayButton?: boolean;
  intersectLastElementRef?: Props["intersectLastElementRef"];
  selected?: boolean;
  children: ReactNode[];
  playlist?: Playlist;
  badgeRef: MutableRefObject<HTMLDivElement | null>;
};

export function TrackContainer({
  setShowButtons,
  skeleton,
  track,
  hidePlayButton,
  intersectLastElementRef,
  selected,
  children,
  playlist,
  badgeRef,
}: TrackContainerProps) {
  const hoverTrackHandler = (value: boolean) => {
    setShowButtons(value);
  };

  const dragStartHandle = (e: DragEvent<HTMLTableRowElement>) => {
    if (badgeRef.current) {
      e.dataTransfer.setData("trackId", track?.id ?? "");
    }
  };

  return (
    <TrackContext
      track={!skeleton ? track : undefined}
      playlist={!skeleton ? playlist : undefined}
    >
      <TableRow
        ref={intersectLastElementRef}
        key={!skeleton ? track!.id : crypto.randomUUID()}
        onMouseOver={() => hoverTrackHandler(true)}
        onMouseLeave={() => hoverTrackHandler(false)}
        className={cn(
          "group w-full overflow-hidden",
          hidePlayButton ? "flex w-full justify-between " : "",
          selected ? "bg-muted" : "",
        )}
        draggable={!skeleton}
        onDragStart={dragStartHandle}
      >
        {children}
      </TableRow>
    </TrackContext>
  );
}
