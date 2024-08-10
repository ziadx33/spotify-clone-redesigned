"use client";

import { type User } from "@prisma/client";
import { ArtistPickSection } from "./components/artist-pick-section";
import { useQuery } from "@tanstack/react-query";
import {
  getPopularTracks,
  getTrackById,
  getUserTopTracks,
} from "@/server/actions/track";
import { useSession } from "@/hooks/use-session";
import { RenderTracks } from "../../render-tracks";
import { AboutSection } from "./components/about-section";
import { type Dispatch, type SetStateAction } from "react";
import { type tabs } from "../../tabs";

type HomeTabProps = {
  artist: User;
  setCurrentTab: Dispatch<SetStateAction<(typeof tabs)[number]>>;
};

export function HomeTab({ artist, setCurrentTab }: HomeTabProps) {
  const user = useSession();
  const { data, isLoading } = useQuery({
    queryKey: [`home-tab-${artist.id}`],
    queryFn: async () => {
      const [userTopTracks, topTracks, artistPick] = [
        await getUserTopTracks({
          user: user.data?.user,
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
  });
  return (
    <div className="flex min-h-full gap-4 pt-8">
      <div className="flex-1">
        <div className="flex flex-col gap-2">
          <RenderTracks
            tracksProps={{
              hideViews: true,
            }}
            title="Your most played"
            data={data?.userTopTracks.data}
            loading={isLoading}
          />
          <RenderTracks
            title="Popular"
            data={data?.topTracks}
            loading={isLoading}
          />
        </div>
      </div>
      <div className="flex w-96 flex-col gap-8">
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
