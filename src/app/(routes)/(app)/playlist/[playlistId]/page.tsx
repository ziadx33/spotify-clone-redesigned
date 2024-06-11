import { Playlist } from "@/components/(routes)/(app)/playlist/[playlistId]";

export default async function PlaylistPage({
  params: { playlistId },
}: {
  params: { playlistId: string };
}) {
  return <Playlist id={playlistId} />;
}
