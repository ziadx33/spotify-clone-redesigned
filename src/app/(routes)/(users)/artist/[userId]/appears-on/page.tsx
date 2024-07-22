import { AppearsOn } from "@/components/appears-on";
import { getAppearsPlaylists } from "@/server/actions/playlist";
import { getUserById } from "@/server/actions/user";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const artist = await getUserById(userId);
  if (artist?.type !== "ARTIST" || !artist) notFound();
  const data = await getAppearsPlaylists({ creatorId: artist.id });
  return <AppearsOn artist={artist} albums={data ?? []} />;
}
