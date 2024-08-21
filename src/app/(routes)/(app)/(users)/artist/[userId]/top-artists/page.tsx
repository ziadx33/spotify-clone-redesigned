import { TopArtists } from "@/components/top-artists";
import { getArtistsByIds, getUserTopTracks } from "@/server/actions/track";
import { getUserById } from "@/server/actions/verification-token";
import { getServerAuthSession } from "@/server/auth";
import { getTopArtists } from "@/utils/get-top-artists";
import { handleRequests } from "@/utils/handle-requests";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const requests = [
    getServerAuthSession(),
    getUserById({ id: userId }),
  ] as const;
  const [user, fetchedUser] = await handleRequests(requests);
  if (user?.user.id !== fetchedUser?.id) notFound();
  const TopTracks = await getUserTopTracks({ user: user?.user });
  const artists = await getArtistsByIds({
    ids: TopTracks.data.tracks.map((track) => track.authorIds).flat(),
  });
  const topArtists = getTopArtists({
    artists,
    trackIds: TopTracks.trackIds,
    tracks: TopTracks.data.tracks,
  });

  return <TopArtists artists={topArtists} />;
}
