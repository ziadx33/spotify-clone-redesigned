"use server";

import { type PlaylistsSliceType } from "@/state/slices/playlists";
import { db } from "../db";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { type Session } from "@/hooks/use-session";
import { type Playlist } from "@prisma/client";
import { getArtistsByIds } from "./track";

type GetPlaylistsParams = {
  creatorId?: string;
  playlistIds: string[];
};

export const getPlaylists = unstable_cache(
  cache(
    async ({
      creatorId,
      playlistIds,
    }: GetPlaylistsParams): Promise<PlaylistsSliceType> => {
      try {
        const playlists = await db.playlist.findMany({
          where: {
            OR: [
              {
                creatorId,
              },
              {
                id: {
                  in: playlistIds,
                },
              },
            ],
          },
        });

        return {
          data: playlists,
          status: "success",
          error: null,
        };
      } catch (error) {
        throw {
          status: "error",
          error: (error as { message: string }).message,
          data: null,
        };
      }
    },
  ),
  ["playlists"],
);

type GetFeaturingAlbumsProps = {
  artistId: string;
};

export const getFeaturingAlbums = unstable_cache(
  cache(async ({ artistId }: GetFeaturingAlbumsProps) => {
    try {
      const tracks = await db.track.findMany({
        where: {
          authorIds: {
            has: artistId,
          },
        },
      });
      const albums = await db.playlist.findMany({
        where: {
          creatorId: {
            not: artistId,
          },
          id: {
            in: tracks.map((track) => track.playlists).flat(),
          },
        },
      });
      return { albums };
    } catch (error) {
      throw { error };
    }
  }),
  ["featuring-artist-albums"],
);

export const getPlaylist = unstable_cache(
  cache(async (playlistId: string) => {
    try {
      const playlist = await db.playlist.findUnique({
        where: { id: playlistId },
      });
      return playlist;
    } catch (error) {
      throw { error };
    }
  }),
  ["playlist", "id"],
);

export const createPlaylist = unstable_cache(
  cache(async (user: Session | null) => {
    try {
      const createdPlaylist = db.playlist.create({
        data: {
          description: "",
          title: "Untitled playlist",
          creatorId: user!.user!.id,
        },
      });
      return createdPlaylist;
    } catch (error) {
      throw { error };
    }
  }),
);

export const deletePlaylist = unstable_cache(
  cache(async (id: string) => {
    try {
      const deletedPlaylist = db.playlist.delete({
        where: { id },
      });
      return deletedPlaylist;
    } catch (error) {
      throw { error };
    }
  }),
);

export const updatePlaylist = unstable_cache(
  cache(async ({ id, data }: { id: string; data: Partial<Playlist> }) => {
    try {
      const updatedPlaylist = db.playlist.update({
        where: { id },
        data,
      });
      return updatedPlaylist;
    } catch (error) {
      throw { error };
    }
  }),
);

export const getAppearsPlaylists = unstable_cache(
  cache(async ({ creatorId }: { creatorId: string }) => {
    try {
      const playlists = await db.playlist.findMany({
        where: {
          Track: {
            some: {
              authorId: {
                not: creatorId,
              },
              authorIds: {
                has: creatorId,
              },
            },
          },
        },
      });

      return playlists ?? [];
    } catch (error) {
      throw { error };
    }
  }),
  ["appears-on-playlists"],
);

export const getPlaylistsBySearchQuery = unstable_cache(
  cache(async ({ query }: { query: string }) => {
    try {
      let playlists = await db.playlist.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
      });
      if (playlists.length === 0) playlists = await db.playlist.findMany();
      const authors = await getArtistsByIds(
        playlists.map((playlist) => playlist.creatorId),
      );
      return { playlists, authors };
    } catch (error) {
      throw { error };
    }
  }),
);
