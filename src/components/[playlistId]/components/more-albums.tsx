"use client";

import { type Playlist, type User } from "@prisma/client";
import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { Navigate } from "@/components/navigate";
import { SectionItemSkeleton } from "@/components/artist/components/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

type MoreAlbumsProps = {
  playlist?: Playlist | null;
  data?: Playlist[] | null;
  artist?: User | null;
};

export function MoreAlbums({ data, playlist, artist }: MoreAlbumsProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);
  return (
    <div className="h-fit w-full flex-col">
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
          {data ? (
            showMoreButton ? (
              <Navigate
                data={{
                  href: `/artist/${artist?.id}?playlist=${playlist?.id}`,
                  title: `Discography - ${artist?.name}` ?? "unknown",
                  type: "ARTIST",
                }}
                href={`/artist/${artist?.id}?playlist=${playlist?.id}`}
              >
                More by {artist?.name}
              </Navigate>
            ) : (
              `More by ${artist?.name}`
            )
          ) : (
            <Skeleton className="h-8 w-64" />
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Navigate
              data={{
                href: `/artist/${artist?.id}?playlist=${playlist?.id}`,
                title: `Discography - ${artist?.name}` ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${artist?.id}?playlist=${playlist?.id}`}
            >
              show more
            </Navigate>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        {data ? (
          <RenderCards
            setShowMoreButton={setShowMoreButton}
            cards={
              data?.map((album) => {
                return (
                  <SectionItem
                    key={album.id}
                    alt={album.title}
                    showPlayButton
                    title={album.title}
                    image={album.imageSrc}
                    description={`${format(new Date(album.createdAt), "yyy")} - ${album.type.toLowerCase()}`}
                    link={`/playlist/${album.id}`}
                    playlistData={album}
                  />
                );
              }) ?? []
            }
          />
        ) : (
          <SectionItemSkeleton amount={3} />
        )}
      </div>
    </div>
  );
}
