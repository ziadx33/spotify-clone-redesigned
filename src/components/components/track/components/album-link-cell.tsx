import { PlaylistContext } from "@/components/contexts/playlist-context";
import { TableCell } from "@/components/ui/table";
import { getAgoTime } from "@/utils/get-ago-time";
import { type Playlist, type Track } from "@prisma/client";
import Link from "next/link";
import { useMemo } from "react";
import { SkeletonCell } from "./skeleton-cell";

type AlbumLinkCellProps = {
  skeleton: boolean;
  isAlbum?: boolean;
  album?: Playlist;
  track?: Track;
};

export function AlbumLinkCell({
  skeleton,
  album,
  isAlbum,
  track,
}: AlbumLinkCellProps) {
  const dateAddedAgoValue = useMemo(
    () => !skeleton && getAgoTime(track!.dateAdded),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return !skeleton ? (
    !isAlbum && album && (
      <>
        <TableCell>
          <PlaylistContext playlist={album}>
            <Link href={`/playlist/${album.id}`}>{album.title}</Link>
          </PlaylistContext>
        </TableCell>
        <TableCell>{dateAddedAgoValue}</TableCell>
      </>
    )
  ) : (
    <SkeletonCell className="h-2.5 w-16" />
  );
}
