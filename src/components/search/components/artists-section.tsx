import {
  type NavigateClickParams,
  SectionItem,
} from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { type User } from "@prisma/client";
import { useMemo } from "react";

type ArtistsSectionProps = {
  data?: User[];
  searchClickFn: NavigateClickParams;
};

export function ArtistsSection({ data, searchClickFn }: ArtistsSectionProps) {
  const cards = useMemo(() => {
    return (
      <RenderSectionItems
        cards={
          data
            ?.filter((user) => user.type === "ARTIST")
            .map((user) => (
              <SectionItem
                artistData={user}
                key={user.id}
                onClick={searchClickFn}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return cards;
}
