"use client";

import { type User } from "@prisma/client";
import { UserContent } from "./components/user-content";
import { handleRequests } from "@/utils/handle-requests";
import { getPlaylists } from "@/server/actions/playlist";
import { getArtistsByIds, getFollowedArtists } from "@/server/actions/user";
import { getUserTopTracks } from "@/server/actions/track";
import { getTopArtists } from "@/utils/get-top-artists";
import { useQuery } from "@tanstack/react-query";
import Loading from "../ui/loading";

type ProfileProps = {
  user?: User;
  isUser: boolean;
};

export async function User({ user, isUser }: ProfileProps) {
  const { data } = useQuery({
    queryKey: [`user-data-${user?.id}`],
    queryFn: async () => {
      const TopTracks = await getUserTopTracks({ user, artistId: user?.id });
      const requests = [
        getPlaylists({ creatorId: user?.id ?? "", playlistIds: [] }),
        getFollowedArtists({ userId: user?.id ?? "" }),
        getArtistsByIds({
          ids:
            TopTracks?.data?.tracks
              ?.map((track) =>
                track?.authorIds.length === 0
                  ? track.authorId
                  : track?.authorIds ?? [],
              )
              .flat() ?? [],
        }),
      ] as const;

      const [{ data: publicPlaylists }, followedArtists, artists] =
        await handleRequests(requests);

      const topArtists = getTopArtists({
        artists,
        trackIds: TopTracks.trackIds,
        tracks: TopTracks.data.tracks,
      });

      return { publicPlaylists, followedArtists, topArtists, TopTracks };
    },
  });

  if (!data) return <Loading />;

  return (
    <UserContent
      isUser={isUser}
      followedArtists={data.followedArtists}
      publicPlaylists={data.publicPlaylists ?? []}
      user={user}
      topArtists={data.topArtists}
      topTracks={data.TopTracks.data}
    />
  );
}
