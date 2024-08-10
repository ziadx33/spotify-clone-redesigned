import { type Track, type Playlist, type User } from "@prisma/client";
import { Album } from "./album";
import { type FiltersStateType } from "../albums-tab";
import { useMemo } from "react";

type AlbumsProps = {
  data: Playlist[];
  tracks: Track[];
  artist: User;
  filters: FiltersStateType;
  query: string | null;
};

export function Albums({ data, tracks, artist, filters, query }: AlbumsProps) {
  const albums = useMemo(() => {
    const sortedAlbums = data?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const filteredAlbums = query
      ? sortedAlbums?.filter((track) =>
          track.title.toLowerCase().includes(query?.toLowerCase().trim() ?? ""),
        )
      : [];
    return filteredAlbums?.length === 0 ? sortedAlbums : filteredAlbums;
  }, [query]);
  return albums.map((album) => (
    <Album
      viewAs={filters.viewAs}
      artist={artist}
      key={album.id}
      album={album}
      tracks={tracks.filter((track) => track.playlists.includes(album.id))}
    />
  ));
}
