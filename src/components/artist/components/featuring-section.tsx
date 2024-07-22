"use client";

import { type getFeaturingAlbums } from "@/server/actions/playlist";
import { type Playlist, type User } from "@prisma/client";
import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";

type FeaturingSectionProps = {
  artist: User;
  data: Awaited<ReturnType<typeof getFeaturingAlbums>>;
};

export async function FeaturingSection({
  artist,
  data: { albums },
}: FeaturingSectionProps) {
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
            <Link href={`/artist/${artist.id}/featuring`}>
              Featuring {artist.name}
            </Link>
          ) : (
            `Featuring ${artist.name}`
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Link href={`/artist/${artist.id}/featuring`}>show more</Link>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={albums.map((album: Playlist) => {
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
  );
}
