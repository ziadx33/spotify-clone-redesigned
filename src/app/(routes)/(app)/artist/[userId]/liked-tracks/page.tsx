import { LikedTracks } from "@/components/(routes)/(app)/artist/[clientId]/liked-tracks";
import { getSavedTracks } from "@/server/actions/track";
import { getUserById } from "@/server/actions/user";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const artist = await getUserById(userId);
  if (artist?.type !== "ARTIST" || !artist) notFound();
  const data = await getSavedTracks({ artistId: artist.id });
  return <LikedTracks artist={artist} data={data} />;
}
