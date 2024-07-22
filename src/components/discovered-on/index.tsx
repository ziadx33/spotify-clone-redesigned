import { type User, type Playlist } from "@prisma/client";
import { Albums } from "../components/albums";

type DiscographyProps = {
  albums: Playlist[];
  artist: User;
};

export function DiscoveredOn({ albums, artist }: DiscographyProps) {
  return (
    <div className="flex flex-col gap-6 p-6  pt-14">
      <h1 className="pt-8 text-3xl font-bold">Discovered On</h1>
      <div className={"flex flex-row"}>
        <Albums artist={artist} albums={albums} />
      </div>
    </div>
  );
}
