"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getTracksBySearchQuery } from "./track";
import { handleRequests } from "@/utils/handle-requests";
import { getPlaylistsBySearchQuery } from "./playlist";
import { getUsersBySearchQuery } from "./user";

export const getSearchQueryData = async ({ query }: { query: string }) => {
  try {
    const requests = [
      getTracksBySearchQuery({ query, disablePlaylists: true }),
      getPlaylistsBySearchQuery({ query }),
      getUsersBySearchQuery({ query }),
    ] as const;
    const [tracks, playlists, authors] = await handleRequests(requests);
    return {
      tracks,
      playlists: playlists,
      authors: authors instanceof Array ? authors : [],
    };
  } catch (error) {
    throw { error };
  }
};

export type SearchQueryReturn = Awaited<ReturnType<typeof getSearchQueryData>>;
