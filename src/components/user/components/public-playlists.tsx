import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Navigate } from "@/components/navigate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Playlist, type User } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

type TopArtistsProps = {
  playlists: Playlist[];
  user?: User;
};

export function PublicPlaylists({ playlists, user }: TopArtistsProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);

  return playlists.length > 0 ? (
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
                href: `/artist/${user?.id}/public-playlists`,
                title: "Public Playlists" ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${user?.id}/public-playlists`}
            >
              Public Playlists
            </Navigate>
          ) : (
            "Public Playlists"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Navigate
              data={{
                href: `/artist/${user?.id}/public-playlists`,
                title: "Public Playlists" ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${user?.id}/appears-on`}
            >
              show more
            </Navigate>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={playlists.map((playlist: Playlist) => {
            return (
              <SectionItem
                imageClasses="rounded-full"
                key={playlist.id}
                alt={playlist.title ?? ""}
                title={playlist.title ?? ""}
                image={playlist.imageSrc ?? ""}
                description={`${format(new Date(playlist.createdAt), "yyy")} - ${playlist.type.toLowerCase()}`}
                link={`/artist/${user?.id}/public-playlists`}
              />
            );
          })}
        />
      </div>
    </div>
  ) : null;
}
