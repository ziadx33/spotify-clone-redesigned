import { TableRow, TableCell } from "@/components/ui/table";
import { type TrackFilters } from "@/types";
import { getAgoTime } from "@/utils/get-ago-time";
import { type User, type Track, type Playlist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { TrackMoreButton } from "./track-more-button";

type TrackProps = {
  track: Track & { trackIndex: number };
  author: User;
  album: Playlist;
  viewAs: TrackFilters["viewAs"];
  playlist: Playlist;
  isAlbum?: boolean;
};

export function Track({
  track,
  author,
  album,
  viewAs,
  playlist,
  isAlbum = false,
}: TrackProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [isShowMoreButtonOpened, setIsShowMoreButtonOpened] = useState(false);
  const dateAddedAgoValue = useMemo(
    () => getAgoTime(track.dateAdded),
    [track.dateAdded],
  );
  const isList = viewAs === "LIST";
  const hoverTrackHandler = (value: boolean) => {
    setShowButtons(value);
    if (!isShowMoreButtonOpened) setShowMoreButton(value);
  };
  const memoizedPlays = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    () => new Intl.NumberFormat("en-US").format(track.plays ?? 0),
    [track.plays],
  );
  return (
    <TableRow
      key={track.id}
      onMouseOver={() => hoverTrackHandler(true)}
      onMouseLeave={() => hoverTrackHandler(false)}
    >
      <TableCell className="w-12 pl-4 pr-4">
        <button>
          {!showButtons ? track.trackIndex + 1 : <FaPlay size={10} />}
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
                href={`/artist/${author.id}`}
                className="text-md text-muted-foreground hover:underline"
              >
                {author.name}
              </Link>
            )}
          </div>
        </div>
      </TableCell>
      {!isAlbum && (
        <>
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
        </>
      )}
      {isAlbum && (
        <TableCell>
          <div className="flex h-full w-24 gap-3">{memoizedPlays}</div>
        </TableCell>
      )}
      <TableCell>
        <div className="flex h-full w-24 gap-3">
          {String(
            (
              Math.floor(track.duration / 60) +
              (track.duration % 60) / 100
            ).toFixed(2),
          ).replace(".", ":")}
          {(showMoreButton || showButtons) && (
            <TrackMoreButton
              setOpened={setIsShowMoreButtonOpened}
              setShowMoreButton={setShowMoreButton}
              playlist={playlist}
              track={track}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
