import { TableRow, TableCell } from "@/components/ui/table";
import { type TrackFilters } from "@/types";
import { getAgoTime } from "@/utils/get-ago-time";
import { type User, type Track, type Playlist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaPlay } from "react-icons/fa";

type TrackProps = {
  track: Track & { trackIndex: number };
  author: User;
  album: Playlist;
  viewAs: TrackFilters["viewAs"];
};

export function Track({ track, author, album, viewAs }: TrackProps) {
  const [showPlayButton, setShowPlayButton] = useState(false);
  const dateAddedAgoValue = useMemo(
    () => getAgoTime(track.dateAdded),
    [track.dateAdded],
  );
  const isList = viewAs === "LIST";
  return (
    <TableRow
      key={track.id}
      onMouseOver={() => setShowPlayButton(true)}
      onMouseLeave={() => setShowPlayButton(false)}
    >
      <TableCell className="w-12 pl-4 pr-4">
        <button>
          {!showPlayButton ? track.trackIndex + 1 : <FaPlay size={10} />}
        </button>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex w-full gap-2">
          {isList && (
            <Image
              src={track.imgSrc}
              width={40}
              height={40}
              alt={track.title}
              className="rounded-sm"
            />
          )}
          <div>
            <h3>{track.title}</h3>
            {isList && (
              <Link
                href={`/artists/${author.id}`}
                className="text-md text-muted-foreground hover:underline"
              >
                {author.name}
              </Link>
            )}
          </div>
        </div>
      </TableCell>
      {!isList && (
        <TableCell>
          <Link href={`/artist/${author.id}`} className="hover:underline">
            {author.name}
          </Link>
        </TableCell>
      )}
      <TableCell>
        <Link href={`/playlist/${album.id}`} className="hover:underline">
          {album.title}
        </Link>
      </TableCell>
      <TableCell>{dateAddedAgoValue}</TableCell>
      <TableCell>
        {String(
          (
            Math.floor(track.duration / 60) +
            (track.duration % 60) / 100
          ).toFixed(2),
        ).replace(".", ":")}
      </TableCell>
    </TableRow>
  );
}
