import { type User, type Playlist, type Track } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { AlbumControl } from "./album-control";
import { Table } from "@/components/ui/table";
import { NonSortTable } from "@/components/components/non-sort-table";
import { SectionItem } from "@/components/components/section-item";
import { CircleItems } from "@/components/ui/circle-items";
import { Navigate } from "@/components/navigate";
import { Button } from "@/components/ui/button";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useState } from "react";
import { type FiltersStateType } from "../albums-tab";

type AlbumProps = {
  tracks: Track[];
  album: Playlist;
  artist: User;
  viewAs: FiltersStateType["viewAs"];
};

export function Album({ viewAs, ...restProps }: AlbumProps) {
  return viewAs === "list" ? (
    <ListView {...restProps} />
  ) : (
    <GridView {...restProps} />
  );
}

function ListView({ tracks, album, artist }: Omit<AlbumProps, "viewAs">) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full gap-6 px-6">
        <Image
          src={album.imageSrc ?? ""}
          alt={album.title ?? ""}
          width={130}
          height={130}
          className="size-[130px] rounded-md"
          draggable="false"
        />
        <div className="flex w-full flex-col justify-between">
          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <Navigate
                data={{
                  href: `/playlist/${album.id}`,
                  title: album.title ?? "unknown",
                  type: "PLAYLIST",
                }}
                href={`/playlist/${album.id}`}
                className="text-3xl font-bold hover:underline"
              >
                {album.title}
              </Navigate>
              <CircleItems
                items={[
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
          <AlbumControl
            data={{
              data: {
                currentPlaying: tracks[0]?.id ?? "",
                trackList: tracks.map((track) => track.id),
                type: "PLAYLIST",
                typeId: album.id,
              },
              tracks: {
                tracks,
                albums: [album],
                authors: [artist],
              },
            }}
            playlist={album}
          />
        </div>
      </div>
      {expanded ? (
        <Table>
          <NonSortTable
            showTrackImage={false}
            data={{ tracks, albums: [album], authors: [artist] }}
            playlist={album}
            viewAs="LIST"
          />
        </Table>
      ) : null}
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
