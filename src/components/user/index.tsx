"use client";

import { type User } from "@prisma/client";
import { UserContent } from "./components/user-content";
import { getTopArtists } from "@/utils/get-top-artists";
import { useQuery } from "@tanstack/react-query";
import Loading from "../ui/loading";
import {
  getUserByIds,
  getUserFollowing,
  getUserTopTracks,
} from "@/server/queries/user";
import { getPlaylists } from "@/server/queries/playlist";

type ProfileProps = {
  user?: User;
  isUser: boolean;
};

export function User({ user, isUser }: ProfileProps) {
  const { data } = useQuery({
    queryKey: [`user-data-${user?.id}`],
    queryFn: async () => {
      const TopTracks = await getUserTopTracks({ userId: user?.id });
      const [
        { data: publicPlaylists },
        followedArtists,
        followerUsers,
        artists,
      ] = [
        await getPlaylists({ creatorId: user?.id ?? "", playlistIds: [] }),
        await getUserFollowing({ id: user?.id ?? "", userType: "ARTIST" }),
        await getUserByIds({ ids: user?.followers ?? [] }),
        await getUserByIds({
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

      const topArtists = getTopArtists({
        artists: artists ?? [],
        trackIds: TopTracks.trackIds,
        tracks: TopTracks.data.tracks ?? [],
      });

      return {
        publicPlaylists,
        followedArtists,
        topArtists,
        TopTracks,
        followerUsers,
      };
    },
  });

  if (!data) return <Loading />;

  return (
    <UserContent
      isUser={isUser}
      followedArtists={data.followedArtists ?? []}
      followerUsers={data.followerUsers}
      publicPlaylists={data.publicPlaylists ?? []}
      user={user}
      topArtists={data.topArtists}
      topTracks={data.TopTracks.data}
    />
  );
}
