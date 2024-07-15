import { getAppearsPlaylists } from "@/server/actions/playlist";
import { type User } from "@prisma/client";
import { AppearsOnItems } from "./appears-on-items";

export async function AppearsOnSection({ artist }: { artist: User }) {
  const data = await getAppearsPlaylists({ creatorId: artist.id });
  return (
    <div className="w-full flex-col">
      <AppearsOnItems artist={artist} albums={data ?? []} />
    </div>
  );
}
