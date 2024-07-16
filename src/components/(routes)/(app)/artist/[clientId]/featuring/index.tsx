import { type User, type Playlist } from "@prisma/client";
import { Albums } from "../components/albums";

type FeaturingProps = {
  albums: Playlist[];
  artist: User;
};

export function Featuring({ albums, artist }: FeaturingProps) {
  return (
    <div className="flex flex-col gap-6 p-6 pt-8">
      <h1 className="pt-8 text-3xl font-bold hover:underline">
        Featuring {artist.name}
      </h1>
      <div className={"flex flex-row"}>
        <Albums artist={artist} albums={albums} />
      </div>
    </div>
  );
}
