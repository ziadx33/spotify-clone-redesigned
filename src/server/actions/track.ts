"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "../db";
import { type TracksSliceType } from "@/state/slices/tracks";

export const getTracksByPlaylistId = unstable_cache(
  cache(async (playlistId: string): Promise<TracksSliceType> => {
    try {
      const tracks = await db.track.findMany({
        where: { playlists: { has: playlistId } },
      });
      const authors = await db.user.findMany({
        where: {
          OR: [
            { id: { in: tracks?.map((track) => track.authorId) } },
            { id: { in: tracks.map((track) => track.authorIds).flat() } },
          ],
        },
      });
      const albums = await db.playlist.findMany({
        where: { id: { in: tracks?.map((track) => track.albumId) } },
      });
      return {
        data: { tracks: tracks ?? [], authors, albums },
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
      const tracks = await db.track.findMany({
        where: {
          OR: [{ authorId: artistId }, { authorIds: { has: artistId } }],
        },
        skip: range.from,
        take: range.to,
      });
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
  playlists: string[];
};

export const getSavedTracks = unstable_cache(
  cache(async ({ artistId, playlists }: GetSavedTracks) => {
    try {
      const tracks = await db.track.findMany({
        where: {
          OR: [
            {
              authorId: artistId,
            },
            {
              authorIds: {
                has: artistId,
              },
            },
          ],
          playlists: {
            hasSome: playlists,
          },
        },
      });
      return tracks;
    } catch (error) {
      throw { error };
    }
  }),
);
