import { type User } from "@prisma/client";
import { type ReactNode } from "react";
import { DropdownMenuItems } from "../dropdown-menu-items";
import { useArtistDropdownItems } from "@/hooks/use-artist-dropdown-items";

type AuthorContextProps = {
  artist?: User | null;
  playlistId: string;
  children: ReactNode[] | ReactNode;
  asChild?: boolean;
};

export function AuthorDropdown({
  children,
  playlistId,
  artist,
  asChild = true,
}: AuthorContextProps) {
  const { data: dropdownItems } = useArtistDropdownItems({
    playlistId,
    artist,
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
