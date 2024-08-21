import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { type User } from "@prisma/client";
import { useMemo } from "react";

type ArtistsSectionProps = {
  data?: User[];
};

export function ProfilesSection({ data }: ArtistsSectionProps) {
  const cards = useMemo(() => {
    return (
      <RenderSectionItems
        cards={data
          ?.filter((user) => user.type === "USER")
          .map((user) => {
            return (
              <SectionItem
                key={user.id}
                description="Profile"
                title={user.name}
                link={`/artist/${user.id}?playlist=search`}
                image={user.image ?? ""}
                type="ARTIST"
              />
            );
          })}
        title="Profiles"
      />
    );
  }, [data]);
  return cards;
}
