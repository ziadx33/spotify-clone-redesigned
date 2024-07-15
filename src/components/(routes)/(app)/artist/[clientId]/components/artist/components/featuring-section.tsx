import { type getFeaturingAlbums } from "@/server/actions/playlist";
import { type User } from "@prisma/client";
import { FeaturingItems } from "./featuring-items";

type FeaturingSectionProps = {
  artist: User;
  data: Awaited<ReturnType<typeof getFeaturingAlbums>>;
};

export async function FeaturingSection({
  artist,
  data: { albums },
}: FeaturingSectionProps) {
  return (
    <div className="w-full flex-col">
      <FeaturingItems artist={artist} albums={albums} />
    </div>
  );
}
