import { RenderCards } from "@/components/components/render-cards";
import { SectionItem } from "@/components/components/section-item";
import { Navigate } from "@/components/navigate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User } from "@prisma/client";
import { useState } from "react";

type TopArtistsProps = {
  users: User[] | null;
  user?: User;
  title: string;
};

export function UsersSection({ users, user, title }: TopArtistsProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);

  return users?.length ?? 0 > 0 ? (
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
                href: `/artist/${user?.id}/following`,
                title: title ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${user?.id}/following`}
            >
              {title}
            </Navigate>
          ) : (
            title
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Navigate
              data={{
                href: `/artist/${user?.id}/following`,
                title: title ?? "unknown",
                type: "ARTIST",
              }}
              href={`/artist/${user?.id}/following`}
            >
              show more
            </Navigate>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={
            users?.map((user: User) => {
              return (
                <SectionItem
                  imageClasses="rounded-full"
                  key={user.id}
                  alt={user.name ?? ""}
                  title={user.name ?? ""}
                  image={user.image ?? ""}
                  showPlayButton
                  description="artist"
                  artistData={user}
                  type="ARTIST"
                  link={`/artist/${user.id}?playlist=${title}`}
                />
              );
            }) ?? []
          }
        />
      </div>
    </div>
  ) : null;
}
