import { type Playlist } from "@prisma/client";
import { type ReactNode } from "react";
import { usePlaylistDropdownItems } from "@/hooks/use-playlist-dropdown-items";
import { DropdownMenuItems } from "../dropdown-menu-items";

type PlaylistContextProps = {
  playlist?: Playlist | null;
  children: ReactNode[] | ReactNode;
  asChild?: boolean;
};

export function PlaylistDropdown({
  children,
  playlist,
  asChild = true,
}: PlaylistContextProps) {
  const { data: dropdownItems } = usePlaylistDropdownItems({
    playlist,
  });
  if (!dropdownItems) return children;
  return (
    <DropdownMenuItems items={dropdownItems}>
      <DropdownMenuItems.Trigger asChild={asChild} className="cursor-pointer">
        {children}
      </DropdownMenuItems.Trigger>
    </DropdownMenuItems>
  );
}
