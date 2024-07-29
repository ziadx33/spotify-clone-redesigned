"use client";

import { type User } from "@prisma/client";
import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { type getArtistFansFollowing } from "@/server/actions/user";
import { Navigate } from "@/components/navigate";

type AppearsOnSectionProps = {
  artist: User;
  data: Awaited<ReturnType<typeof getArtistFansFollowing>>;
};

export function FansLikeSection({ artist, data }: AppearsOnSectionProps) {
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
                href: `/artist/${artist.id}/fans-like`,
                title: `Fans like - ${artist.name}` ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${artist.id}/fans-like`}
            >
              Fans Also Like
            </Navigate>
          ) : (
            "Fans Also Like"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Navigate
              data={{
                href: `/artist/${artist.id}/fans-like`,
                title: `Fans like - ${artist.name}` ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${artist.id}/fans-like`}
            >
              show more
            </Navigate>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={data.map((user: User) => {
            return (
              <SectionItem
                type="ARTIST"
                imageClasses="rounded-full"
                key={user.id}
                alt={user.name ?? ""}
                title={user.name ?? ""}
                image={user.image ?? ""}
                description="artist"
                link={`/artist/${user.id}?playlist=fans-like`}
              />
            );
          })}
        />
      </div>
    </div>
  ) : null;
}
