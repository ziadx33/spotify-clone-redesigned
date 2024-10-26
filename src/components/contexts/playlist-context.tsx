import { type Playlist } from "@prisma/client";
import { type ReactNode } from "react";
import { DropdownContextItems } from "../dropdown-context-items";
import { usePlaylistDropdownItems } from "@/hooks/use-playlist-dropdown-items";

type PlaylistContextProps = {
  playlist?: Playlist | null;
  children: ReactNode[] | ReactNode;
  asChild?: boolean;
};

export function PlaylistContext({
  children,
  playlist,
  asChild = true,
}: PlaylistContextProps) {
  const { data: dropdownItems } = usePlaylistDropdownItems({
    playlist,
  });
  if (!dropdownItems) return children;
  return (
    <DropdownContextItems items={dropdownItems}>
      <DropdownContextItems.Trigger asChild={asChild} disabled={!playlist}>
        {children}
      </DropdownContextItems.Trigger>
    </DropdownContextItems>
  );
}
