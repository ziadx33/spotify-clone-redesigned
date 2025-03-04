"use client";

import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { getUserTopTracks } from "@/server/actions/track";
import { useQuery } from "@tanstack/react-query";
import { PopularArtistsSection } from "./popular-artists-section";
import { useUserData } from "@/hooks/use-user-data";
import { getUserByIds } from "@/server/queries/user";

export function YourFavArtists() {
  const user = useUserData();
  const { data, isLoading } = useQuery({
    queryKey: [`user-fav-artists-home`],
    queryFn: async () => {
      const topTracks = await getUserTopTracks({
        user: user,
        tracksOnly: true,
      });
      const data = getUserByIds({
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
  });
  return (
    <RenderSectionItems
      // buttons={[
      //   <EditSectionButton
      //     key="edit-button"
      //     sectionId="your favorite artists"
      //     userId={userId}
      //   />,
      // ]}
      cards={data?.map((artist) => {
        return (
          <SectionItem
            type="ARTIST"
            artistData={artist}
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
      id="your-favorite-artists"
      fallbackComponent={<PopularArtistsSection />}
    />
  );
}
