"use client";

import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { useSession } from "@/hooks/use-session";
import { getUserTopTracks } from "@/server/actions/track";
import { getArtistsByIds } from "@/server/actions/user";
import { useQuery } from "@tanstack/react-query";
import { PopularArtistsSection } from "./popular-artists-section";
import { EditSectionButton } from "./edit-section-button";

type YourFavArtistsProps = {
  userId: string;
};

export function YourFavArtists({ userId }: YourFavArtistsProps) {
  const { data: user } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ["fav-artists-home"],
    queryFn: async () => {
      const topTracks = await getUserTopTracks({
        user: user?.user,
      });
      const data = getArtistsByIds({
        ids:
          topTracks?.data?.tracks
            ?.map((track) =>
              track?.authorIds.length === 0
                ? track.authorId
                : track?.authorIds ?? [],
            )
            .flat() ?? [],
      });
      return data;
    },
    enabled: !!user,
  });
  return (
    <RenderSectionItems
      buttons={[
        <EditSectionButton
          key="edit-button"
          sectionId="your favorite artists"
          userId={userId}
        />,
      ]}
      cards={data?.map((artist) => {
        return (
          <SectionItem
            type="ARTIST"
            link={`/artist/${artist.id}?playlist=fav-artists`}
            key={artist.id}
            title={artist.name ?? ""}
            image={artist.image ?? ""}
            showPlayButton
            imageClasses="rounded-full"
          />
        );
      })}
      isLoading={isLoading || !data}
      title="Your favorite artists"
      fallbackComponent={<PopularArtistsSection />}
    />
  );
}
