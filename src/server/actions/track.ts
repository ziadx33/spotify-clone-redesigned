"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "../db";
import { type TracksSliceType } from "@/state/slices/tracks";

export const getTracksByPlaylistId = unstable_cache(
  cache(async (playlistId: string): Promise<TracksSliceType> => {
    try {
      const tracks = await db.track.findMany({
        where: { playlists: { hasSome: [String(playlistId)] } },
      });
      const authors = await db.user.findMany({
        where: { id: { in: tracks?.map((track) => track.authorId) } },
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
