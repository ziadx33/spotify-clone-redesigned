"use client";

import { type getAppearsPlaylists } from "@/server/actions/playlist";
import { type Playlist, type User } from "@prisma/client";
import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { Navigate } from "@/components/navigate";

type AppearsOnSectionProps = {
  artist: User;
  data: Awaited<ReturnType<typeof getAppearsPlaylists>>;
};

export function AppearsOnSection({ artist, data }: AppearsOnSectionProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);

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
            <Navigate
              data={{
                href: `/artist/${artist.id}/appears-on`,
                title: `Appears on - ${artist.name}` ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${artist.id}/appears-on`}
            >
              Appears On
            </Navigate>
          ) : (
            "Appears On"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Navigate
              data={{
                href: `/artist/${artist.id}/appears-on`,
                title: `Appears on - ${artist.name}` ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${artist.id}/appears-on`}
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
                playlistData={album}
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
  );
}
