import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Navigate } from "@/components/navigate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User } from "@prisma/client";
import { useState } from "react";

type TopArtistsProps = {
  artists: User[];
  user?: User;
};

export function TopArtists({ artists, user }: TopArtistsProps) {
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
            <Navigate
              data={{
                href: `/artist/${user?.id}/top-artists`,
                title: "Top artists" ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${user?.id}/top-artists`}
            >
              Top artists this month
            </Navigate>
          ) : (
            "Top artists this month"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Navigate
              data={{
                href: `/artist/${user?.id}/top-artists`,
                title: "Top artists" ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${user?.id}/top-artists`}
            >
              show more
            </Navigate>
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
                link={`/artist/${user.id}?playlist=top-artists`}
              />
            );
          })}
        />
      </div>
    </div>
  ) : null;
}
