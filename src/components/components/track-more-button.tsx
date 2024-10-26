import { BsThreeDots } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { useTrackDropdownItems } from "@/hooks/use-track-dropdown-items";
import { type Playlist, type Track } from "@prisma/client";
import { type ReactNode } from "react";
import { DropdownMenuItems } from "../dropdown-menu-items";

type TrackMoreButtonProps = {
  playlist?: Playlist | null;
  track?: Track | null;
  className?: string;
  disableClasses?: boolean;
  trigger?: ReactNode;
};

export function TrackMoreButton({
  playlist,
  track,
  className,
  trigger,
  disableClasses,
}: TrackMoreButtonProps) {
  const { data: dropdownItems, status } = useTrackDropdownItems({
    playlist,
    track,
    isFn: false,
  });

  if (status !== "success") {
    return null;
  }

  return (
    <DropdownMenuItems items={dropdownItems.data}>
      <DropdownMenuItems.Trigger
        onClick={(e) => e.stopPropagation()}
        className={
          !disableClasses
            ? cn("size-fit border-none bg-transparent p-0", className)
            : undefined
        }
      >
        {trigger ?? <BsThreeDots size={20} />}
      </DropdownMenuItems.Trigger>
    </DropdownMenuItems>
  );
}
