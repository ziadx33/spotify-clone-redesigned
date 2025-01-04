import { type Playlist } from "@prisma/client";
import { type ReactNode } from "react";
import { usePlaylistDropdownItems } from "@/hooks/use-playlist-dropdown-items";
import { DropdownMenuItems } from "../dropdown-menu-items";
import { type DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu";

type PlaylistContextProps = {
  playlist?: Playlist | null;
  children: ReactNode[] | ReactNode;
  asChild?: boolean;
} & DropdownMenuTriggerProps;

export function PlaylistDropdown({
  children,
  playlist,
  asChild = true,
  ...restProps
}: PlaylistContextProps) {
  const { data: dropdownItems } = usePlaylistDropdownItems({
    playlist,
  });
  if (!dropdownItems) return children;
  return (
    <DropdownMenuItems items={dropdownItems}>
      <DropdownMenuItems.Trigger
        asChild={asChild}
        className="cursor-pointer"
        {...restProps}
      >
        {children}
      </DropdownMenuItems.Trigger>
    </DropdownMenuItems>
  );
}
