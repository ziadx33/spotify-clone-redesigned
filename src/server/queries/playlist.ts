import { type $Enums, type User, type Playlist } from "@prisma/client";
import { baseAPI } from "../api";
import { type TracksSliceType } from "@/state/slices/tracks";

type GetPlaylistsParams = {
  creatorId?: string | null;
  playlistIds?: string[] | null;
  type?: Playlist["type"];
  excludedIds?: string[];
  range?: {
    from?: number;
    to?: number;
  };
  orderByDate?: "asc" | "desc";
  genre?: $Enums.GENRES;
  addAuthors?: boolean;
};

export async function getPlaylists({
  creatorId,
  playlistIds,
  type,
  excludedIds,
  range,
  orderByDate,
  genre,
  addAuthors,
}: GetPlaylistsParams) {
  try {
    const searchParams = new URLSearchParams();
    if (creatorId) searchParams.append("creatorId", creatorId);
    if (playlistIds) searchParams.append("playlistIds", playlistIds.join(","));
    if (type) searchParams.append("type", type);
    if (excludedIds) searchParams.append("excludedIds", excludedIds.join(","));
    if (range?.from) searchParams.append("from", range.from.toString());
    if (range?.to) searchParams.append("to", range.to.toString());
    if (orderByDate) searchParams.append("orderByDate", orderByDate);
    if (genre) searchParams.append("genre", genre);
    if (addAuthors) searchParams.append("addAuthors", addAuthors ? "1" : "0");

    const response = await baseAPI.get<Playlist[]>(
      `/api/playlists?${searchParams.toString()}`,
    );
    return {
      data: response.data,
      status: "success",
      error: null,
    };
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return {
      status: "error",
      error: (error as { message: string }).message,
      data: null,
    };
  }
}

type GetPlaylistsBySearchQueryParams = {
  query: string;
  amount?: number;
  type?: $Enums.USER_TYPE;
  restartLength?: number;
};

export const getPlaylistsBySearchQuery = async ({
  query,
  amount,
  restartLength,
}: GetPlaylistsBySearchQueryParams) => {
  try {
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (amount) params.append("amount", amount.toString());
    if (restartLength) params.append("userType", restartLength.toString());

    const response = await baseAPI.get<{
      playlists: Playlist[];
      authors: User[];
    }>(`/api/playlists/search?${params.toString()}`);

    return response.data;
  } catch (error) {
    console.error("Error searching playlists:", error);
    return null;
  }
};

type GetPopularPlaylistsParams = {
  type?: $Enums.GENRES;
  range?: {
    from?: number;
    to?: number;
  };
};

export const getPopularPlaylists = async ({
  range,
  type,
}: GetPopularPlaylistsParams) => {
  try {
    const params = new URLSearchParams();

    if (type) params.append("type", type);
    if (range?.from) params.append("from", range.from.toString());
    if (range?.to) params.append("to", range.to.toString());

    const response = await baseAPI.get<{
      playlists: Playlist[];
      authors: User[];
    }>(`/api/playlists/popular?${params.toString()}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching popular playlists:", error);
    return null;
  }
};

export const getPlaylist = async ({ id }: { id: string }) => {
  try {
    const response = await baseAPI.get<Playlist>(`/api/playlists/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return null;
  }
};

export const getNumberSavedPlaylist = async ({
  playlistId,
}: {
  playlistId: string;
}) => {
  try {
    const response = await baseAPI.get<number>(
      `/api/playlists/${playlistId}/saved`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching saved playlist number:", error);
    return null;
  }
};
type GetPlaylistTracksParams = {
  playlistId?: string;
  playlistIds?: string[];
  trackIds?: string[];
  albumData?: boolean;
  tracksData?: boolean;
  authorId?: string;
};

export async function getPlaylistTracks({
  playlistId,
  playlistIds,
  trackIds,
  albumData,
  tracksData,
  authorId,
}: GetPlaylistTracksParams) {
  const params = new URLSearchParams();

  if (playlistIds) params.append("playlistIds", playlistIds?.join(","));
  if (trackIds) params.append("trackIds", trackIds.join(","));
  if (albumData) params.append("albumData", albumData ? "1" : "0");
  if (tracksData) params.append("tracksData", tracksData ? "1" : "0");
  if (authorId) params.append("authorId", authorId);

  const response = await baseAPI.get<TracksSliceType>(
    `/api/playlists/${playlistId}/tracks?${params.toString()}`,
  );
  return response.data;
}
