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
import { useMemo, useState } from "react";
import { type FiltersStateType } from "../albums-tab";
import { PlaylistContext } from "@/components/contexts/playlist-context";
import { enumParser } from "@/utils/enum-parser";

type AlbumProps = {
  tracks: Track[];
  album: Playlist;
  artist?: User;
  viewAs: FiltersStateType["viewAs"];
  addType?: boolean;
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
}: Omit<AlbumProps, "viewAs">) {
  const [expanded, setExpanded] = useState(false);
  const table = useMemo(() => {
    return (
      <Table>
        <NonSortTable
          showTrackImage={false}
          data={{ tracks, albums: [album], authors: artist ? [artist] : [] }}
          playlist={album}
          viewAs="LIST"
        />
      </Table>
    );
  }, [tracks, album, artist]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full gap-6 px-6">
        <PlaylistContext
          linkProps={{ className: "relative h-[150px] w-[180px]" }}
          playlist={album}
          asChild
        >
          <Image
            src={album.imageSrc ?? ""}
            alt={album.title ?? ""}
            fill
            className="rounded-md"
            draggable="false"
          />
        </PlaylistContext>
        <div className="flex w-full flex-col justify-between">
          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <PlaylistContext playlist={album} linkProps={{}}>
                <span className="text-3xl font-bold hover:underline">
                  {album.title}
                </span>
              </PlaylistContext>
              <CircleItems
                items={[
                  addType && (
                    <span key={album.type} className="">
                      {enumParser(album.type)}
                    </span>
                  ),
                  <span key={album.createdAt.toString()}>
                    {format(new Date(album.createdAt), "yyy")}
                  </span>,
                  <span key={tracks.length}>
                    {tracks.length} {tracks.length > 1 ? "tracks" : "track"}
                  </span>,
                ]}
              />
            </div>
            <Button
              variant="outline"
              className="gap-2.5"
              onClick={() => setExpanded((v) => !v)}
            >
              expand{" "}
              {!expanded ? <FaArrowDown size={12} /> : <FaArrowUp size={12} />}
            </Button>
          </div>
          <AlbumControl author={artist} tracks={tracks} playlist={album} />
        </div>
      </div>
      {expanded ? table : null}
    </div>
  );
}

function GridView({ album }: Omit<AlbumProps, "viewAs">) {
  return (
    <SectionItem
      alt={album.title}
      showPlayButton
      title={album.title}
      image={album.imageSrc}
      playlistData={album}
      description={`${format(new Date(album.createdAt), "yyy")} - ${album.type.toLowerCase()}`}
      link={`/playlist/${album.id}`}
    />
  );
}
