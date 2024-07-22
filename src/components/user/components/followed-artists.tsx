import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

type TopArtistsProps = {
  artists: User[];
  user?: User;
};

export function FollowedArtists({ artists, user }: TopArtistsProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);

  return artists.length > 0 ? (
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
            <Link href={`/artist/${user?.id}/following`}>Following</Link>
          ) : (
            "Following"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Link href={`/artist/${user?.id}/following`}>show more</Link>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={artists.map((user: User) => {
            return (
              <SectionItem
                imageClasses="rounded-full"
                key={user.id}
                alt={user.name ?? ""}
                title={user.name ?? ""}
                image={user.image ?? ""}
                description="artist"
                link={`/artist/${user.id}?playlist=following`}
              />
            );
          })}
        />
      </div>
    </div>
  ) : null;
}
