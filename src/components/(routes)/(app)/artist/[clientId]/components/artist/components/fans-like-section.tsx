"use client";

import { type User } from "@prisma/client";
import { RenderCards } from "@/components/(routes)/(app)/components/render-cards";
import { SectionItem } from "@/components/(routes)/(app)/components/section-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import { useState } from "react";
import { type getArtistFansFollowing } from "@/server/actions/user";

type AppearsOnSectionProps = {
  artist: User;
  data: Awaited<ReturnType<typeof getArtistFansFollowing>>;
};

export async function FansLikeSection({ artist, data }: AppearsOnSectionProps) {
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
            <Link href={`/artist/${artist.id}/fans-like`}>Fans Also Like</Link>
          ) : (
            "Fans Also Like"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Link href={`/artist/${artist.id}/appears-on`}>show more</Link>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={data.map((user: User) => {
            return (
              <SectionItem
                imageClasses="rounded-full"
                key={user.id}
                alt={user.name ?? ""}
                title={user.name ?? ""}
                image={user.image ?? ""}
                description="artist"
                link={`/artist/${user.id}`}
              />
            );
          })}
        />
      </div>
    </div>
  ) : null;
}
