import { getPlaylists } from "@/server/actions/playlist";
import { DiscographyItems } from "./discography-items";
import { type User } from "@prisma/client";

export async function DiscographySection({ artist }: { artist: User }) {
  const { data } = await getPlaylists({
    creatorId: artist.id,
    playlistIds: [],
  });
  return (
    <div className="w-full flex-col">
      <h1 className="mb-4 text-3xl font-semibold">Discography</h1>
      <DiscographyItems albums={data ?? []} />
    </div>
  );
}
