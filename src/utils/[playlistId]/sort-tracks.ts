import { type TrackFilters } from "@/types";
import { type Playlist, type Track, type User } from "@prisma/client";

type FilterTracksParams = {
  tracks: Track[] | undefined;
  authors?: User[] | null;
  albums?: Playlist[] | null;
  filters: TrackFilters;
  trackQuery: string | null;
};

export const sortTracks = ({
  tracks,
  authors,
  albums,
  filters,
  trackQuery,
}: FilterTracksParams) => {
  return tracks
    ?.filter((track) =>
      trackQuery
        ? track.title.toLowerCase().includes(trackQuery.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      if (filters.sortBy === "title") {
        if (filters.title === "ASC") return a.title.localeCompare(b.title);
        if (filters.title === "DSC") return b.title.localeCompare(a.title);
      }
      if (filters.sortBy === "artist") {
        const aAuthor = authors?.find((author) => author.id === a.authorId);
        const bAuthor = authors?.find((author) => author.id === b.authorId);
        if (filters.artist === "ASC")
          return aAuthor?.name?.localeCompare(bAuthor!.name!) ?? 1;
        if (filters.artist === "DSC")
          return bAuthor?.name?.localeCompare(aAuthor!.name!) ?? 1;
      }
      if (filters.sortBy === "album") {
        const aAlbum = albums?.find((album) => album.id === a.albumId);
        const bAlbum = albums?.find((album) => album.id === b.albumId);
        if (filters.album === "ASC")
          return aAlbum?.title?.localeCompare(bAlbum!.title) ?? 1;
        if (filters.album === "DSC")
          return bAlbum?.title?.localeCompare(aAlbum!.title) ?? 1;
      }
      if (filters.sortBy === "dateAdded") {
        if (filters.dateAdded === "ASC")
          return (
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          );
        if (filters.dateAdded === "DSC")
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
      }
      if (filters.sortBy === "duration") {
        if (filters.duration === "ASC") return a.duration - b.duration;
        if (filters.dateAdded === "DSC") return b.duration - a.duration;
      }
      return 1;
    });
};
