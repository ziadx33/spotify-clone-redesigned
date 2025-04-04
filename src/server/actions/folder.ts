"use server";

import { revalidateTag } from "next/cache";
import { db } from "../db";

export const addPlaylistToFolder = async (
  playlistId: string,
  folderId: string,
  userId: string,
) => {
  try {
    const editedFolder = await db.folder.update({
      where: {
        id: folderId,
      },
      data: {
        playlistIds: {
          push: playlistId,
        },
      },
    });
    revalidateTag(`user-folders-${userId}`);
    return editedFolder;
  } catch (error) {
    throw { error };
  }
};

export const removePlaylistFromFolder = async (
  playlistId: string,
  folderId: string,
  playlistIds: string[],
  userId: string,
) => {
  try {
    const editedFolder = await db.folder.update({
      where: {
        id: folderId,
      },
      data: {
        playlistIds: {
          set: playlistIds.filter((playlist) => playlist !== playlistId),
        },
      },
    });
    revalidateTag(`user-folders-${userId}`);
    return editedFolder;
  } catch (error) {
    throw { error };
  }
};

export const deleteFolder = async (id: string, userId: string) => {
  try {
    const deletedFolder = await db.folder.delete({
      where: {
        id,
      },
    });
    revalidateTag(`user-folders-${userId}`);
    return deletedFolder;
  } catch (error) {
    throw { error };
  }
};

export const createFolder = async (name: string, userId: string) => {
  try {
    const createdFolder = await db.folder.create({
      data: {
        name,
        userId,
      },
    });
    revalidateTag(`user-folders-${userId}`);
    return createdFolder;
  } catch (error) {
    throw { error };
  }
};
