import { type Track, type User } from "@prisma/client";
import { type getTopRepeatedNumbers } from "./get-top-repeated-numbers";

type GetTopArtistsParams = {
  artists: User[];
  trackIds: ReturnType<typeof getTopRepeatedNumbers>;
  tracks: Track[];
};

export const getTopArtists = ({
  artists,
  trackIds,
  tracks,
}: GetTopArtistsParams) => {
  return artists.sort((a, b) => {
    const aArtistTracks = trackIds.filter(
      (trackId) =>
        tracks.find((track) => track.id === trackId.id)?.authorId === a.id,
    ).length;
     const bArtistTracks = trackIds.filter(
      (trackId) =>
        tracks.find((track) => track.id === trackId.id)?.authorId === b.id,
    ).length;

    return bArtistTracks - aArtistTracks;
  });
};
