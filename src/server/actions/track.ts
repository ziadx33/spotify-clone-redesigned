"use server";

import { revalidatePath, unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "../db";
import { type TracksSliceType } from "@/state/slices/tracks";
import { handleRequests } from "@/utils/handle-requests";
import { type Track, type $Enums, type User } from "@prisma/client";
import { getTopRepeatedNumbers } from "@/utils/get-top-repeated-numbers";
import { getPlaylists } from "./playlist";

// type GetTracksDataParams = {
//   tracks: Track[];
//   artistType: $Enums.USER_TYPE;
//   disable?: {
//     playlists?: boolean;
//     artists?: boolean;
//   };
// };

// export const getTracksData = async ({
//   tracks,
//   artistType,
//   disable,
// }: GetTracksDataParams) => {
//   const requests = [
//     !disable?.artists
//       ? db.user.findMany({
//           where: {
//             type: artistType,
//             OR: [
//               { id: { in: tracks?.map((track) => track.authorId) } },
//               {
//                 id: {
//                   in: tracks.map((track) => track?.authorIds ?? []).flat(),
//                 },
//               },
//             ],
//           },
//         })
//       : undefined,
//     !disable?.playlists
//       ? getPlaylists({
//           playlistIds: tracks?.map((track) => track.albumId),
//         })
//       : undefined,
//   ] as const;
//   const [authors, playlists] = await handleRequests(requests);
//   return { authors, playlists };
// };

export const getTracksByPlaylistId = unstable_cache(
  cache(async (playlistId: string | string[]): Promise<TracksSliceType> => {
    try {
      const isArray =
        typeof playlistId === "string"
          ? { has: playlistId }
          : { hasSome: playlistId };
      const tracks = await db.track.findMany({
        where: {
          OR: [
            { playlists: isArray },
            {
              albumId: typeof playlistId === "string" ? playlistId : undefined,
            },
          ],
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
  }),
  ["recommended-tracks"],
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
  artistId: string | string[];
  range: {
    from: number;
    to: number;
  };
  addAlbums?: boolean;
};

export const getPopularTracks = unstable_cache(
  cache(async ({ artistId, range, addAlbums }: GetPopularTracks) => {
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
      };
      let tracks = await db.track.findMany({
        ...defaultOptions,
        orderBy: {
          plays: "desc",
        },

        skip: range.from,
        take: Array.isArray(artistId) ? range.to * artistId.length : range.to,
      });
      if (tracks.length === 0) tracks = await db.track.findMany(defaultOptions);
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

type GetTracksByIdsParams = { ids?: string[]; artistId?: string };

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
        },
      });
      console.log("tracks ger out", tracks);
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
      const historyTracks = await db.track.findMany({
        where: {
          id: {
            in: historyTracksIds.slice(0, 50),
          },
        },
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
      const followed = await db.user.findMany({
        where: {
          followers: {
            has: id,
          },
        },
      });
      const tracks = await getPopularTracks({
        artistId: followed.map((follower) => follower.id),
        range: { from: 0, to: 50 },
        addAlbums: true,
      });

      return tracks;
    } catch (error) {
      throw { error };
    }
  }),
  ["best-of-artists-section"],
  {
    revalidate: 86400,
  },
);
