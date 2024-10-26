import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SkeletonCell } from "./components/skeleton-cell";
import { useMemo } from "react";
import { type Playlist, type Track } from "@prisma/client";
import { AlbumLink } from "./components/album-link";

type PlaysRowProps = {
  isAlbum?: boolean;
  hidePlayButton: boolean;
  skeleton: boolean;
  album?: Playlist;
  track?: Track;
  hideViews?: boolean;
  replacePlaysWithPlaylist?: boolean;
};

export function PlaysRow({
  isAlbum,
  hidePlayButton,
  skeleton,
  track,
  hideViews,
  replacePlaysWithPlaylist,
  album,
}: PlaysRowProps) {
  const albumLink = !skeleton && (
    <AlbumLink skeleton={skeleton} album={album} />
  );
  const memoizedPlays = useMemo(
    () =>
      !skeleton &&
      (!hideViews
        ? Intl.NumberFormat("en-US").format(track!.plays ?? 0)
        : track!.plays),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return isAlbum && !hidePlayButton && !skeleton ? (
    <TableCell>
      {!replacePlaysWithPlaylist ? (
        <div
          className={cn(
            "flex h-full w-full gap-3",
            hideViews ? "invisible" : "",
          )}
        >
          {memoizedPlays}
        </div>
      ) : (
        albumLink
      )}
    </TableCell>
  ) : skeleton ? (
    <SkeletonCell className="h-2.5 w-16" />
  ) : null;
}
