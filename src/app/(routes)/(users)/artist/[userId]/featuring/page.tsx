import { Featuring } from "@/components/featuring";
import { getFeaturingAlbums } from "@/server/actions/playlist";
import { getUserById } from "@/server/actions/user";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const artist = await getUserById(userId);
  if (artist?.type !== "ARTIST" || !artist) notFound();
  const { albums } = await getFeaturingAlbums({ artistId: artist.id });
  return <Featuring artist={artist} albums={albums} />;
}
