import { type Playlist, type User } from "@prisma/client";
import { Albums } from "@/components/components/albums";

type PublicPlaylistsProps = {
  artist: User;
  albums: Playlist[];
};

export function PublicPlaylists({ artist, albums }: PublicPlaylistsProps) {
  return (
    <div className="flex flex-col gap-6 p-6 pt-14">
      <h1 className="pt-8 text-3xl font-bold hover:underline">
        Public Playlists
      </h1>
      <div className={"flex flex-row"}>
        <Albums artist={artist} albums={albums} />
      </div>
    </div>
  );
}
