import { Discography } from "@/components/discography";
import { getPlaylists } from "@/server/actions/playlist";
import { getTracksByPlaylistIds } from "@/server/actions/track";
import { getUserById } from "@/server/actions/user";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const artist = await getUserById(userId);
  if (artist?.type !== "ARTIST" || !artist) notFound();
  const { data } = await getPlaylists({ creatorId: userId, playlistIds: [] });
  const tracks = await getTracksByPlaylistIds({
    authorId: artist.id,
    playlistIds: data?.map((playlist) => playlist.id) ?? [],
  });
  return (
    <Discography artist={artist} albums={data ?? []} tracks={tracks ?? []} />
  );
}
