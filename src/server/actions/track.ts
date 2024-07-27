"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "../db";
import { type TracksSliceType } from "@/state/slices/tracks";
import { handleRequests } from "@/utils/handle-requests";
import { type User } from "@prisma/client";
import { getTopRepeatedNumbers } from "@/utils/get-top-repeated-numbers";
import { getPlaylists } from "./playlist";

export const getTracksByPlaylistId = unstable_cache(
  cache(async (playlistId: string | string[]): Promise<TracksSliceType> => {
    try {
      const isArray =
        typeof playlistId === "string"
          ? { has: playlistId }
          : { hasSome: playlistId };
      const tracks = await db.track.findMany({
        where: { playlists: isArray },
      });
      const requests = [
        db.user.findMany({
          where: {
            OR: [
              { id: { in: tracks?.map((track) => track.authorId) } },
              { id: { in: tracks.map((track) => track.authorIds).flat() } },
            ],
          },
        }),
        getPlaylists({ playlistIds: tracks?.map((track) => track.albumId) }),
      ] as const;
      const [authors, { data }] = await handleRequests(requests);
      return {
        data: { tracks: tracks ?? [], authors, albums: data ?? [] },
        status: "success",
        error: null,
      };
    } catch (error) {
      return {
        status: "error",
        error: (error as { message: string }).message,
        data: null,
      };
    }
  }),
  ["track", "playlist-id", "id"],
);

type GetRecommendedTracksParams = {
  artistIds: string[];
  trackIds: string[];
};

export const getRecommendedTracks = unstable_cache(
  cache(async ({ artistIds, trackIds }: GetRecommendedTracksParams) => {
    try {
      const tracks = await db.track.findMany({
        where: {
          id: {
            notIn: trackIds,
          },
          OR: [
            {
              authorId: {
                in: artistIds,
              },
            },
            { authorIds: { hasSome: artistIds } },
          ],
        },
      });
      const requests = [
        db.user.findMany({
          where: {
            OR: [
              { id: { in: tracks?.map((track) => track.authorId) } },
              { id: { in: tracks.map((track) => track.authorIds).flat() } },
            ],
          },
        }),
        getPlaylists({ playlistIds: tracks?.map((track) => track.albumId) }),
      ] as const;
      const [authors, { data }] = await handleRequests(requests);
      return { tracks: tracks ?? [], authors, albums: data ?? [] };
    } catch (error) {
      return { error };
    }
  }),
  ["recommended-tracks"],
);

export const getTracksBySearchQuery = unstable_cache(
  cache(
    async ({
      query,
      disablePlaylists = false,
    }: {
      query: string;
      disablePlaylists?: boolean;
    }) => {
      try {
        const tracks = await db.track.findMany({
          where: {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
        });
        const requests = [
          db.user.findMany({
            where: {
              OR: [
                { id: { in: tracks?.map((track) => track.authorId) } },
                { id: { in: tracks.map((track) => track.authorIds).flat() } },
              ],
            },
          }),
          !disablePlaylists
            ? getPlaylists({
                playlistIds: tracks?.map((track) => track.albumId),
              })
            : undefined,
        ] as const;
        const [authors, data] = await handleRequests(requests);
        return { tracks: tracks ?? [], authors, albums: data?.data ?? [] };
      } catch (error) {
        throw { error };
      }
    },
  ),
);

export const getTracksByPlaylistIds = unstable_cache(
  cache(
    async ({
      authorId,
      playlistIds,
    }: {
      playlistIds: string[];
      authorId: string;
    }) => {
      try {
        const tracks = await db.track.findMany({
          where: { playlists: { hasSome: playlistIds }, authorId },
        });
        return tracks;
      } catch (error) {
        throw { error };
      }
    },
  ),
  ["tracks", "playlist-ids", "id"],
);

type RemoveTrackFromPlaylistDBProps = {
  playlistId: string;
  trackId: string;
  playlists: string[];
};

export const removeTrackFromPlaylistDB = async ({
  playlistId,
  trackId,
  playlists,
}: RemoveTrackFromPlaylistDBProps) => {
  try {
    const updatedTrack = await db.track.update({
      where: {
        id: trackId,
      },
      data: {
        playlists: playlists.filter((playlist) => playlist !== playlistId),
      },
    });
    return updatedTrack;
  } catch (error) {
    return { error };
  }
};

type AddTrackToPlaylistProps = {
  trackId: string;
  playlistId: string;
};

export const addTrackToPlaylistToDB = async ({
  trackId,
  playlistId,
}: AddTrackToPlaylistProps) => {
  try {
    const updatedTrack = await db.track.update({
      where: {
        id: trackId,
      },
      data: {
        playlists: {
          push: playlistId,
        },
      },
    });
    return updatedTrack;
  } catch (error) {
    throw { error };
  }
};

type GetPopularTracks = {
  artistId: string;
  range: {
    from: number;
    to: number;
  };
};

export const getPopularTracks = unstable_cache(
  cache(async ({ artistId, range }: GetPopularTracks) => {
    try {
      let tracks = await db.track.findMany({
        where: {
          OR: [{ authorId: artistId }, { authorIds: { has: artistId } }],
        },
        skip: range.from,
        take: range.to,
      });
      if (tracks.length === 0) tracks = await db.track.findMany();
      const authors = await db.user.findMany({
        where: {
          OR: [
            { id: { in: tracks?.map((track) => track.authorId) } },
            { id: { in: tracks.map((track) => track.authorIds).flat() } },
          ],
        },
      });
      return { tracks, authors };
    } catch (error) {
      throw { error };
    }
  }),
);

type GetSavedTracks = {
  artistId: string;
};

export const getSavedTracks = unstable_cache(
  cache(async ({ artistId }: GetSavedTracks) => {
    try {
      const playlists = await db.playlist.findMany({
        where: {
          creatorId: artistId,
          Track: {
            some: {
              OR: [
                { authorId: artistId },
                {
                  authorIds: {
                    has: artistId,
                  },
                },
              ],
            },
          },
        },
      });
      const data = await getTracksByPlaylistId(
        playlists.map((playlist) => playlist.id),
      );
      return data;
    } catch (error) {
      throw { error };
    }
  }),
);

export const getTracksByIds = unstable_cache(
  cache(async (ids: string[]) => {
    try {
      const tracks = await db.track.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      return tracks;
    } catch (error) {
      throw { error };
    }
  }),
);

type GetUserTopTracksProps = {
  user?: User;
};

type NonNullableProperties<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export const getUserTopTracks = unstable_cache(
  cache(
    async ({
      user,
    }: GetUserTopTracksProps): Promise<{
      data: NonNullableProperties<NonNullable<TracksSliceType["data"]>>;
      trackIds: ReturnType<typeof getTopRepeatedNumbers>;
    }> => {
      try {
        const trackHistory = user?.tracksHistory ?? [];
        const trackIds = getTopRepeatedNumbers(trackHistory);
        const tracks = await getTracksByIds(
          trackIds.map((trackIds) => trackIds.id),
        );
        const requests = [
          db.user.findMany({
            where: {
              OR: [
                { id: { in: tracks?.map((track) => track.authorId) } },
                { id: { in: tracks.map((track) => track.authorIds).flat() } },
              ],
            },
          }),
          getPlaylists({ playlistIds: tracks?.map((track) => track.albumId) }),
        ] as const;
        const [authors, { data: albums }] = await handleRequests(requests);
        return {
          data: {
            tracks: tracks ?? [],
            albums: albums ?? [],
            authors,
          },
          trackIds,
        };
      } catch (error) {
        throw { error };
      }
    },
  ),
);

export const getArtistsByIds = unstable_cache(
  cache(async (artistIds: string[]) => {
    try {
      const artists = await db.user.findMany({
        where: {
          id: {
            in: artistIds,
          },
        },
      });
      return artists;
    } catch (error) {
      throw { error };
    }
  }),
);
