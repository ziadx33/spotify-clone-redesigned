"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "../db";
import { type TracksSliceType } from "@/state/slices/tracks";
import { handleRequests } from "@/utils/handle-requests";
import { type Track, type $Enums, type User } from "@prisma/client";
import { getTopRepeatedNumbers } from "@/utils/get-top-repeated-numbers";
import { type ExploreSliceData } from "@/state/slices/explore";
import { getPlaylists } from "../queries/playlist";

type GetTracksDataParams = {
  tracks: Track[];
  artistType?: $Enums.USER_TYPE;
  disable?: {
    playlists?: boolean;
    artists?: boolean;
  };
};

export const getTracksData = async ({
  tracks,
  artistType,
  disable,
}: GetTracksDataParams) => {
  const requests = [
    !disable?.artists
      ? db.user.findMany({
          where: {
            type: artistType,
            OR: [
              { id: { in: tracks?.map((track) => track.authorId) } },
              {
                id: {
                  in: tracks.map((track) => track?.authorIds ?? []).flat(),
                },
              },
            ],
          },
        })
      : undefined,
    !disable?.playlists
      ? (
          await getPlaylists({
            playlistIds: tracks?.map((track) => track.albumId),
          })
        ).data
      : undefined,
  ] as const;
  const [authors, playlists] = await handleRequests(requests);
  return { authors, playlists };
};

export async function getTracksByPlaylistId(
  playlistId?: string | string[],
  trackIds?: string[],
  albumData?: boolean,
) {
  return await unstable_cache(
    async (): Promise<TracksSliceType> => {
      try {
        const isArray =
          typeof playlistId === "string"
            ? { has: playlistId }
            : { hasSome: playlistId };
        const tracks = await db.track.findMany({
          where: playlistId
            ? !albumData
              ? {
                  OR: [
                    {
                      playlists: isArray,
                    },
                    {
                      albumId: playlistId
                        ? typeof playlistId === "string"
                          ? playlistId
                          : undefined
                        : undefined,
                    },
                  ],
                }
              : {
                  albumId:
                    typeof playlistId === "string"
                      ? playlistId
                      : {
                          in: playlistId,
                        },
                }
            : {
                id: {
                  in: trackIds,
                },
              },
          orderBy: {
            order: "asc",
          },
        });
        const { authors, playlists: data } = await getTracksData({
          tracks: tracks,
        });
        return {
          data: {
            tracks: tracks ?? [],
            authors: authors ?? [],
            albums: data ?? [],
          },
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
    [
      "track",
      `playlist-${typeof playlistId === "string" ? playlistId : playlistId?.join("-")}`,
      "id",
    ],
    {
      tags: [
        `playlist-data-${typeof playlistId === "string" ? playlistId : playlistId?.join("-")}`,
      ],
    },
  )();
}

type GetRecommendedTracksParams = {
  artistIds: string[];
  trackIds: string[];
  range?: {
    from: number;
    to: number;
  };
};

export const getRecommendedTracks = unstable_cache(
  cache(
    async ({
      artistIds,
      trackIds,
      range = { from: 0, to: 15 },
    }: GetRecommendedTracksParams) => {
      try {
        let tracks = await db.track.findMany({
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
          skip: range.from,
          take: range.to,
        });

        if (tracks.length === 0)
          tracks = await db.track.findMany({
            skip: range.from,
            take: range.to,
          });
        const { authors, playlists: data } = await getTracksData({ tracks });
        return { tracks: tracks ?? [], authors, albums: data ?? [] };
      } catch (error) {
        return { error };
      }
    },
  ),
  ["get-recommended-tracks"],
);

export const getTracksBySearchQuery = async ({
  query,
  disablePlaylists = false,
  amount,
  type,
  restartLength,
  skip,
}: {
  query: string;
  disablePlaylists?: boolean;
  amount?: number;
  type?: $Enums.USER_TYPE;
  restartLength?: number;
  skip?: number;
}) => {
  try {
    let tracks = await db.track.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: amount,
      skip,
    });
    if ([0, restartLength].includes(tracks.length))
      tracks = [
        tracks.length > 0 ? (tracks as [Track])[0] : false,
        ...(await db.track.findMany({ take: amount, skip })).filter(
          (track) => track.id !== tracks[0]?.id,
        ),
      ].filter((v) => v) as Track[];
    const { authors, playlists: data } = await getTracksData({
      tracks,
      disable: { playlists: disablePlaylists },
      artistType: type,
    });
    return { tracks: tracks ?? [], authors, albums: data ?? [] };
  } catch (error) {
    throw { error };
  }
};

export const getTracksByPlaylistIds = unstable_cache(
  cache(
    async ({
      authorId,
      playlistIds,
    }: {
      playlistIds: string[];
      authorId?: string;
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

export const getTracksByAlbumId = async (id: string) => {
  try {
    const tracks = await db.track.findMany({ where: { albumId: id } });
    return tracks;
  } catch (error) {
    throw { error };
  }
};

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
    revalidateTag(`playlist-data-${playlistId}`);
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

    revalidateTag(`playlist-data-${playlistId}`);
    return updatedTrack;
  } catch (error) {
    throw { error };
  }
};

type GetPopularTracks = {
  artistId: string | string[];
  range?: {
    from?: number;
    to?: number;
  };
  addAlbums?: boolean;
};

export async function getPopularTracks({
  artistId,
  range = { from: 0 },
  addAlbums,
}: GetPopularTracks) {
  const key = `popular-tracks-${typeof artistId === "string" ? artistId : artistId.join("-")}-${range.from}-${range.to}`;
  return await unstable_cache(
    cache(async () => {
      try {
        const defaultOptions = {
          where: {
            OR: [
              {
                authorId:
                  typeof artistId === "string" ? artistId : { in: artistId },
              },
              {
                authorIds:
                  typeof artistId === "string"
                    ? { has: artistId }
                    : { hasSome: artistId },
              },
            ],
          },
          skip: range?.from ?? 0,
          take:
            range?.to &&
            (Array.isArray(artistId) ? range?.to * artistId.length : range?.to),
        };
        let tracks = await db.track.findMany({
          ...defaultOptions,
          orderBy: {
            plays: "desc",
          },
        });
        if (tracks.length === 0)
          tracks = await db.track.findMany(defaultOptions);
        const [authors, albums] = [
          await db.user.findMany({
            where: {
              OR: [
                { id: { in: tracks?.map((track) => track.authorId) } },
                {
                  id: {
                    in: tracks.map((track) => track?.authorIds ?? []).flat(),
                  },
                },
              ],
            },
          }),
          addAlbums
            ? await getPlaylists({
                playlistIds: tracks?.map((track) => track.albumId),
              })
            : undefined,
        ];
        return {
          tracks,
          authors: authors,
          albums: albums?.data,
        };
      } catch (error) {
        throw { error };
      }
    }),
    [key],
    { tags: [key] },
  )();
}

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

type GetTracksByIdsParams = {
  ids?: string[];
  artistId?: string;
  type?: $Enums.PLAYLIST_TYPE;
};

export const getTracksByIds = unstable_cache(
  cache(async (data: GetTracksByIdsParams) => {
    try {
      const tracks = await db.track.findMany({
        where: {
          AND: [
            {
              id: {
                in: data.ids,
              },
            },
            {
              OR: data.artistId
                ? [
                    {
                      authorIds: {
                        has: data.artistId,
                      },
                    },
                    { authorId: data.artistId },
                  ]
                : undefined,

              album: data.type
                ? {
                    type: data.type,
                  }
                : undefined,
            },
          ],
        },
      });
      return tracks;
    } catch (error) {
      throw { error };
    }
  }),
  ["tracks-by-ids"],
);

type GetUserTopTracksProps = {
  user?: User;
  artistId?: string;
  tracksOnly?: boolean;
};

type NonNullableProperties<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export const getUserTopTracks = unstable_cache(
  cache(
    async ({
      user,
      artistId,
      tracksOnly,
    }: GetUserTopTracksProps): Promise<{
      data: NonNullableProperties<NonNullable<TracksSliceType["data"]>>;
      trackIds: ReturnType<typeof getTopRepeatedNumbers>;
    }> => {
      try {
        const trackHistory = user?.tracksHistory ?? [];
        const trackIds = getTopRepeatedNumbers(trackHistory);
        const tracks = await getTracksByIds({
          ids: trackIds.map((trackIds) => trackIds.id),
          artistId,
        });
        const data = !tracksOnly ? await getTracksData({ tracks }) : undefined;
        return {
          data: {
            tracks: tracks ?? [],
            albums: data?.playlists ?? [],
            authors: data?.authors ?? [],
          },
          trackIds,
        };
      } catch (error) {
        throw { error };
      }
    },
  ),
  [],
);

export type GetUserTopTracksReturnType = Awaited<
  ReturnType<typeof getUserTopTracks>
>;

export const getTrackById = async (trackId: string) => {
  try {
    const track = await db.track.findUnique({
      where: {
        id: trackId,
      },
    });
    return track;
  } catch (error) {
    throw { error };
  }
};

type AddPlaylistToTracksParams = {
  playlistId: string;
  trackIds: string[];
};

export const addPlaylistToTracks = async ({
  playlistId,
  trackIds,
}: AddPlaylistToTracksParams) => {
  try {
    const tracks = await db.track.updateMany({
      where: {
        id: {
          in: trackIds,
        },
      },
      data: {
        playlists: {
          push: playlistId,
        },
      },
    });
    revalidatePath(`/playlist/${playlistId}`);
    return tracks;
  } catch (error) {
    throw { error };
  }
};

export async function getHomeMadeForYouSection(historyTracksIds: string[]) {
  return await unstable_cache(
    async () => {
      try {
        let historyTracks = await db.track.findMany({
          where: {
            id: {
              in: historyTracksIds.slice(0, 50),
            },
          },
        });

        if (historyTracks.length === 0)
          historyTracks = await db.track.findMany({
            take: 50,
            orderBy: { plays: "asc" },
          });

        const historyTracksGenres = [
          ...new Set(
            historyTracks
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              .map((track) => track?.genres)
              .flat()
              .slice(0, 6),
          ),
        ];

        const authorsSet = [
          ...new Set(
            historyTracks
              ?.map((track) => [track.authorId, ...track.authorIds])
              .flat(),
          ),
        ];

        const authors = await db.user.findMany({
          where: {
            id: {
              in: authorsSet,
            },
          },
        });

        const data = historyTracksGenres.map((genre) => {
          const tracks = historyTracks.filter((track) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            track?.genres?.includes(genre),
          );
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            genre,
            tracks,
            authors: authors.filter((user) =>
              tracks
                .map((track) => [track.authorId, ...track.authorIds])
                .flat()
                .includes(user.id),
            ),
          };
        });

        return data;
      } catch (error) {
        throw { error };
      }
    },
    ["home-made-for-you-section"],
    {
      revalidate: 86400,
    },
  )();
}

export const getBestOfArtists = unstable_cache(
  cache(async (id: string) => {
    try {
      const defaultData: Parameters<typeof db.user.findMany>["0"] = {
        skip: 0,
        take: 20,
        where: { type: "ARTIST" },
      };
      let followed = await db.user.findMany({
        ...defaultData,
        where: {
          ...defaultData.where,
          followers: {
            has: id,
          },
        },
      });
      if (followed.length > 0) followed = await db.user.findMany(defaultData);
      const tracks = await getPopularTracks({
        artistId: followed.map((follower) => follower.id),
        addAlbums: true,
      });

      return tracks;
    } catch (error) {
      throw { error };
    }
  }),
  [],
  {
    revalidate: 86400,
  },
);

export async function getTracksByArtistId(id: string, take?: number) {
  const key = `tracks-by-artist-id-${id}`;
  return await unstable_cache(
    async () => {
      try {
        const tracks = await db.track.findMany({
          where: {
            OR: [{ authorId: id }, { authorIds: { has: id } }],
          },
          take,
        });

        const data = await getTracksData({ artistType: "ARTIST", tracks });

        return { data, tracks };
      } catch (error) {
        throw { error };
      }
    },
    [key],
    {
      revalidate: 86400,
      tags: [key],
    },
  )();
}

type EditTrackById = {
  id: string;
  data: NonNullable<Parameters<typeof db.track.update>["0"]>["data"];
  playlistId?: string | null;
};

export const editTrackById = async ({
  id,
  data,
  playlistId,
}: EditTrackById) => {
  try {
    const editedTrack = await db.track.update({
      where: {
        id,
      },
      data,
    });
    if (playlistId) revalidateTag(`playlist-data-${playlistId}`);
    revalidatePath("/liked-songs");
    return editedTrack;
  } catch (error) {
    throw { error };
  }
};

type GetTracksByGenresParams = {
  genres: $Enums.GENRES[];
  range?: {
    from?: number;
    to?: number;
  };
};

export async function getTracksByGenres({
  genres,
  range,
}: GetTracksByGenresParams) {
  const key = `tracks-by-genre-${genres.join("-")}`;
  return await unstable_cache(
    async () => {
      try {
        const tracks = await db.track.findMany({
          where: {
            genres: {
              hasSome: genres,
            },
          },
          skip: range?.from,
          take: range?.to,
          orderBy: {
            dateAdded: "asc",
          },
        });
        const { authors, playlists: albums } = await getTracksData({ tracks });
        const data: ExploreSliceData["data"] = {
          tracks: tracks ?? [],
          albums: albums ?? [],
          authors: authors ?? [],
          randomly: true,
        };
        return data;
      } catch (error) {
        throw { error };
      }
    },
    [key],
    { tags: [key] },
  )();
}

export const getUserLikedSongs = unstable_cache(
  cache(async (userId: string) => {
    try {
      const tracks = await db.track.findMany({
        where: { likedUsers: { has: userId } },
      });

      const { authors, playlists: albums } = await getTracksData({ tracks });

      return { tracks, authors, albums };
    } catch (error) {
      throw { error };
    }
  }),
);

export const createTracks = async (tracks: Track[]) => {
  try {
    const createdTracks = await db.track.createMany({
      data: tracks,
    });
    return createdTracks;
  } catch (error) {
    throw { error };
  }
};

export const deleteTracks = async (trackIds: string[]) => {
  try {
    const deletedTracks = await db.track.deleteMany({
      where: {
        id: {
          in: trackIds,
        },
      },
    });
    return deletedTracks;
  } catch (error) {
    throw { error };
  }
};

export const updateTracks = async (tracks: Track[]) => {
  try {
    const updatedTracks = await handleRequests(
      tracks.map((track) =>
        db.track.update({ where: { id: track.id }, data: track }),
      ),
    );
    return updatedTracks;
  } catch (error) {
    throw { error };
  }
};
