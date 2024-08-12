"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { type TrackFilters } from "@/types";
import { getAgoTime } from "@/utils/get-ago-time";
import { type User, type Track, type Playlist } from "@prisma/client";
import Image from "next/image";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { TrackMoreButton } from "./track-more-button";
import { type ReplaceDurationWithButton } from "./non-sort-table";
import { Button } from "../ui/button";
import { Navigate } from "../navigate";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonList } from "../artist/components/skeleton";
import { Checkbox } from "../ui/checkbox";

type Props = {
  track: Track & { trackIndex: number };
  authors: User[];
  album?: Playlist;
  viewAs: TrackFilters["viewAs"];
  playlist?: Playlist;
  isAlbum?: boolean;
  showImage?: boolean;
  replacePlaysWithPlaylist?: boolean;
  showIndex?: boolean;
  replaceDurationWithButton?: ReplaceDurationWithButton;
  hidePlayButton?: boolean;
  hideViews?: boolean;
  className?: string;
  selected?: boolean;
  setSelectedTracks?: Dispatch<SetStateAction<string[]>>;
};

export type TrackProps =
  | ({ skeleton: false } & Props)
  | ({ skeleton: true } & Omit<
      Props,
      "track" | "authors" | "album" | "playlist"
    >);

export function Track(props: TrackProps) {
  const {
    isAlbum,
    showImage = true,
    replacePlaysWithPlaylist = false,
    showIndex = true,
    replaceDurationWithButton,
    hidePlayButton = false,
    hideViews,
    className,
    skeleton,
    viewAs,
    selected,
    setSelectedTracks,
  } = props;
  const [showButtons, setShowButtons] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [isShowMoreButtonOpened, setIsShowMoreButtonOpened] = useState(false);
  const dateAddedAgoValue = useMemo(
    () => !skeleton && getAgoTime(props.track.dateAdded),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const isList = viewAs === "LIST";
  const hoverTrackHandler = (value: boolean) => {
    setShowButtons(value);
    if (!isShowMoreButtonOpened) setShowMoreButton(value);
  };
  const memoizedPlays = useMemo(
    () =>
      !skeleton &&
      (!hideViews
        ? Intl.NumberFormat("en-US").format(props.track.plays ?? 0)
        : props.track.plays),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const albumLink = !skeleton && (
    <Navigate
      data={{
        href: `/playlist/${props.album?.id}`,
        title: props.album?.title ?? "unknown",
        type: "PLAYLIST",
      }}
      href={`/playlist/${props.album?.id}`}
      className="hover:underline"
    >
      {props.album?.title}
    </Navigate>
  );

  const SkeletonCell = ({ className }: { className?: string }) => (
    <TableCell>
      <Skeleton className={className} />
    </TableCell>
  );

  const authorsElement = !skeleton
    ? props.authors?.map((author, authorIndex) => (
        <div key={author.id} className="text-muted-foreground">
          <Navigate
            data={{
              href: `/artist/${author.id}?playlist=${props.playlist?.id ?? "liked-tracks"}`,
              title: author.name ?? "unknown",
              type: "ARTIST",
            }}
            href={`/artist/${author.id}?playlist=${props.playlist?.id ?? "liked-tracks"}`}
            className="w-fit hover:underline"
          >
            {author.name}
          </Navigate>
          {authorIndex === props.authors.length - 1 ? "" : ","}
        </div>
      ))
    : undefined;

  const indexAndImage = (
    <>
      {!skeleton
        ? showIndex && (
            <TableCell className="w-12 pl-4 pr-4">
              <button>
                {!showButtons ? (
                  props.track.trackIndex + 1
                ) : (
                  <FaPlay size={10} />
                )}
              </button>
            </TableCell>
          )
        : undefined}
      <TableCell className={cn("font-medium", className)}>
        <div className="flex w-full gap-2">
          {isList &&
            showImage &&
            (!skeleton ? (
              <div className="relative size-[40px]">
                <Image
                  src={props.track.imgSrc}
                  fill
                  alt={props.track.title}
                  className="rounded-sm"
                />{" "}
                {!showIndex && showButtons && (
                  <div className="absolute left-0 top-0 grid size-full place-items-center bg-black bg-opacity-80">
                    <button>
                      <FaPlay size={10} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Skeleton className="size-[40px]" />
            ))}
          <div>
            {!skeleton ? (
              <h3>{props.track.title}</h3>
            ) : (
              <Skeleton className="h-2.5 w-28" />
            )}
            {isList &&
              (!skeleton ? (
                <div className="flex w-fit gap-1">{authorsElement}</div>
              ) : (
                <div className="flex gap-1">
                  <SkeletonList amount={2} className="mt-2 h-2.5 w-10" />
                </div>
              ))}
          </div>
        </div>
      </TableCell>
    </>
  );

  return (
    <TableRow
      key={!skeleton ? props.track.id : crypto.randomUUID()}
      onMouseOver={() => hoverTrackHandler(true)}
      onMouseLeave={() => hoverTrackHandler(false)}
      className={cn(
        "overflow-hidden",
        hidePlayButton ? "flex w-full justify-between " : "",
        selected ? "bg-muted" : "",
      )}
    >
      {hidePlayButton ? (
        <div className="w-96">{indexAndImage}</div>
      ) : (
        indexAndImage
      )}
      {!isAlbum && (
        <>
          {!isList ? (
            <TableCell className="flex gap-1">{authorsElement}</TableCell>
          ) : skeleton ? (
            <div className="flex gap-1">
              <SkeletonList amount={2} className="mt-2 h-2.5 w-10" />
            </div>
          ) : null}
        </>
      )}
      {!skeleton ? (
        !isAlbum &&
        props.album && (
          <>
            <TableCell>
              <Navigate
                data={{
                  href: `/playlist/${props.album.id}`,
                  title: props.album.title ?? "unknown",
                  type: "PLAYLIST",
                }}
                href={`/playlist/${props.album.id}`}
                className="hover:underline"
              >
                {props.album.title}
              </Navigate>
            </TableCell>
            <TableCell>{dateAddedAgoValue}</TableCell>
          </>
        )
      ) : (
        <SkeletonCell className="h-2.5 w-16" />
      )}
      {isAlbum && !hidePlayButton ? (
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
      ) : null}
      <TableCell>
        {!replaceDurationWithButton ? (
          !skeleton ? (
            <div className="flex h-full w-24 items-center gap-3">
              {String(
                (
                  Math.floor(props.track.duration / 60) +
                  (props.track.duration % 60) / 100
                ).toFixed(2),
              ).replace(".", ":")}
              {(showMoreButton || showButtons) && (
                <TrackMoreButton
                  setOpened={setIsShowMoreButtonOpened}
                  setShowMoreButton={setShowMoreButton}
                  playlist={props.playlist}
                  track={props.track}
                />
              )}
            </div>
          ) : (
            <Skeleton className="h-2.5 w-24" />
          )
        ) : !skeleton ? (
          <Button
            variant="outline"
            onClick={() => replaceDurationWithButton.fn(props.track)}
          >
            {replaceDurationWithButton.name}
          </Button>
        ) : (
          <Skeleton className="h-2.5 w-12" />
        )}
      </TableCell>
      <TableCell>
        {setSelectedTracks && !skeleton && (showButtons || selected) && (
          <Checkbox
            onCheckedChange={(e) =>
              setSelectedTracks((v) =>
                e
                  ? [...v, props.track.id]
                  : v.filter((track) => track !== props.track.id) ?? [],
              )
            }
            defaultChecked={selected}
            className="rounded-full"
          />
        )}
      </TableCell>
    </TableRow>
  );
}
