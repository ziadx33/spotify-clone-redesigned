import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { type User } from "@prisma/client";
import { useMemo } from "react";

type ArtistsSectionProps = {
  data?: User[];
};

export function ArtistsSection({ data }: ArtistsSectionProps) {
  const cards = useMemo(() => {
    return (
      <RenderSectionItems
        cards={
          data
            ?.filter((user) => user.type === "ARTIST")
            .map((user) => (
              <SectionItem
                key={user.id}
                description="Artist"
                title={user.name}
                link={`/artist/${user.id}?playlist=search`}
                image={user.image ?? ""}
                type="ARTIST"
                imageClasses="rounded-full"
                showPlayButton
              />
            )) ?? []
        }
        title="Artists"
      />
    );
  }, [data]);
  return cards;
}
