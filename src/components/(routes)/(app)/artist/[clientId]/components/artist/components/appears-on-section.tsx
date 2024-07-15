import { type getAppearsPlaylists } from "@/server/actions/playlist";
import { type User } from "@prisma/client";
import { AppearsOnItems } from "./appears-on-items";

type AppearsOnSectionProps = {
  artist: User;
  data: Awaited<ReturnType<typeof getAppearsPlaylists>>;
};

export async function AppearsOnSection({
  artist,
  data,
}: AppearsOnSectionProps) {
  return (
    <div className="w-full flex-col">
      <AppearsOnItems artist={artist} albums={data ?? []} />
    </div>
  );
}
