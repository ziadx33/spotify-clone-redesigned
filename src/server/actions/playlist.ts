"use server";

import { type PlaylistsSliceType } from "@/state/slices/playlists";
import { db } from "../db";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { type Track, type $Enums, type Playlist } from "@prisma/client";
import { getArtistsByIds } from "./user";

type GetPlaylistsParams = {
  creatorId?: string | null;
  playlistIds?: string[] | null;
  type?: Playlist["type"];
  excludedIds?: string[];
};

export async function getPlaylists({
  creatorId,
  playlistIds,
  type,
  excludedIds,
}: GetPlaylistsParams) {
  return await unstable_cache(
    async (): Promise<PlaylistsSliceType> => {
      try {
        const playlists = await db.playlist.findMany({
          where: {
            OR: [
              {
                creatorId: creatorId ?? undefined,
              },
              {
                id: {
                  in: playlistIds ?? undefined,
                  notIn: excludedIds,
                },
              },
            ],
            id: {
              notIn: excludedIds,
            },
            type,
          },
        });

        return {
          data: playlists,
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
    },
    ["playlists-by-ids"],
    { tags: [`playlists-${creatorId}`] },
  )();
}

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

export async function getPlaylist(playlistId: string) {
  return await unstable_cache(
    cache(async () => {
      try {
        const playlist = await db.playlist.findUnique({
          where: { id: playlistId },
        });
        return playlist;
      } catch (error) {
        throw { error };
      }
    }),
    ["playlist"],
    { tags: [`playlist-${playlistId}`] },
  )();
}

export const createPlaylist = async (
  data: Parameters<(typeof db)["playlist"]["create"]>["0"]["data"],
) => {
  try {
    const createdPlaylist = db.playlist.create({
      data,
    });
    return createdPlaylist;
  } catch (error) {
    throw { error };
  }
};

export const deletePlaylist = async (id: string) => {
  try {
    const deletedPlaylist = db.playlist.delete({
      where: { id },
    });

    return deletedPlaylist;
  } catch (error) {
    throw { error };
  }
};

export const updatePlaylist = unstable_cache(
  cache(async ({ id, data }: { id: string; data: Partial<Playlist> }) => {
    try {
      const updatedPlaylist = db.playlist.update({
        where: { id },
        data,
      });
      revalidateTag(`playlist-${id}`);
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

export const getPlaylistsBySearchQuery = async ({
  query,
  amount,
  type,
  restartLength,
}: {
  query: string;
  amount?: number;
  type?: $Enums.USER_TYPE;
  restartLength?: number;
}) => {
  try {
    let playlists = await db.playlist.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: amount,
    });

    if (playlists.length === 0 || playlists.length < (restartLength ?? 0)) {
      const firstUser =
        playlists.length > 0 ? (playlists as [Playlist])[0] : false;
      playlists = [
        firstUser,
        ...(await db.playlist.findMany({ take: amount })).filter(
          (user) => user.id !== (firstUser ? firstUser.id : null),
        ),
      ].filter((v) => v) as Playlist[];
    }

    const authors = await getArtistsByIds({
      ids: playlists.map((playlist) => playlist.creatorId),
      type: type,
    });
    return { playlists, authors };
  } catch (error) {
    throw { error };
  }
};
export const getNewPlaylists = unstable_cache(
  cache(async ({ type }: { type: $Enums.GENRES }) => {
    try {
      let playlists = await db.playlist.findMany({
        where: {
          genres: {
            has: type,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 31,
      });
      if (playlists.length === 0) playlists = await db.playlist.findMany();
      const authors = await getArtistsByIds({
        ids: playlists.map((playlist) => playlist.creatorId),
      });
      return { playlists, authors };
    } catch (error) {
      throw { error };
    }
  }),
  ["get-new-releases", "type"],
);

type GetPopularPlaylists = {
  type?: $Enums.GENRES;
  range?: {
    from?: number;
    to?: number;
  };
};

export const getPopularPlaylists = unstable_cache(
  cache(async ({ type, range = { from: 0, to: 20 } }: GetPopularPlaylists) => {
    try {
      const defaultOptions: Parameters<typeof db.playlist.findMany>["0"] = {
        where: {
          genres: type
            ? {
                has: type,
              }
            : undefined,
          visibility: "PUBLIC",
        },
        skip: range?.from,
        take: range?.to,
      };
      const artists = await db.user.findMany({
        orderBy: {
          followers: "asc",
        },
        take: 20,
      });

      let playlists = await db.playlist.findMany({
        ...defaultOptions,
        where: {
          ...defaultOptions.where,
          creatorId: {
            in: artists.map((artist) => artist.id),
          },
        },
        take: 20,
      });

      if (playlists.length === 0) {
        playlists = await db.playlist.findMany(defaultOptions);
      }

      return { playlists, authors: artists };
    } catch (error) {
      throw { error };
    }
  }),
  ["get-popular-releases", "type"],
);

export const addTracksToPlaylist = async ({
  playlistId,
  tracks,
}: {
  playlistId: string;
  tracks: Track[];
}) => {
  try {
    const addedTracks = await db.track.updateMany({
      data: {
        playlists: { push: playlistId },
      },
      where: {
        id: {
          in: tracks
            .filter((track) => !track.playlists.includes(playlistId))
            .map((track) => track.id),
        },
      },
    });
    revalidateTag(`playlist-data-${playlistId}`);
    return addedTracks;
  } catch (error) {
    throw { error };
  }
};

export const getNumberSavedPlaylist = async ({
  playlistId,
}: {
  playlistId: string;
}) => {
  try {
    const numberSaved = await db.user.count({
      where: {
        playlists: {
          has: playlistId,
        },
      },
    });
    return numberSaved;
  } catch (error) {
    throw { error };
  }
};
