"use server";

import { db } from "../db";
import { revalidateTag } from "next/cache";
import { type Track, type Playlist } from "@prisma/client";

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

export const updatePlaylist = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Playlist>;
}) => {
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
};

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
