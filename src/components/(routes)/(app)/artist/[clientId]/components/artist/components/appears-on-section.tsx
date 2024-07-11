import { getAppearsPlaylists } from "@/server/actions/playlist";
import { type User } from "@prisma/client";
import { AppearsOnItems } from "./appears-on-items";

export async function AppearsOnSection({ artist }: { artist: User }) {
  const data = await getAppearsPlaylists({ creatorId: artist.id });
  return (
    <div className="w-full flex-col">
      <h1 className="mb-4 text-3xl font-semibold">Appears On</h1>
      <AppearsOnItems albums={data ?? []} />
    </div>
  );
}
