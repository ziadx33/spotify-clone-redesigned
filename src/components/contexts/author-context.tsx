import { DropdownContextItems } from "@/components/dropdown-context-items";
import { useArtistDropdownItems } from "@/hooks/use-artist-dropdown-items";
import { type User } from "@prisma/client";
import { type ReactNode } from "react";

type AuthorContextProps = {
  artist?: User | null;
  playlistId: string;
  children: ReactNode[] | ReactNode;
  asChild?: boolean;
};

export function AuthorContext({
  artist,
  playlistId,
  children,
  asChild = true,
}: AuthorContextProps) {
  const { data: dropdownItems } = useArtistDropdownItems({
    artist,
    playlistId,
  });
  if (!dropdownItems) return children;
  return (
    <DropdownContextItems items={dropdownItems}>
      <DropdownContextItems.Trigger
        asChild={asChild}
        className="cursor-pointer"
      >
        {children}
      </DropdownContextItems.Trigger>
    </DropdownContextItems>
  );
}
