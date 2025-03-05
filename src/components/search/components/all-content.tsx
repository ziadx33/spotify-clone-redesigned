import { NonSortTable } from "@/components/components/non-sort-table";
import { Navigate } from "@/components/navigate";
import { Card, CardContent } from "@/components/ui/card";
import { CircleItems } from "@/components/ui/circle-items";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { enumParser } from "@/utils/enum-parser";
import { type Track } from "@prisma/client";
import { useMemo } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { ArtistsSection } from "./artists-section";
import { AlbumsSection } from "./albums-section";
import { PlaylistsSection } from "./playlists-section";
import { ProfilesSection } from "./profiles-section";
import Link from "next/link";
import { AvatarData } from "@/components/avatar-data";
import { QueuePlayButton } from "@/components/queue-play-button";
import { type SearchClickFnType } from "./search-content";
import { type SearchQueryReturn } from "@/server/queries/search";

type AllContentProps = SearchQueryReturn & {
  searchClickFn: SearchClickFnType;
};

export function AllContent({
  tracks,
  topSearch,
  topSearchCreator,
  playlists,
  authors,
  searchClickFn,
}: AllContentProps) {
  const { topTrack, topData } = useMemo(() => {
    const topTrack = (tracks.tracks as [Track])[0];

    const topData = {
      albumId:
        (topSearch?.type === "author"
          ? topSearch.data.id
          : topSearch?.type === "playlist"
            ? topSearch.data.id
            : topSearch?.data.albumId) ?? topTrack.albumId,
      trackId:
        topSearch?.type !== "author" &&
        topSearch?.type !== "playlist" &&
        topSearch?.data.id,
      authorId:
        (topSearch?.type === "author"
          ? topSearch.data.id
          : topSearch?.type === "playlist"
            ? topSearch.data.creatorId
            : topSearch?.data.authorId) ?? topTrack.authorId,
      href:
        (topSearch?.type === "author"
          ? `/artist/${topSearch?.data.id}?playlist=search`
          : topSearch?.type === "playlist"
            ? `/playlist/${topSearch?.data.id}`
            : `/playlist/${topSearch?.data.albumId}`) ??
        `/playlist/${topTrack.albumId}`,
      image:
        (topSearch?.type === "author"
          ? topSearch.data.image
          : topSearch?.type === "playlist"
            ? topSearch.data.imageSrc
            : topSearch?.data.imgSrc) ?? null,

      title:
        (topSearch?.type === "author"
          ? topSearch.data.name
          : topSearch?.data.title) ?? topTrack.title,
    };
    return { topTrack, topData };
  }, [tracks, topSearch]);

  return (
    <div className="flex size-full flex-col">
      <div className="flex w-full gap-6 max-lg:flex-col">
        <div className="flex flex-col">
          <b className="mb-2 text-3xl">Top result</b>
          <Card className="h-[217px] w-[437.688px] border-none bg-background transition-colors hover:bg-muted max-lg:w-full">
            <CardContent className="size-full p-0">
              <Navigate
                data={{
                  href: topData.href,
                  title: topTrack.title ?? "unknown",
                  type: "ARTIST",
                }}
                href={topData.href}
                className="group relative flex size-full flex-col overflow-hidden p-5"
              >
                <AvatarData
                  containerClasses={cn(
                    "size-[92px] rounded-lg shadow-2xl",
                    topSearch?.type === "author" && "rounded-full",
                  )}
                  src={topData.image ?? ""}
                  alt={topData.title}
                  title={topData.title}
                />

                <b className="mt-6 text-3xl">{topData.title}</b>
                {topSearch?.type === "author" ? (
                  <span className="text-white">Artist</span>
                ) : (
                  <CircleItems
                    items={[
                      topSearch?.type === "playlist"
                        ? enumParser(topSearch.data.type)
                        : "Track",
                      <Link
                        href={`/artist/${topSearchCreator?.id}?playlist=${topData.albumId}`}
                        key={topSearchCreator?.name}
                        className="text-white"
                      >
                        {topSearchCreator?.name}
                      </Link>,
                    ]}
                  />
                )}
                <QueuePlayButton
                  track={
                    topSearch?.type === "track" ? topSearch?.data : undefined
                  }
                  playlist={
                    topSearch?.type === "playlist" ? topSearch?.data : undefined
                  }
                  artist={
                    topSearch?.type === "author" ? topSearch?.data : undefined
                  }
                  size="icon"
                  className="absolute -bottom-20 right-4 h-16 w-16 rounded-full opacity-0 transition-all duration-300 hover:bg-primary group-hover:bottom-4 group-hover:opacity-100"
                >
                  {(isPlaying, checkTrack) =>
                    (
                      !isPlaying ||
                      ["author", "playlist"].includes(topSearch?.type ?? "")
                        ? true
                        : checkTrack?.(topSearch!.data as Track)
                    ) ? (
                      <FaPlay size={20} />
                    ) : (
                      <FaPause size={20} />
                    )
                  }
                </QueuePlayButton>
              </Navigate>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full flex-col">
          <b className="mb-2 text-3xl">Tracks</b>
          <Table className="w-full">
            <NonSortTable
              showHead={false}
              viewAs="LIST"
              limit={4}
              hidePlayButton
              data={tracks}
            />
          </Table>
        </div>
      </div>
      <ArtistsSection data={tracks.authors} searchClickFn={searchClickFn} />
      <AlbumsSection data={playlists} searchClickFn={searchClickFn} />
      <PlaylistsSection data={playlists} searchClickFn={searchClickFn} />
      <ProfilesSection data={authors} searchClickFn={searchClickFn} />
    </div>
  );
}
