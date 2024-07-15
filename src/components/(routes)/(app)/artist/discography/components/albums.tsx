import { type Track, type Playlist, type User } from "@prisma/client";
import { Album } from "./album";
import { type FiltersStateType } from "..";

type AlbumsProps = {
  albums: Playlist[];
  tracks: Track[];
  artist: User;
  filters: FiltersStateType;
};

export function Albums({ albums, tracks, artist, filters }: AlbumsProps) {
  return albums
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .filter((album) => {
      const filterBy = filters.filterBy;
      if (filterBy === "albums") return album.type === "ALBUM";
      if (filterBy === "singles") return album.type === "SINGLE";
      return true;
    })
    .map((album) => (
      <Album
        viewAs={filters.viewAs}
        artist={artist}
        key={album.id}
        album={album}
        tracks={tracks.filter((track) => track.playlists.includes(album.id))}
      />
    ));
}
