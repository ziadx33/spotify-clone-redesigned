import { type User, type Playlist, type Track } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { AlbumControl } from "./album-control";
import { Table } from "@/components/ui/table";
import { type FiltersStateType } from "..";
import { NonSortTable } from "@/components/components/non-sort-table";
import { SectionItem } from "@/components/components/section-item";
import { CircleItems } from "@/components/ui/circle-items";
import { Navigate } from "@/components/navigate";

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
  return (
    <div className="flex flex-col gap-6 px-12">
      <div className="flex w-full gap-6 px-6">
        <Image
          src={album.imageSrc ?? ""}
          alt={album.title ?? ""}
          width={130}
          height={130}
          className="size-[130px] rounded-md"
          draggable="false"
        />
        <div className="flex flex-col justify-between">
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
                <span className="lowercase" key={album.type}>
                  {album.type}
                </span>,
                <span key={album.createdAt.toString()}>
                  {format(new Date(album.createdAt), "yyy")}
                </span>,
                <span key={tracks.length}>
                  {tracks.length} {tracks.length > 1 ? "tracks" : "track"}
                </span>,
              ]}
            />
          </div>
          <AlbumControl playlist={album} />
        </div>
      </div>
      <Table>
        <NonSortTable
          showTrackImage={false}
          data={{ tracks, albums: [album], authors: [artist] }}
          playlist={album}
          viewAs="LIST"
        />
      </Table>
    </div>
  );
}
function GridView({ album }: Omit<AlbumProps, "viewAs">) {
  return (
    <SectionItem
      key={album.id}
      alt={album.title}
      showPlayButton
      title={album.title}
      image={album.imageSrc}
      description={`${format(new Date(album.createdAt), "yyy")} - ${album.type.toLowerCase()}`}
      link={`/playlist/${album.id}`}
    />
  );
}
