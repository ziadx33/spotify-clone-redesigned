import { type User, type Playlist, type Track } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { AlbumControl } from "./album-control";
import { Table } from "@/components/ui/table";
import { NonSortTable } from "@/components/components/non-sort-table";
import { SectionItem } from "@/components/components/section-item";
import { CircleItems } from "@/components/ui/circle-items";
import { Button } from "@/components/ui/button";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { type ReactNode, useMemo, useState } from "react";
import { type FiltersStateType } from "../albums-tab";
import { PlaylistContext } from "@/components/contexts/playlist-context";
import { enumParser } from "@/utils/enum-parser";
import { TrackContext } from "@/components/contexts/track-context";

type AlbumProps = {
  tracks?: Track[];
  album?: Playlist;
  track?: Track;
  artist?: User;
  viewAs: FiltersStateType["viewAs"];
  addType?: boolean;
  buttons?: ReactNode;
};

export function Album({ viewAs, ...restProps }: AlbumProps) {
  return viewAs === "list" ? (
    <ListView {...restProps} />
  ) : (
    <GridView {...restProps} />
  );
}

function ListView({
  tracks,
  album,
  artist,
  addType,
  track,
  buttons,
}: Omit<AlbumProps, "viewAs">) {
  const [expanded, setExpanded] = useState(false);
  const table = useMemo(() => {
    return album ? (
      <Table>
        <NonSortTable
          showTrackImage={false}
          data={{ tracks, albums: [album], authors: artist ? [artist] : [] }}
          playlist={album}
          viewAs="LIST"
        />
      </Table>
    ) : null;
  }, [tracks, album, artist]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full gap-6 px-6">
        {album ? (
          <PlaylistContext
            linkProps={{ className: "relative h-[150px] w-[180px]" }}
            playlist={album}
            asChild
          >
            <Image
              src={album?.imageSrc ?? ""}
              alt={album?.title ?? ""}
              fill
              className="rounded-md"
              draggable="false"
            />
          </PlaylistContext>
        ) : (
          <TrackContext
            linkProps={{ className: "relative h-[150px] w-[180px]" }}
            track={track}
            asChild
          >
            <Image
              src={track?.imgSrc ?? ""}
              alt={track?.title ?? ""}
              fill
              className="rounded-md"
              draggable="false"
            />
          </TrackContext>
        )}
        <div className="flex w-full flex-col justify-between">
          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <PlaylistContext playlist={album} linkProps={{}}>
                <span className="text-3xl font-bold hover:underline">
                  {(track ?? album)?.title}
                </span>
              </PlaylistContext>
              <CircleItems
                items={[
                  addType && album && (
                    <span key={album?.type} className="">
                      {enumParser(album.type)}
                    </span>
                  ),
                  <span key={(album ?? track)!.createdAt.toString() ?? ""}>
                    {format(new Date((album ?? track)!.createdAt), "yyy")}
                  </span>,
                  !track && tracks && (
                    <span key={tracks?.length}>
                      {tracks.length} {tracks.length > 1 ? "tracks" : "track"}
                    </span>
                  ),
                ]}
              />
            </div>
            {buttons ?? (
              <Button
                variant="outline"
                className="gap-2.5"
                onClick={() => setExpanded((v) => !v)}
              >
                expand{" "}
                {!expanded ? (
                  <FaArrowDown size={12} />
                ) : (
                  <FaArrowUp size={12} />
                )}
              </Button>
            )}
          </div>
          {album && tracks && (
            <AlbumControl author={artist} tracks={tracks} playlist={album} />
          )}
        </div>
      </div>
      {expanded ? table : null}
    </div>
  );
}

function GridView({ album, track }: Omit<AlbumProps, "viewAs">) {
  return (
    <SectionItem
      alt={(album ?? track)?.title}
      showPlayButton
      title={(album ?? track)?.title ?? ""}
      image={album?.imageSrc ?? track?.imgSrc}
      playlistData={album}
      description={`${format(new Date((album ?? track)!.createdAt), "yyy")}${album && ` - ${album.type.toLowerCase()}`}`}
      link={album ? `/playlist/${album.id}` : `/playlist/${track?.albumId}`}
    />
  );
}
