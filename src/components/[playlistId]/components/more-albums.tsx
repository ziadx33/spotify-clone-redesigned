"use client";

import { getPlaylists } from "@/server/actions/playlist";
import { type Playlist, type User } from "@prisma/client";
import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { useQuery } from "react-query";
import Loading from "@/components/ui/loading";

type MoreAlbumsProps = {
  artist?: User | null;
  playlist?: Playlist | null;
};

export async function MoreAlbums({ artist, playlist }: MoreAlbumsProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);
  const { data: albums, isLoading } = useQuery({
    queryKey: `artist-discography-${artist?.id}`,
    queryFn: async () => {
      const { data } = await getPlaylists({
        creatorId: artist?.id,
        playlistIds: [],
      });
      return data;
    },
  });
  if (isLoading) return <Loading className="h-96" />;
  return (
    <div className="w-full flex-col">
      <div className="flex items-center justify-between">
        <Button
          variant="link"
          className={cn(
            "mb-4 pl-0 text-3xl font-semibold text-white",
            showMoreButton
              ? "hover:underline"
              : " cursor-default hover:no-underline",
          )}
          asChild={showMoreButton}
        >
          {showMoreButton ? (
            <Link
              href={`/artist/${artist?.id}/discography?playlist=${playlist?.id}`}
            >
              More by {artist?.name}
            </Link>
          ) : (
            `More by ${artist?.name}`
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Link
              href={`/artist/${artist?.id}/discography?playlist=${playlist?.id}`}
            >
              show more
            </Link>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={
            albums?.map((album: Playlist) => {
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
            }) ?? []
          }
        />
      </div>
    </div>
  );
}
