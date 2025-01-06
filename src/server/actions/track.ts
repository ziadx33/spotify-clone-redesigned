"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "../db";
import { type TracksSliceType } from "@/state/slices/tracks";
import { handleRequests } from "@/utils/handle-requests";
import { type Track, type $Enums, type User } from "@prisma/client";
import { getTopRepeatedNumbers } from "@/utils/get-top-repeated-numbers";
import { getPlaylists } from "./playlist";
import { type ExploreSliceData } from "@/state/slices/explore";
import { getUserByIds } from "./user";

type GetTracksDataParams = {
  tracks: Track[];
  artistType: $Enums.USER_TYPE;
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
        const requests = [
          db.user.findMany({
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
        const requests = [
          db.user.findMany({
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
          getPlaylists({ playlistIds: tracks?.map((track) => track.albumId) }),
        ] as const;
        const [authors, { data }] = await handleRequests(requests);
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
    const requests = [
      db.user.findMany({
        where: {
          type,
          OR: [
            { id: { in: tracks?.map((track) => track.authorId) } },
            {
              id: { in: tracks.map((track) => track?.authorIds ?? []).flat() },
            },
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

export const getPopularTracks = unstable_cache(
  cache(
    async ({ artistId, range = { from: 0 }, addAlbums }: GetPopularTracks) => {
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
    },
  ),
  ["popular-tracks"],
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
          id: {
            in: data.ids,
          },
          album: data.type
            ? {
                type: data.type,
              }
            : undefined,
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
};

type NonNullableProperties<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export const getUserTopTracks = unstable_cache(
  cache(
    async ({
      user,
      artistId,
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
        const requests = [
          db.user.findMany({
            where: {
              OR: [
                { id: { in: tracks?.map((track) => track?.authorId ?? "") } },
                {
                  id: {
                    in:
                      tracks?.map((track) => track?.authorIds ?? []).flat() ??
                      [],
                  },
                },
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
  [],
  { revalidate: 86400 },
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

export const getHomeMadeForYouSection = unstable_cache(
  cache(async (historyTracksIds: string[]) => {
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
      const allTracksByGenres = await db.track.findMany({
        where: {
          genres: {
            hasSome: historyTracksGenres,
          },
        },
        take: historyTracksGenres.length * 50,
      });

      const requests = [
        db.user.findMany({
          where: {
            OR: [
              { id: { in: allTracksByGenres?.map((track) => track.authorId) } },
              {
                id: {
                  in: allTracksByGenres
                    .map((track) => track?.authorIds ?? [])
                    .flat(),
                },
              },
            ],
          },
        }),
        getPlaylists({
          playlistIds: allTracksByGenres?.map((track) => track.albumId),
        }),
      ] as const;

      const [authors, albums] = await handleRequests(requests);

      const data = historyTracksGenres.map((genre) => {
        const tracks = allTracksByGenres.filter((track) =>
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
          albums:
            albums.data?.filter((playlist) =>
              tracks.map((track) => track.albumId).includes(playlist.id),
            ) ?? [],
        };
      });

      return data;
    } catch (error) {
      throw { error };
    }
  }),
  ["home-made-for-you-section"],
  {
    revalidate: 86400,
  },
);

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

export const getTracksByArtistId = unstable_cache(
  cache(async (id: string) => {
    try {
      const tracks = await db.track.findMany({
        where: {
          OR: [{ authorId: id }, { authorIds: { has: id } }],
        },
      });

      const data = await getTracksData({ artistType: "ARTIST", tracks });

      return { data, tracks };
    } catch (error) {
      throw { error };
    }
  }),
  ["tracks-by-artist-ids"],
  {
    revalidate: 86400,
  },
);

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

export const getTracksByGenres = async ({
  genres,
  range,
}: GetTracksByGenresParams) => {
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
    const requests = [
      db.user.findMany({
        where: {
          OR: [
            { id: { in: tracks?.map((track) => track?.authorId ?? "") } },
            {
              id: {
                in: tracks?.map((track) => track?.authorIds ?? []).flat() ?? [],
              },
            },
          ],
        },
      }),
      getPlaylists({ playlistIds: tracks?.map((track) => track.albumId) }),
    ] as const;
    const [authors, { data: albums }] = await handleRequests(requests);
    const data: ExploreSliceData["data"] = {
      tracks: tracks ?? [],
      albums: albums ?? [],
      authors,
      randomly: true,
    };
    return data;
  } catch (error) {
    throw { error };
  }
};

export const getUserLikedSongs = unstable_cache(
  cache(async (userId: string) => {
    try {
      const tracks = await db.track.findMany({
        where: { likedUsers: { has: userId } },
      });

      const [authors, { data: albums }] = await handleRequests([
        await getUserByIds(
          tracks.map((track) => [track.authorId, ...track.authorIds]).flat(),
        ),
        await getPlaylists({
          playlistIds: tracks.map((track) => track.albumId),
        }),
      ]);

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
