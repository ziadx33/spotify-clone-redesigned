import { useTrackDropdownItems } from "@/hooks/use-track-dropdown-items";
import { type ReactNode } from "react";
import { DropdownContextItems } from "../dropdown-context-items";
import { ContextMenuTrigger } from "../ui/context-menu";
import { type Playlist, type Track } from "@prisma/client";

type TrackContextProps = {
  children?: ReactNode;
  track?: Track | null;
  playlist?: Playlist | null;
  asChild?: boolean;
  className?: string;
};

export function TrackContext({
  children,
  track,
  playlist,
  asChild = true,
  className,
}: TrackContextProps) {
  const { data: dropdownItems } = useTrackDropdownItems({
    track,
    playlist,
    isFn: false,
  });
  if (!dropdownItems) return children;
  return (
    <DropdownContextItems items={dropdownItems.data}>
      <ContextMenuTrigger asChild={asChild} className={className}>
        {children}
      </ContextMenuTrigger>
    </DropdownContextItems>
  );
}
