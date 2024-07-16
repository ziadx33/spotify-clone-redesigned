import { type Playlist, type User } from "@prisma/client";
import { Album } from "./album";

type AlbumsProps = {
  albums: Playlist[];
  artist: User;
};

export function Albums({ albums, artist }: AlbumsProps) {
  return albums
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((album) => <Album artist={artist} key={album.id} album={album} />);
}
