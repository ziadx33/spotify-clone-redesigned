import { FansLike } from "@/components/fans-like";
import { getArtistFansFollowing, getUserById } from "@/server/actions/user";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const artist = await getUserById(userId);
  if (artist?.type !== "ARTIST" || !artist) notFound();
  const artists = await getArtistFansFollowing({
    artistId: artist.id,
    followers: artist.followers,
  });
  return <FansLike artists={artists} />;
}
