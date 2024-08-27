"use client";

import { type getPlaylists } from "@/server/actions/playlist";
import { type Playlist, type User } from "@prisma/client";
import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { Navigate } from "@/components/navigate";

type DiscoveredOnSectionProps = {
  artist: User;
  data: NonNullable<Awaited<ReturnType<typeof getPlaylists>>["data"]>;
};

export async function DiscoveredOnSection({
  artist,
  data,
}: DiscoveredOnSectionProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);

  return data.length > 0 ? (
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
            <Navigate
              data={{
                href: `/artist/${artist.id}/discovered-on`,
                title: `Discovered on - ${artist.name}` ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${artist.id}/discovered-on`}
            >
              Discovered on
            </Navigate>
          ) : (
            "Discovered on"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Navigate
              data={{
                href: `/artist/${artist.id}/discovered-on`,
                title: `Discovered on - ${artist.name}` ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${artist.id}/discovered-on`}
            >
              show more
            </Navigate>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={data.map((album: Playlist) => {
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
          })}
        />
      </div>
    </div>
  ) : null;
}
