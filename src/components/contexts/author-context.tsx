import { DropdownContextItems } from "@/components/dropdown-context-items";
import { useArtistDropdownItems } from "@/hooks/use-artist-dropdown-items";
import { useDrag } from "@/hooks/use-drag";
import { cn } from "@/lib/utils";
import { type User } from "@prisma/client";
import {
  ContextMenuPortal,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import { useState, type ReactNode } from "react";
import { badgeVariants } from "../ui/badge";

type AuthorContextProps = {
  artist?: User | null;
  playlistId: string;
  children: ReactNode[] | ReactNode;
  asChild?: boolean;
  dragController?: boolean;
};

export function AuthorContext({
  artist,
  playlistId,
  children,
  asChild = true,
  dragController,
}: AuthorContextProps) {
  const { data: dropdownItems } = useArtistDropdownItems({
    artist,
    playlistId,
  });
  const [trackDragItem, setTrackDragItem] = useState<HTMLSpanElement | null>(
    null,
  );
  const { addRef } = useDrag<HTMLTableRowElement>(
    "artistId",
    artist?.id ?? "",
    trackDragItem,
    dragController,
  );
  if (!dropdownItems) return children;
  return (
    <DropdownContextItems items={dropdownItems}>
      <ContextMenuTrigger
        asChild={asChild}
        className="cursor-pointer"
        ref={addRef}
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuPortal forceMount>
        <span
          ref={(el) => setTrackDragItem(el)}
          className={cn(
            badgeVariants({ variant: "default" }),
            "mx-2 text-nowrap",
          )}
        >
          {artist?.name}
        </span>
      </ContextMenuPortal>
    </DropdownContextItems>
  );
}
