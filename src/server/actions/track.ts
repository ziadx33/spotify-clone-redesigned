"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "../db";
import { handleRequests } from "@/utils/handle-requests";
import { type Track } from "@prisma/client";

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
