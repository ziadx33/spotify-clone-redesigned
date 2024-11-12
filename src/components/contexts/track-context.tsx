import { useTrackDropdownItems } from "@/hooks/use-track-dropdown-items";
import { useState, type ReactNode } from "react";
import { DropdownContextItems } from "../dropdown-context-items";
import { ContextMenuPortal, ContextMenuTrigger } from "../ui/context-menu";
import { type Playlist, type Track } from "@prisma/client";
import { useDrag } from "@/hooks/use-drag";
import { badgeVariants } from "../ui/badge";
import { cn } from "@/lib/utils";
import { CircleItems } from "../ui/circle-items";

type TrackContextProps = {
  children?: ReactNode;
  track?: Track | null;
  playlist?: Playlist | null;
  asChild?: boolean;
  className?: string;
  dragController?: boolean;
};

export function TrackContext({
  children,
  track,
  playlist,
  asChild = true,
  className,
  dragController,
}: TrackContextProps) {
  const { data: dropdownItems } = useTrackDropdownItems({
    track,
    playlist,
    isFn: false,
  });
  const [trackDragRef, setTrackDragRef] = useState<HTMLSpanElement | null>(
    null,
  );
  const { addRef } = useDrag<HTMLTableRowElement>(
    "trackId",
    track?.id ?? "",
    trackDragRef,
    dragController,
  );
  if (!dropdownItems) return children;
  return (
    <DropdownContextItems items={dropdownItems.data}>
      <ContextMenuTrigger asChild={asChild} className={className} ref={addRef}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuPortal
        forceMount
        container={document.getElementById("drag-items-container")}
      >
        <span
          ref={(el) => setTrackDragRef(el)}
          className={cn(
            badgeVariants({ variant: "default" }),
            "mx-2 text-nowrap",
          )}
        >
          <CircleItems
            className="text-primary-foreground"
            items={[track?.title, playlist?.title]}
          />
        </span>
      </ContextMenuPortal>
    </DropdownContextItems>
  );
}
