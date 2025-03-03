"use server";

import { getTracksBySearchQuery } from "./track";
import { handleRequests } from "@/utils/handle-requests";
import { getPlaylistsBySearchQuery } from "./playlist";
import { type Playlist, type Track, type User } from "@prisma/client";
import { getUserById } from "./verification-token";
import { getUsersBySearchQuery } from "../queries/user";

export const getSearchQueryData = async ({ query }: { query: string }) => {
  try {
    const requests = [
      getTracksBySearchQuery({
        query,
        amount: 15,
        restartLength: 1,
      }),
      getPlaylistsBySearchQuery({ query, amount: 15 }),
      getUsersBySearchQuery({ query, amount: 15 }),
    ] as const;

    const [tracks, playlists, authors] = await handleRequests(requests);
    const returnAuthors = authors instanceof Array ? authors : [];

    const containsQuery = (text: string) =>
      text.toLowerCase().includes(query.toLowerCase());

    const topTrack = tracks.tracks.find((track) => containsQuery(track.title));
    const topPlaylist = playlists.playlists.find((playlist) =>
      containsQuery(playlist.title),
    );
    const topAuthor = returnAuthors.find((author) =>
      containsQuery(author.name),
    );

    type TopSearchType =
      | { data: Track; type: "track" }
      | { data: User; type: "author" }
      | { data: Playlist; type: "playlist" };

    const topSearch: TopSearchType | undefined = topTrack
      ? { data: topTrack, type: "track" }
      : topPlaylist
        ? { data: topPlaylist, type: "playlist" }
        : topAuthor
          ? { data: topAuthor, type: "author" }
          : undefined;

    const userId =
      topSearch?.type !== "author"
        ? topSearch?.type === "playlist"
          ? topSearch.data.creatorId
          : topSearch?.data.authorId
        : undefined;

    const topSearchCreator =
      topSearch?.type !== "author"
        ? returnAuthors.find((author) => author.id === userId) ??
          (await getUserById({ id: userId, type: "ARTIST" }))
        : undefined;
    const sortedTracks = {
      ...tracks,
      tracks: [...tracks.tracks].sort((a, b) => {
        if (a.authorId === userId || a.id === topTrack?.id) return -1;
        if (b.authorId === userId || b.id === topTrack?.id) return 1;
        return 0;
      }),
    };
    return {
      topSearch,
      topSearchCreator,
      tracks: sortedTracks,
      playlists,
      authors: returnAuthors,
    };
  } catch (error) {
    throw { error };
  }
};

export type SearchQueryReturn = Awaited<ReturnType<typeof getSearchQueryData>>;
