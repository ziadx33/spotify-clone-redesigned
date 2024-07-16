import { DiscoveredOn } from "@/components/(routes)/(app)/artist/[clientId]/discovered-on";
import { getPlaylists } from "@/server/actions/playlist";
import { getUserById } from "@/server/actions/user";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const artist = await getUserById(userId);
  if (artist?.type !== "ARTIST" || !artist) notFound();
  const data = await getPlaylists({ playlistIds: artist.discoveredOn });
  return <DiscoveredOn artist={artist} albums={data.data ?? []} />;
}
