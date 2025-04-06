import { type $Enums, type Track } from "@prisma/client";
import { baseAPI } from "../api";
import { type TracksDataType } from "@/types";

type GetRecommendedTracksParams = {
  artistIds: string[];
  trackIds: string[];
  range?: {
    from: number;
    to: number;
  };
};

export const getRecommendedTracks = async ({
  artistIds,
  trackIds,
  range = { from: 0, to: 15 },
}: GetRecommendedTracksParams) => {
  try {
    const searchParams = new URLSearchParams();
    if (range?.from) searchParams.append("from", range.from.toString());
    if (range?.to) searchParams.append("to", range.to.toString());
    if (artistIds) searchParams.append("artistIds", artistIds.join(","));
    if (trackIds) searchParams.append("trackIds", trackIds.join(","));

    const response = await baseAPI.get<TracksDataType>(
      `/api/tracks/recommended?${searchParams.toString()}`,
    );
    return response.data;
  } catch (error) {
    throw { error };
  }
};

type GetTracksBySearchQueryParams = {
  query: string;
  disablePlaylists?: boolean;
  amount?: number;
  type?: $Enums.USER_TYPE;
  restartLength?: number;
  skip?: number;
};

export const getTracksBySearchQuery = async ({
  query,
  disablePlaylists = false,
  amount,
  type,
  restartLength,
  skip,
}: GetTracksBySearchQueryParams) => {
  try {
    const searchParams = new URLSearchParams();
    if (query) searchParams.append("query", query);
    if (type) searchParams.append("type", type);
    if (skip) searchParams.append("skip", skip.toString());
    if (amount) searchParams.append("amount", amount.toString());
    if (disablePlaylists)
      searchParams.append("disablePlaylists", disablePlaylists ? "1" : "0");
    if (restartLength)
      searchParams.append("userType", restartLength.toString());

    const response = await baseAPI.get<TracksDataType>(
      `/api/tracks/search?${searchParams.toString()}`,
    );
    return response.data;
  } catch (error) {
    throw { error };
  }
};

export const getTrackById = async ({ id }: { id: string }) => {
  try {
    const response = await baseAPI.get<Track>(`/api/tracks/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching track:", error);
    return null;
  }
};

type GetPopularTracks = {
  artistId?: string;
  artistIds?: string[];
  range?: {
    from?: number;
    to?: number;
  };
  addAlbums?: boolean;
};

export async function getPopularTracks({
  artistId,
  artistIds,
  range = { from: 0 },
  addAlbums,
}: GetPopularTracks) {
  const searchParams = new URLSearchParams();
  if (range.from) searchParams.append("from", range.from.toString());
  if (range.to) searchParams.append("to", range.to.toString());
  if (artistId) searchParams.append("artistId", artistId);
  if (artistIds) searchParams.append("artistIds", artistIds.join(","));
  if (addAlbums) searchParams.append("addAlbums", addAlbums ? "1" : "0");

  const response = await baseAPI.get<TracksDataType>(
    `/api/tracks/popular?${searchParams.toString()}`,
  );
  return response.data;
}

type GetTracksByGenresParams = {
  genres?: $Enums.GENRES[];
  range?: {
    from?: number;
    to?: number;
  };
  addTracksData?: boolean;
  ids?: string[];
  artistId?: string;
  type?: $Enums.PLAYLIST_TYPE;
};

export async function getTracks({
  genres,
  range,
  addTracksData,
  artistId,
  ids,
  type,
}: GetTracksByGenresParams) {
  const searchParams = new URLSearchParams();
  if (range?.from) searchParams.append("from", range.from.toString());
  if (range?.to) searchParams.append("to", range.to.toString());
  if (genres) searchParams.append("genres", genres.join(","));
  if (addTracksData)
    searchParams.append("addTracksData", addTracksData ? "1" : "0");
  if (ids) searchParams.append("ids", ids.join(","));
  if (artistId) searchParams.append("artistId", artistId);
  if (type) searchParams.append("type", type);

  const response = await baseAPI.get<TracksDataType & { error?: string }>(
    `/api/tracks?${searchParams.toString()}`,
  );
  return response.data;
}
