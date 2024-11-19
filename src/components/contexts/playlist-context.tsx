import { type Playlist } from "@prisma/client";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { DropdownContextItems } from "../dropdown-context-items";
import { usePlaylistDropdownItems } from "@/hooks/use-playlist-dropdown-items";
import Link, { type LinkProps } from "next/link";

type PlaylistContextProps = {
  playlist?: Playlist | null;
  children: ReactNode[] | ReactNode;
  asChild?: boolean;
  linkProps?: Omit<LinkProps, "href"> & ComponentPropsWithoutRef<"a">;
};

export function PlaylistContext({
  children,
  playlist,
  asChild = true,
  linkProps,
}: PlaylistContextProps) {
  const { data: dropdownItems } = usePlaylistDropdownItems({
    playlist,
  });
  if (!dropdownItems) return children;
  return (
    <DropdownContextItems items={dropdownItems}>
      <DropdownContextItems.Trigger asChild={asChild} disabled={!playlist}>
        {linkProps ? (
          <Link {...linkProps} href={`/playlist/${playlist?.id}`}>
            {children}
          </Link>
        ) : (
          children
        )}
      </DropdownContextItems.Trigger>
    </DropdownContextItems>
  );
}
