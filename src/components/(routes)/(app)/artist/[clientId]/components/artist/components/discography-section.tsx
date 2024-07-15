import { type getPlaylists } from "@/server/actions/playlist";
import { DiscographyItems } from "./discography-items";
import { type User } from "@prisma/client";

type DiscographySectionProps = {
  artist: User;
  data: Awaited<ReturnType<typeof getPlaylists>>;
};

export async function DiscographySection({
  artist,
  data: { data },
}: DiscographySectionProps) {
  return (
    <div className="w-full flex-col">
      <DiscographyItems artist={artist} albums={data ?? []} />
    </div>
  );
}
