"use server";

import { type $Enums, type Track } from "@prisma/client";
import { getPlaylists } from "./playlist";
import { handleRequests } from "@/utils/handle-requests";
import { db } from "../db";

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
