"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "../db";

export const getFolders = unstable_cache(
  cache(async (userId: string) => {
    try {
      const folders = await db.folder.findMany({
        where: {
          userId,
        },
      });
      return folders;
    } catch (error) {
      throw { error };
    }
  }),
  ["folders"],
);

export const addPlaylistToFolder = async (
  playlistId: string,
  folderId: string,
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
    return editedFolder;
  } catch (error) {
    throw { error };
  }
};

export const removePlaylistFromFolder = async (
  playlistId: string,
  folderId: string,
  playlistIds: string[],
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
    return editedFolder;
  } catch (error) {
    throw { error };
  }
};

export const deleteFolder = async (id: string) => {
  try {
    const deletedFolder = await db.folder.delete({
      where: {
        id,
      },
    });
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
    return createdFolder;
  } catch (error) {
    throw { error };
  }
};
