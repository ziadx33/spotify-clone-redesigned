"use client";

import { type User } from "@prisma/client";
import { ArtistPickSection } from "./components/artist-pick-section";
import { useQuery } from "@tanstack/react-query";
import {
  getPopularTracks,
  getTrackById,
  getUserTopTracks,
} from "@/server/actions/track";
import { RenderTracks } from "../../render-tracks";
import { AboutSection } from "./components/about-section";
import { type tabs } from "../../tabs";
import { useUserData } from "@/hooks/use-user-data";

type HomeTabProps = {
  artist: User;
  setCurrentTab?: (value: (typeof tabs)[number]) => void;
};

export function HomeTab({ artist, setCurrentTab }: HomeTabProps) {
  const user = useUserData();
  const { data, isLoading } = useQuery({
    queryKey: [`home-tab-artist-${artist.id}-${artist.artistPick}`],
    queryFn: async () => {
      const [userTopTracks, topTracks, artistPick] = [
        await getUserTopTracks({
          user,
          artistId: artist.id,
        }),
        await getPopularTracks({
          artistId: artist.id,
          range: { from: 0, to: 10 },
        }),
        artist.artistPick ? await getTrackById(artist.artistPick) : undefined,
      ] as const;
      return { userTopTracks, topTracks, artistPick };
    },
    enabled: status === "authenticated",
  });
  return (
    <div className="flex min-h-full gap-4 pt-8">
      <div className="flex-1">
        <div className="flex flex-col gap-2">
          {(data?.userTopTracks.data.tracks?.length ?? 0) > 1 && (
            <RenderTracks
              tracksProps={{
                hideViews: true,
              }}
              title="Your most played"
              data={data?.userTopTracks.data}
              loading={isLoading || status !== "authenticated"}
            />
          )}
          <RenderTracks
            fallback="This artist hasn’t released any tracks yet. Stay tuned—new music might be coming soon!"
            title="Popular"
            data={data?.topTracks}
            loading={isLoading || status !== "authenticated"}
          />
        </div>
      </div>
      <div className="flex w-96 flex-col gap-8">
        {artist.artistPick && (
          <ArtistPickSection
            name={artist.name}
            loading={isLoading || status !== "authenticated"}
            data={data?.artistPick}
          />
        )}
        <AboutSection setCurrentTab={setCurrentTab} data={artist} />
      </div>
    </div>
  );
}
