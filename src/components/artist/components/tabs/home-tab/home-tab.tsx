"use client";

import { type User } from "@prisma/client";
import { ArtistPickSection } from "./components/artist-pick-section";
import { useQuery } from "@tanstack/react-query";
import { RenderTracks } from "../../render-tracks";
import { AboutSection } from "./components/about-section";
import { type tabs } from "../../tabs";
import { useUserData } from "@/hooks/use-user-data";
import { getPopularTracks, getTrackById } from "@/server/queries/track";
import { getUserTopTracks } from "@/server/queries/user";

type HomeTabProps = {
  artist: User;
  setCurrentTab?: (value: (typeof tabs)[number]) => void;
};

export function HomeTab({ artist, setCurrentTab }: HomeTabProps) {
  const user = useUserData();
  const { data, isLoading } = useQuery({
    queryKey: [`home-tab-artist-data-${artist.id}-${artist.artistPick}`],
    queryFn: async () => {
      const [userTopTracks, topTracks, artistPick] = [
        await getUserTopTracks({
          userId: user.id,
          artistId: artist.id,
        }),
        await getPopularTracks({
          artistId: artist.id,
          range: { from: 0, to: 10 },
        }),
        artist.artistPick
          ? await getTrackById({ id: artist.artistPick })
          : undefined,
      ] as const;
      return { userTopTracks, topTracks, artistPick };
    },
  });
  return (
    <div className="flex min-h-full gap-4 pt-8 max-xl:flex-col">
      <div className="flex-1">
        <div className="flex flex-col gap-2">
          {(data?.userTopTracks.data.tracks?.length ?? 0) > 1 && (
            <RenderTracks
              tracksProps={{
                hideViews: true,
              }}
              title="Your most played"
              data={{
                authors: data?.userTopTracks.data.authors ?? [],
                tracks: data?.userTopTracks.data.tracks ?? [],
              }}
              loading={isLoading}
            />
          )}
          <RenderTracks
            fallback="This artist hasn’t released any tracks yet. Stay tuned—new music might be coming soon!"
            title="Popular"
            data={data?.topTracks}
            loading={isLoading}
          />
        </div>
      </div>
      <div className="flex w-full max-w-96 flex-col gap-8 max-lg:pl-4">
        {artist.artistPick && (
          <ArtistPickSection
            name={artist.name}
            loading={isLoading}
            data={data?.artistPick}
          />
        )}
        <AboutSection setCurrentTab={setCurrentTab} data={artist} />
      </div>
    </div>
  );
}
